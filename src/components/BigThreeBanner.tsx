import React from 'react';
import { NatalChartResult } from '../engine/types';
import { ZODIAC_SIGNS } from '../data/zodiac';
import { ZODIAC_INTERPRETATIONS } from '../data/interpretations';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BigThreeBannerProps {
  chart: NatalChartResult;
  onSelectPlanet: (planetKey: string | null) => void;
}

export const BigThreeBanner: React.FC<BigThreeBannerProps> = ({
  chart,
  onSelectPlanet,
}) => {
  const { t } = useApp();
  const { sun, moon, ascendant } = chart.bigThree;

  const sunSign = ZODIAC_SIGNS[sun.signKey];
  const moonSign = ZODIAC_SIGNS[moon.signKey];
  const ascSign = ZODIAC_SIGNS[ascendant.signKey];

  const sunInterp = ZODIAC_INTERPRETATIONS[sun.signKey];
  const moonInterp = ZODIAC_INTERPRETATIONS[moon.signKey];
  const ascInterp = ZODIAC_INTERPRETATIONS[ascendant.signKey];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 太陽星座 */}
      <div
        onClick={() => onSelectPlanet('sun')}
        className="group relative bg-white/80 dark:bg-gradient-to-br dark:from-amber-500/10 dark:via-slate-900/90 dark:to-slate-950/90 border border-amber-400/40 dark:border-amber-500/30 hover:border-amber-500 rounded-2xl p-5 shadow-md dark:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Sun className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-300">
              {t('sunSign')}
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {t('houseLabel', { n: sun.house })}
          </span>
        </div>

        <div className="flex items-baseline gap-2.5 mb-1">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {sunSign.name}
          </span>
          <span className="text-2xl text-amber-500 dark:text-amber-400">{sunSign.symbol}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {sun.degrees}°{sun.minutes.toString().padStart(2, '0')}'
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            {sunSign.elementName} · {sunSign.modalityName}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('sunDesc')}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300/90 leading-relaxed line-clamp-2">
          {sunInterp?.sunSummary || '展現核心人格活力與人生前進力量。'}
        </p>
      </div>

      {/* 月亮星座 */}
      <div
        onClick={() => onSelectPlanet('moon')}
        className="group relative bg-white/80 dark:bg-gradient-to-br dark:from-indigo-500/10 dark:via-slate-900/90 dark:to-slate-950/90 border border-indigo-400/40 dark:border-indigo-500/30 hover:border-indigo-500 rounded-2xl p-5 shadow-md dark:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-300">
              <Moon className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
              {t('moonSign')}
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {t('houseLabel', { n: moon.house })}
          </span>
        </div>

        <div className="flex items-baseline gap-2.5 mb-1">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {moonSign.name}
          </span>
          <span className="text-2xl text-indigo-500 dark:text-indigo-300">{moonSign.symbol}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {moon.degrees}°{moon.minutes.toString().padStart(2, '0')}'
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
            {moonSign.elementName} · {moonSign.modalityName}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('moonDesc')}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300/90 leading-relaxed line-clamp-2">
          {moonInterp?.moonSummary || '深層的情感需求與潛意識直覺反映。'}
        </p>
      </div>

      {/* 上升星座 */}
      <div className="group relative bg-white/80 dark:bg-gradient-to-br dark:from-emerald-500/10 dark:via-slate-900/90 dark:to-slate-950/90 border border-emerald-400/40 dark:border-emerald-500/30 hover:border-emerald-500 rounded-2xl p-5 shadow-md dark:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
              {t('ascendantSign')}
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {t('ascHouseLabel')}
          </span>
        </div>

        <div className="flex items-baseline gap-2.5 mb-1">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {ascSign.name}
          </span>
          <span className="text-2xl text-emerald-500 dark:text-emerald-400">{ascSign.symbol}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {ascendant.degrees}°{ascendant.minutes.toString().padStart(2, '0')}'
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            {ascSign.elementName} · {ascSign.modalityName}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('ascDesc')}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300/90 leading-relaxed line-clamp-2">
          {ascInterp?.ascendantSummary || '給人的第一印象與看待世界的視角方式。'}
        </p>
      </div>
    </div>
  );
};
