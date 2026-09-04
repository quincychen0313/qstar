import React, { useState } from 'react';
import { SynastryResult } from '../engine/types';
import { getCrossAspectInterpretation, getPlanetInPartnerHouseInterpretation } from '../data/synastry-interpretations';
import { Heart, Sparkles, MessageCircle, ShieldCheck, Flame, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CompatibilityReportProps {
  synastry: SynastryResult;
  selectedPlanetA: string | null;
  selectedPlanetB: string | null;
  onSelectPlanetA: (key: string | null) => void;
  onSelectPlanetB: (key: string | null) => void;
}

export const CompatibilityReport: React.FC<CompatibilityReportProps> = ({
  synastry,
  selectedPlanetA,
  selectedPlanetB,
  onSelectPlanetA,
  onSelectPlanetB,
}) => {
  const { t } = useApp();
  const [aspectFilter, setAspectFilter] = useState<'all' | 'harmonious' | 'challenging'>('all');
  const [activeTab, setActiveTab] = useState<'aspects' | 'houses'>('aspects');

  const { chartA, chartB, crossAspects, compatibility, aInBHouses, bInAHouses } = synastry;

  const filteredAspects = crossAspects.filter((a) => {
    if (selectedPlanetA && a.planetA.key !== selectedPlanetA) return false;
    if (selectedPlanetB && a.planetB.key !== selectedPlanetB) return false;

    if (aspectFilter === 'harmonious') {
      return a.nature === 'harmonious' || a.aspectType === 'conjunction';
    }
    if (aspectFilter === 'challenging') {
      return a.nature === 'challenging';
    }
    return true;
  });

  const dimensions = [
    {
      name: t('soulResonance'),
      score: compatibility.soulResonance,
      icon: Sparkles,
      color: 'text-amber-500 dark:text-amber-400',
      barColor: 'bg-amber-500 dark:bg-amber-400',
      desc: '心靈相吸與情感安全感共鳴',
    },
    {
      name: t('romanticAttraction'),
      score: compatibility.romanticAttraction,
      icon: Flame,
      color: 'text-rose-500 dark:text-rose-400',
      barColor: 'bg-rose-500 dark:bg-rose-400',
      desc: '浪漫火花與天然肢體相吸魅力',
    },
    {
      name: t('communication'),
      score: compatibility.communication,
      icon: MessageCircle,
      color: 'text-sky-500 dark:text-sky-400',
      barColor: 'bg-sky-500 dark:bg-sky-400',
      desc: '觀點同頻與日常交談順暢度',
    },
    {
      name: t('longTermStability'),
      score: compatibility.longTermStability,
      icon: ShieldCheck,
      color: 'text-emerald-500 dark:text-emerald-400',
      barColor: 'bg-emerald-500 dark:bg-emerald-400',
      desc: '責任感、信任基底與承諾意願',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. 契合度總評儀表板 */}
      <div className="bg-white/90 dark:bg-gradient-to-br dark:from-purple-950/40 dark:via-slate-900/90 dark:to-slate-950/90 border border-slate-200 dark:border-purple-500/30 rounded-2xl p-6 shadow-md dark:shadow-2xl backdrop-blur-xl transition-colors">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-950 border-4 border-amber-400 dark:border-amber-400/80 flex flex-col items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-300 font-mono">
                {compatibility.overallScore}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('compatibilityScore')}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  {compatibility.chemistryLabel}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {chartA.birthData.name} × {chartB.birthData.name}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl">
                {compatibility.summary}
              </p>
            </div>
          </div>

          {/* 右側四維量化儀表 */}
          <div className="w-full lg:w-80 grid grid-cols-2 gap-3">
            {dimensions.map((dim) => {
              const Icon = dim.icon;
              return (
                <div
                  key={dim.name}
                  className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <Icon className={`w-3.5 h-3.5 ${dim.color}`} />
                      <span>{dim.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-200">
                      {dim.score}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full ${dim.barColor} transition-all duration-500`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate">{dim.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 分頁切換 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('aspects')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                activeTab === 'aspects'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{t('crossAspectsTab')} ({crossAspects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('houses')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                activeTab === 'houses'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t('partnerHousesTab')}</span>
            </button>
          </div>

          {activeTab === 'aspects' && (
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setAspectFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  aspectFilter === 'all'
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-amber-300 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t('all')}
              </button>
              <button
                onClick={() => setAspectFilter('harmonious')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  aspectFilter === 'harmonious'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t('harmonious')}
              </button>
              <button
                onClick={() => setAspectFilter('challenging')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  aspectFilter === 'challenging'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t('challenging')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. 交叉相位清單 */}
      {activeTab === 'aspects' && (
        <div className="space-y-3">
          {(selectedPlanetA || selectedPlanetB) && (
            <div className="flex items-center justify-between bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-xl px-4 py-2 text-xs text-sky-800 dark:text-sky-200">
              <span>
                目前篩選：
                {selectedPlanetA && `【${chartA.birthData.name}】的 ${selectedPlanetA} `}
                {selectedPlanetB && `【${chartB.birthData.name}】的 ${selectedPlanetB}`}
              </span>
              <button
                onClick={() => {
                  onSelectPlanetA(null);
                  onSelectPlanetB(null);
                }}
                className="underline hover:text-sky-950 dark:hover:text-white font-medium"
              >
                {t('showAll')}
              </button>
            </div>
          )}

          {filteredAspects.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm bg-white/70 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800">
              在此篩選條件下無顯著交叉相位。
            </div>
          ) : (
            filteredAspects.map((aspect, idx) => {
              const interpretation = getCrossAspectInterpretation(
                `${chartA.birthData.name} 的${aspect.planetA.name}`,
                `${chartB.birthData.name} 的${aspect.planetB.name}`,
                aspect.planetA.key,
                aspect.planetB.key,
                aspect.aspectType
              );

              return (
                <div
                  key={idx}
                  className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 transition-all shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-700 dark:text-amber-300 text-xs sm:text-sm flex items-center gap-1">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300">
                          {chartA.birthData.name}
                        </span>
                        <span>{aspect.planetA.symbol}</span>
                        <span>{aspect.planetA.name}</span>
                      </span>

                      <span
                        className="font-bold text-xs px-2 py-0.5 rounded flex items-center gap-1"
                        style={{
                          backgroundColor: `${aspect.color}15`,
                          color: aspect.color,
                          border: `1px solid ${aspect.color}40`,
                        }}
                      >
                        {aspect.symbol} {aspect.name} ({aspect.angle}°)
                      </span>

                      <span className="font-bold text-sky-700 dark:text-sky-300 text-xs sm:text-sm flex items-center gap-1">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-800 dark:text-sky-300">
                          {chartB.birthData.name}
                        </span>
                        <span>{aspect.planetB.symbol}</span>
                        <span>{aspect.planetB.name}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                        {t('orb')} {aspect.orb}°
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          aspect.nature === 'harmonious'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : aspect.nature === 'challenging'
                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            : 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                        }`}
                      >
                        {aspect.nature === 'harmonious' ? t('harmonious') : t('challenging')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/80 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800/60">
                    {interpretation}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 3. 行星落入對方宮位 */}
      {activeTab === 'houses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
            <h4 className="text-sm font-bold text-amber-700 dark:text-amber-300 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
              {chartA.birthData.name} 的行星 ➔ 落入 {chartB.birthData.name} 的宮位
            </h4>
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {aInBHouses.slice(0, 7).map((item, idx) => {
                const interp = getPlanetInPartnerHouseInterpretation(
                  item.planet.key,
                  item.planet.name,
                  item.houseInPartner,
                  chartB.birthData.name
                );
                return (
                  <div key={idx} className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-amber-700 dark:text-amber-300">
                        {item.planet.symbol} {item.planet.name}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-850 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700">
                        落入對方的{item.houseThemeName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{interp}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
            <h4 className="text-sm font-bold text-sky-700 dark:text-sky-300 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-400" />
              {chartB.birthData.name} 的行星 ➔ 落入 {chartA.birthData.name} 的宮位
            </h4>
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {bInAHouses.slice(0, 7).map((item, idx) => {
                const interp = getPlanetInPartnerHouseInterpretation(
                  item.planet.key,
                  item.planet.name,
                  item.houseInPartner,
                  chartA.birthData.name
                );
                return (
                  <div key={idx} className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-sky-700 dark:text-sky-300">
                        {item.planet.symbol} {item.planet.name}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-850 text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700">
                        落入對方的{item.houseThemeName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{interp}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
