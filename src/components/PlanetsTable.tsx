import React, { useState } from 'react';
import { PlanetPosition } from '../engine/types';
import { ZODIAC_SIGNS, PLANETS_META } from '../data/zodiac';
import { HOUSES_THEMES } from '../data/interpretations';
import { useApp } from '../context/AppContext';

interface PlanetsTableProps {
  planets: PlanetPosition[];
  selectedPlanetKey: string | null;
  onSelectPlanet: (key: string | null) => void;
}

export const PlanetsTable: React.FC<PlanetsTableProps> = ({
  planets,
  selectedPlanetKey,
  onSelectPlanet,
}) => {
  const { t } = useApp();
  const [filterCategory, setFilterCategory] = useState<
    'all' | 'luminary' | 'personal' | 'social' | 'transpersonal' | 'point'
  >('all');

  const filteredPlanets = planets.filter((p) => {
    if (filterCategory === 'all') return true;
    const meta = PLANETS_META[p.key];
    return meta?.category === filterCategory;
  });

  return (
    <div className="bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md dark:shadow-xl backdrop-blur-xl transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t('planetTableTitle')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('planetTableSubtitle')}
          </p>
        </div>

        {/* 分類標籤 */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', label: t('all') },
            { id: 'personal', label: t('personalPlanets') },
            { id: 'social', label: t('socialPlanets') },
            { id: 'transpersonal', label: t('transpersonalPlanets') },
            { id: 'point', label: t('points') },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setFilterCategory(
                  cat.id as 'all' | 'luminary' | 'personal' | 'social' | 'transpersonal' | 'point'
                )
              }
              className={`text-xs px-2.5 py-1 rounded-lg transition ${
                filterCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">{t('planetCol')}</th>
              <th className="py-2.5 px-3">{t('signCol')}</th>
              <th className="py-2.5 px-3">{t('degreeCol')}</th>
              <th className="py-2.5 px-3">{t('houseCol')}</th>
              <th className="py-2.5 px-3 text-center">{t('statusCol')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
            {filteredPlanets.map((planet) => {
              const sign = ZODIAC_SIGNS[planet.signKey];
              const houseTheme = HOUSES_THEMES[planet.house];
              const isSelected = selectedPlanetKey === planet.key;

              return (
                <tr
                  key={planet.key}
                  onClick={() =>
                    onSelectPlanet(isSelected ? null : planet.key)
                  }
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-amber-500/15 border-l-2 border-amber-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg font-bold"
                        style={{ color: PLANETS_META[planet.key]?.color }}
                      >
                        {planet.symbol}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {planet.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base" style={{ color: sign.color }}>
                        {sign.symbol}
                      </span>
                      <span className="text-slate-700 dark:text-slate-200">{sign.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {sign.elementName}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300 text-xs">
                    {planet.degrees}° {planet.minutes.toString().padStart(2, '0')}'
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {t('houseLabel', { n: planet.house })}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1.5 hidden sm:inline">
                      ({houseTheme?.traditionalName || ''})
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    {planet.isRetrograde ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        {t('retrograde')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                        {t('direct')}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
