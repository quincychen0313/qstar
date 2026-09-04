import { useState, useMemo, useEffect } from 'react';
import { BirthData, ChartAppMode, RelationshipType } from './engine/types';
import { calculateNatalChart, calculateSynastryChart, calculateCompositeChart } from './engine';
import { ChartWheel } from './components/ChartWheel';
import { BirthForm } from './components/BirthForm';
import { BigThreeBanner } from './components/BigThreeBanner';
import { PlanetsTable } from './components/PlanetsTable';
import { AspectsGrid } from './components/AspectsGrid';
import { ElementBalanceBar } from './components/ElementBalanceBar';
import { InterpretationView } from './components/InterpretationView';
import { SavedProfilesModal } from './components/SavedProfilesModal';
import { SynastryWheel } from './components/SynastryWheel';
import { CompatibilityReport } from './components/CompatibilityReport';
import { CompositeView } from './components/CompositeView';
import { DualBirthModal } from './components/DualBirthModal';
import { Navbar } from './components/Navbar';
import { useApp } from './context/AppContext';
import confetti from 'canvas-confetti';
import { Sparkles, Calendar, MapPin, Compass, Info, X, Heart, Users, ArrowLeftRight } from 'lucide-react';

const INITIAL_PARTNER_A: BirthData = {
  name: '盤主 A (我)',
  year: 1996,
  month: 10,
  day: 24,
  hour: 14,
  minute: 30,
  isUnknownTime: false,
  cityName: '台北市',
  latitude: 25.033,
  longitude: 121.5654,
  timezoneOffset: 8,
  houseSystem: 'placidus',
};

const INITIAL_PARTNER_B: BirthData = {
  name: '盤主 B (伴侶/好友)',
  year: 1998,
  month: 6,
  day: 8,
  hour: 9,
  minute: 15,
  isUnknownTime: false,
  cityName: '東京',
  latitude: 35.6762,
  longitude: 139.6503,
  timezoneOffset: 9,
  houseSystem: 'placidus',
};

