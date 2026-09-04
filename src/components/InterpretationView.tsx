import React, { useState } from 'react';
import { NatalChartResult } from '../engine/types';
import { ZODIAC_SIGNS } from '../data/zodiac';
import {
  ZODIAC_INTERPRETATIONS,
  HOUSES_THEMES,
  getPlanetInHouseInterpretation,
  getAspectInterpretation,
} from '../data/interpretations';
import { Sparkles, BookOpen, Compass, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface InterpretationViewProps {
  chart: NatalChartResult;
  selectedPlanetKey: string | null;
  onSelectPlanet: (key: string | null) => void;
}

export const InterpretationView: React.FC<InterpretationViewProps> = ({
  chart,
  selectedPlanetKey,
  onSelectPlanet,
}) => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'planets' | 'houses' | 'aspects'
  >('overview');

  const { sun, moon, ascendant } = chart.bigThree;
  const sunSign = ZODIAC_SIGNS[sun.signKey];
  const moonSign = ZODIAC_SIGNS[moon.signKey];
  const ascSign = ZODIAC_SIGNS[ascendant.signKey];

  const sunInterp = ZODIAC_INTERPRETATIONS[sun.signKey];
  const moonInterp = ZODIAC_INTERPRETATIONS[moon.signKey];
  const ascInterp = ZODIAC_INTERPRETATIONS[ascendant.signKey];

  return (
    <div className="bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-md dark:shadow-2xl backdrop-blur-xl transition-colors">
      {/* 標題與分頁切換 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            {t('interpretationTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('interpretationSubtitle')}
          </p>
        </div>

        {/* 分頁按鈕 */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          {[
            { id: 'overview', label: t('tabOverview'), icon: Sparkles },
            { id: 'planets', label: t('tabPlanets'), icon: BookOpen },
            { id: 'houses', label: t('tabHouses'), icon: Compass },
            { id: 'aspects', label: t('tabAspects'), icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as 'overview' | 'planets' | 'houses' | 'aspects'
                  )
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. 核心畫像 (Overview) */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-sky-500/10 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('bigThreeSummaryTitle')}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              您的命盤以 <strong className="text-amber-600 dark:text-amber-300">{sunSign.name}</strong>{' '}
              為核心追求，內心情感由{' '}
              <strong className="text-indigo-600 dark:text-indigo-300">{moonSign.name}</strong> 掌舵，並透過{' '}
              <strong className="text-emerald-600 dark:text-emerald-300">{ascSign.name}</strong>{' '}
              向世界展現第一印象。這構成了一幅兼具「
              {sunInterp.keywords.join(' · ')}」的外在抱負，以及「
              {moonInterp.keywords.join(' · ')}」的內在深情靈魂輪廓。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 太陽解讀 */}
            <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 text-sm">
                  <span>☉</span> 太陽 {sunSign.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {t('houseLabel', { n: sun.house })}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {sunInterp.sunSummary}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {t('strengthsTitle')}
                </div>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {sunInterp.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 月亮解讀 */}
            <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-300 flex items-center gap-1.5 text-sm">
                  <span>☽</span> 月亮 {moonSign.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {t('houseLabel', { n: moon.house })}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {moonInterp.moonSummary}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {t('growthLessonsTitle')}
                </div>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {moonInterp.growthLessons.map((l, idx) => (
                    <li key={idx}>{l}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 上升解讀 */}
            <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-sm">
                  <span>✦</span> 上升 {ascSign.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {t('ascHouseLabel')}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {ascInterp.ascendantSummary}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {t('firstImpressionTitle')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ascInterp.keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 行星落宮 (Planets) */}
      {activeTab === 'planets' && (
        <div className="space-y-4 animate-fade-in">
          {chart.planets.map((planet) => {
            const sign = ZODIAC_SIGNS[planet.signKey];
            const houseInfo = HOUSES_THEMES[planet.house];
            const houseInterp = getPlanetInHouseInterpretation(
              planet.key,
              planet.house
            );
            const isSelected = selectedPlanetKey === planet.key;

            return (
              <div
                key={planet.key}
                onClick={() =>
                  onSelectPlanet(isSelected ? null : planet.key)
                }
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-amber-500 dark:text-amber-400">
                      {planet.symbol}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {planet.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      落在 {sign.symbol} {sign.name}{' '}
                      <span className="font-mono">
                        {planet.degrees}°{planet.minutes.toString().padStart(2, '0')}'
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-850 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 font-medium">
                      {t('houseLabel', { n: planet.house })} · {houseInfo?.name}
                    </span>
                    {planet.isRetrograde && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium">
                        {t('retrograde')}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {houseInterp}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. 十二宮位 (Houses) */}
      {activeTab === 'houses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {chart.houses.map((house) => {
            const theme = HOUSES_THEMES[house.house];
            const planetsInHouse = chart.planets.filter(
              (p) => p.house === house.house
            );

            return (
              <div
                key={house.house}
                className="bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center">
                      {house.house}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {theme?.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    宮頭: {house.signSymbol} {house.signName} {house.degrees}°{house.minutes.toString().padStart(2, '0')}'
                  </span>
                </div>

                <div className="text-xs font-semibold text-amber-700 dark:text-amber-300/90">
                  領域主題：{theme?.coreTheme}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  掌管人生：{theme?.lifeArea}
                </p>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">落入行星:</span>
                  {planetsInHouse.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {planetsInHouse.map((p) => (
                        <span
                          key={p.key}
                          onClick={() => onSelectPlanet(p.key)}
                          className="text-[11px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-400 transition"
                        >
                          {p.symbol} {p.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 dark:text-slate-600">無主要行星駐留（空宮）</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. 相位動能 (Aspects) */}
      {activeTab === 'aspects' && (
        <div className="space-y-3 animate-fade-in">
          {chart.aspects.map((aspect, idx) => {
            const interp = getAspectInterpretation(
              aspect.planet1.name,
              aspect.planet2.name,
              aspect.aspectType
            );

            return (
              <div
                key={idx}
                className="bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                    <span>{aspect.planet1.name}</span>
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: `${aspect.color}15`,
                        color: aspect.color,
                        border: `1px solid ${aspect.color}40`,
                      }}
                    >
                      {aspect.symbol} {aspect.name}
                    </span>
                    <span>{aspect.planet2.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">
                      {t('orb')} {aspect.orb}°
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        aspect.nature === 'harmonious'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : aspect.nature === 'challenging'
                          ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                      }`}
                    >
                      {aspect.nature === 'harmonious'
                        ? t('natureHarmonious')
                        : aspect.nature === 'challenging'
                        ? t('natureChallenging')
                        : t('natureNeutral')}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {interp}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