export function App() {
  const { t } = useApp();
  const [currentMode, setCurrentMode] = useState<ChartAppMode>('natal');
  const [partnerA, setPartnerA] = useState<BirthData>(INITIAL_PARTNER_A);
  const [partnerB, setPartnerB] = useState<BirthData>(INITIAL_PARTNER_B);
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('romance');

  // 彈窗控制
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDualModalOpen, setIsDualModalOpen] = useState(false);
  const [isSavedProfilesOpen, setIsSavedProfilesOpen] = useState(false);

  // 選取互動狀態
  const [selectedPlanetKey, setSelectedPlanetKey] = useState<string | null>(null);
  const [selectedPlanetA, setSelectedPlanetA] = useState<string | null>(null);
  const [selectedPlanetB, setSelectedPlanetB] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'dashboard' | 'report' | 'wheel-focus'>('dashboard');

  // 計算個人本命盤
  const natalChart = useMemo(() => {
    return calculateNatalChart(partnerA);
  }, [partnerA]);

  // 計算雙人合盤 (Synastry)
  const synastryChart = useMemo(() => {
    return calculateSynastryChart(partnerA, partnerB, relationshipType);
  }, [partnerA, partnerB, relationshipType]);

  // 計算關係中點組合盤 (Composite)
  const compositeChart = useMemo(() => {
    return calculateCompositeChart(partnerA, partnerB);
  }, [partnerA, partnerB]);

  // 施放星彩紙屑
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.2 },
        colors: ['#fbbf24', '#38bdf8', '#818cf8', '#ec4899'],
      });
    } catch {
      // safe fallback
    }
  };

  useEffect(() => {
    triggerCelebration();
  }, [currentMode, partnerA.name, partnerB.name]);

  const handleSingleFormSubmit = (data: BirthData) => {
    setPartnerA(data);
    setIsFormOpen(false);
    triggerCelebration();
  };

  const handleDualSave = (dataA: BirthData, dataB: BirthData, relType: RelationshipType) => {
    setPartnerA(dataA);
    setPartnerB(dataB);
    setRelationshipType(relType);
    triggerCelebration();
  };

  const handleSwapPartners = () => {
    const temp = { ...partnerA };
    setPartnerA({ ...partnerB });
    setPartnerB(temp);
    setSelectedPlanetA(null);
    setSelectedPlanetB(null);
  };

  return (
    <>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#080c16] text-slate-800 dark:text-slate-100 flex flex-col celestial-bg transition-colors duration-200">
      {/* 頂部導航列 */}
      <Navbar
        currentMode={currentMode}
        onModeChange={(m) => {
          setCurrentMode(m);
          setSelectedPlanetKey(null);
          setSelectedPlanetA(null);
          setSelectedPlanetB(null);
        }}
        partnerA={partnerA}
        partnerB={partnerB}
        onOpenForm={() => setIsFormOpen(true)}
        onOpenDualModal={() => setIsDualModalOpen(true)}
        onOpenSavedProfiles={() => setIsSavedProfilesOpen(true)}
      />

      {/* 主內容區 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ────────────────── 1. 個人本命盤模式 (Natal) ────────────────── */}
        {currentMode === 'natal' && (
          <div className="space-y-6 animate-fade-in">
            {/* 生辰盤面摘要資訊列 */}
            <div className="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-sm">
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-300 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>{partnerA.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {partnerA.year}年{partnerA.month}月{partnerA.day}日{' '}
                    {partnerA.isUnknownTime
                      ? `(${t('unknownTime')}·正午盤)`
                      : `${partnerA.hour.toString().padStart(2, '0')}:${partnerA.minute.toString().padStart(2, '0')}`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  <span>
                    {partnerA.cityName} (
                    {partnerA.latitude >= 0 ? `${partnerA.latitude.toFixed(2)}°N` : `${Math.abs(partnerA.latitude).toFixed(2)}°S`},{' '}
                    {partnerA.longitude >= 0 ? `${partnerA.longitude.toFixed(2)}°E` : `${Math.abs(partnerA.longitude).toFixed(2)}°W`})
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    {t('houseSystem')}：
                    {partnerA.houseSystem === 'placidus'
                      ? t('placidus')
                      : partnerA.houseSystem === 'whole-sign'
                      ? t('wholeSign')
                      : t('equal')}
                  </span>
                </div>
              </div>

              {/* 視圖切換 */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <button
                  onClick={() => setViewTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition font-medium ${
                    viewTab === 'dashboard'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t('dashboard')}
                </button>
                <button
                  onClick={() => setViewTab('wheel-focus')}
                  className={`px-3 py-1.5 rounded-lg transition font-medium ${
                    viewTab === 'wheel-focus'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t('wheelFocus')}
                </button>
                <button
                  onClick={() => setViewTab('report')}
                  className={`px-3 py-1.5 rounded-lg transition font-medium ${
                    viewTab === 'report'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t('deepReport')}
                </button>
              </div>
            </div>

            {/* 星盤三巨頭速覽 */}
            <BigThreeBanner
              chart={natalChart}
              onSelectPlanet={setSelectedPlanetKey}
            />

            {viewTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md dark:shadow-xl backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-5 relative">
                    <div className="w-full flex items-center justify-between mb-1 px-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                        {t('interactiveWheelTitle')}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {t('interactiveWheelHint')}
                      </span>
                    </div>

                    <ChartWheel
                      chart={natalChart}
                      selectedPlanetKey={selectedPlanetKey}
                      onSelectPlanet={setSelectedPlanetKey}
                    />
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <PlanetsTable
                      planets={natalChart.planets}
                      selectedPlanetKey={selectedPlanetKey}
                      onSelectPlanet={setSelectedPlanetKey}
                    />

                    <ElementBalanceBar
                      elementBalance={natalChart.elementBalance}
                      modalityBalance={natalChart.modalityBalance}
                    />
                  </div>
                </div>

                <AspectsGrid
                  aspects={natalChart.aspects}
                  planets={natalChart.planets}
                  selectedPlanetKey={selectedPlanetKey}
                  onSelectPlanet={setSelectedPlanetKey}
                />

                <InterpretationView
                  chart={natalChart}
                  selectedPlanetKey={selectedPlanetKey}
                  onSelectPlanet={setSelectedPlanetKey}
                />
              </div>
            )}

            {viewTab === 'wheel-focus' && (
              <div className="space-y-6">
                <div className="bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md dark:shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {t('wheelFocus')}
                  </h3>
                  <ChartWheel
                    chart={natalChart}
                    selectedPlanetKey={selectedPlanetKey}
                    onSelectPlanet={setSelectedPlanetKey}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PlanetsTable
                    planets={natalChart.planets}
                    selectedPlanetKey={selectedPlanetKey}
                    onSelectPlanet={setSelectedPlanetKey}
                  />
                  <AspectsGrid
                    aspects={natalChart.aspects}
                    planets={natalChart.planets}
                    selectedPlanetKey={selectedPlanetKey}
                    onSelectPlanet={setSelectedPlanetKey}
                  />
                </div>
              </div>
            )}

            {viewTab === 'report' && (
              <div className="space-y-6">
                <InterpretationView
                  chart={natalChart}
                  selectedPlanetKey={selectedPlanetKey}
                  onSelectPlanet={setSelectedPlanetKey}
                />
              </div>
            )}
          </div>
        )}

        {/* ────────────────── 2. 雙人合盤模式 (Synastry) ────────────────── */}
        {currentMode === 'synastry' && (
          <div className="space-y-6 animate-fade-in">
            {/* 合盤頂部資訊條 */}
            <div className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-sm">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                  <span className="font-bold text-amber-700 dark:text-amber-300">
                    {t('innerRing')}：{partnerA.name} ({partnerA.year}/{partnerA.month}/{partnerA.day})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-sky-400" />
                  <span className="font-bold text-sky-700 dark:text-sky-300">
                    {t('outerRing')}：{partnerB.name} ({partnerB.year}/{partnerB.month}/{partnerB.day})
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-slate-700">
                  {relationshipType === 'romance'
                    ? t('romance')
                    : relationshipType === 'friendship'
                    ? t('friendship')
                    : t('business')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSwapPartners}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 text-xs transition font-medium"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>{t('swapInnerOuter')}</span>
                </button>
                <button
                  onClick={() => setIsDualModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow transition"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{t('changePartners')}</span>
                </button>
              </div>
            </div>

            {/* 雙同心圓輪盤 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md dark:shadow-xl backdrop-blur-xl p-4 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-1 px-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    {t('synastryWheelTitle')}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {t('synastryWheelHint')}
                  </span>
                </div>

                <SynastryWheel
                  synastry={synastryChart}
                  selectedPlanetA={selectedPlanetA}
                  selectedPlanetB={selectedPlanetB}
                  onSelectPlanetA={setSelectedPlanetA}
                  onSelectPlanetB={setSelectedPlanetB}
                  onSwapPartners={handleSwapPartners}
                />
              </div>

              {/* 雙人行星度數對照 */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md dark:shadow-xl backdrop-blur-xl">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    {t('corePlanetsComparison')}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {['sun', 'moon', 'mercury', 'venus', 'mars', 'saturn'].map((key) => {
                      const pA = synastryChart.chartA.planets.find((p) => p.key === key)!;
                      const pB = synastryChart.chartB.planets.find((p) => p.key === key)!;
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-1.5 w-1/3 text-amber-700 dark:text-amber-300 font-medium">
                            <span className="font-bold">{pA.name}</span>
                            <span className="text-slate-500 dark:text-slate-400 font-mono">
                              {pA.signSymbol} {pA.degrees}°
                            </span>
                          </div>
                          <span className="text-slate-400 dark:text-slate-600 text-xs">⟷</span>
                          <div className="flex items-center justify-end gap-1.5 w-1/3 text-sky-700 dark:text-sky-300 font-medium">
                            <span className="text-slate-500 dark:text-slate-400 font-mono">
                              {pB.signSymbol} {pB.degrees}°
                            </span>
                            <span className="font-bold">{pB.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 前往中點組合盤引導卡片 */}
                <div className="bg-gradient-to-br from-purple-100 dark:from-purple-950/50 to-white dark:to-slate-900/90 border border-purple-200 dark:border-purple-500/30 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <h5 className="text-xs font-bold text-purple-900 dark:text-purple-300 mb-1">
                      {t('switchToComposite')}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t('switchToCompositeDesc')}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentMode('composite')}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow shrink-0 ml-3"
                  >
                    {t('gotoComposite')}
                  </button>
                </div>
              </div>
            </div>

            <CompatibilityReport
              synastry={synastryChart}
              selectedPlanetA={selectedPlanetA}
              selectedPlanetB={selectedPlanetB}
              onSelectPlanetA={setSelectedPlanetA}
              onSelectPlanetB={setSelectedPlanetB}
            />
          </div>
        )}

        {/* ────────────────── 3. 關係中點組合盤模式 (Composite) ────────────────── */}
        {currentMode === 'composite' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {t('compositeTitle')}：
                  <strong className="text-amber-600 dark:text-amber-300">{partnerA.name}</strong> ×{' '}
                  <strong className="text-sky-600 dark:text-sky-300">{partnerB.name}</strong>
                </span>
                <span className="text-slate-400 hidden sm:inline">
                  (劣弧幾何中點演算法)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMode('synastry')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 text-xs transition font-medium"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{t('synastryChart')}</span>
                </button>
                <button
                  onClick={() => setIsDualModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow transition"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{t('changePartners')}</span>
                </button>
              </div>
            </div>

            <CompositeView composite={compositeChart} />
          </div>
        )}
      </main>

      {/* 單人排盤彈窗 Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <BirthForm
              initialData={partnerA}
              onSubmit={handleSingleFormSubmit}
            />
          </div>
        </div>
      )}

      {/* 雙人合盤設定彈窗 Modal */}
      <DualBirthModal
        isOpen={isDualModalOpen}
        onClose={() => setIsDualModalOpen(false)}
        partnerA={partnerA}
        partnerB={partnerB}
        relationshipType={relationshipType}
        onSave={handleDualSave}
      />

      {/* 已儲存檔案管理彈窗 */}
      <SavedProfilesModal
        isOpen={isSavedProfilesOpen}
        onClose={() => setIsSavedProfilesOpen(false)}
        currentData={partnerA}
        onSelectProfile={(item) => {
          setPartnerA(item);
          triggerCelebration();
        }}
      />

      {/* 頁尾 */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2 mt-12 transition-colors">
        <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400/90 font-serif">
          <span>{t('footerMotto')}</span>
        </div>
        <p>{t('footerTech')}</p>
        <p className="text-slate-400 dark:text-slate-500 text-[11px] flex items-center justify-center gap-1">
          <Info className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          {t('footerPhilosophy')}
        </p>
      </footer>
      </div>
    </>
  );
}

export default App;
