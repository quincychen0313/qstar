import React, { useState } from 'react';
import { Aspect, PlanetPosition } from '../engine/types';
import { getAspectInterpretation } from '../data/interpretations';
import { useApp } from '../context/AppContext';

interface AspectsGridProps {
  aspects: Aspect[];
  planets: PlanetPosition[];
  selectedPlanetKey: string | null;
  onSelectPlanet: (key: string | null) => void;
}

export const AspectsGrid: React.FC<AspectsGridProps> = ({
  aspects,
  planets,
  selectedPlanetKey,
  onSelectPlanet,
}) => {
  const { t } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list');

  const displayAspects = selectedPlanetKey
    ? aspects.filter(
        (a) =>
          a.planet1.key === selectedPlanetKey ||
          a.planet2.key === selectedPlanetKey
      )
    : aspects;

  const matrixPlanets = planets.filter((p) =>
    ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(p.key)
  );

  return (
    <div className="bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md dark:shadow-xl backdrop-blur-xl transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {t('aspectsTitle')}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-300 font-mono">
              {t('totalAspects', { count: aspects.length })}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('aspectsSubtitle')}
          </p>
        </div>

        {/* 檢視切換 */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('list')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              viewMode === 'list'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t('aspectList')}
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              viewMode === 'matrix'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t('aspectMatrix')}
          </button>
        </div>
      </div>

      {selectedPlanetKey && (
        <div className="mb-4 flex items-center justify-between bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <span>
            {t('filterByPlanet', {
              name: planets.find((p) => p.key === selectedPlanetKey)?.name || '',
            })}
          </span>
          <button
            onClick={() => onSelectPlanet(null)}
            className="underline hover:text-amber-950 dark:hover:text-white font-medium"
          >
            {t('showAll')}
          </button>
        </div>
      )}

      {viewMode === 'list' ? (
        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {displayAspects.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              此行星在設定容許度內無主要強烈相位。
            </div>
          ) : (
            displayAspects.map((aspect, idx) => {
              const note = getAspectInterpretation(
                aspect.planet1.name,
                aspect.planet2.name,
                aspect.aspectType
              );

              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-3.5 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 text-xs sm:text-sm">
                        <span className="text-amber-500 dark:text-amber-400">
                          {aspect.planet1.symbol}
                        </span>
                        {aspect.planet1.name}
                      </span>

                      <span
                        className="font-bold text-xs px-2 py-0.5 rounded-md flex items-center gap-1"
                        style={{
                          backgroundColor: `${aspect.color}15`,
                          color: aspect.color,
                          border: `1px solid ${aspect.color}40`,
                        }}
                      >
                        <span>{aspect.symbol}</span>
                        <span>{aspect.name}</span>
                        <span className="text-[11px] font-normal">
                          ({aspect.angle}°)
                        </span>
                      </span>

                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 text-xs sm:text-sm">
                        <span className="text-amber-500 dark:text-amber-400">
                          {aspect.planet2.symbol}
                        </span>
                        {aspect.planet2.name}
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
                        {aspect.nature === 'harmonious'
                          ? t('natureHarmonious')
                          : aspect.nature === 'challenging'
                          ? t('natureChallenging')
                          : t('natureNeutral')}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] border border-slate-200 dark:border-slate-700">
                        {aspect.isApplying ? t('applying') : t('separating')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800/80">
                    {note}
                  </p>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <table className="border-collapse text-center mx-auto text-xs">
            <thead>
              <tr>
                <th className="p-2"></th>
                {matrixPlanets.slice(0, matrixPlanets.length - 1).map((p) => (
                  <th key={p.key} className="p-2 text-amber-500 dark:text-amber-400 font-bold">
                    <div className="text-sm">{p.symbol}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{p.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixPlanets.slice(1).map((pRow, rIdx) => (
                <tr key={pRow.key}>
                  <td className="p-2 text-amber-500 dark:text-amber-400 font-bold text-left whitespace-nowrap">
                    <span className="text-sm mr-1">{pRow.symbol}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{pRow.name}</span>
                  </td>
                  {matrixPlanets.slice(0, matrixPlanets.length - 1).map((pCol, cIdx) => {
                    if (cIdx > rIdx) {
                      return <td key={pCol.key} className="p-2 bg-slate-50/20 dark:bg-slate-950/20"></td>;
                    }

                    const matchedAspect = aspects.find(
                      (a) =>
                        (a.planet1.key === pRow.key && a.planet2.key === pCol.key) ||
                        (a.planet1.key === pCol.key && a.planet2.key === pRow.key)
                    );

                    return (
                      <td
                        key={pCol.key}
                        className="w-11 h-11 p-1 border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
                        title={
                          matchedAspect
                            ? `${matchedAspect.planet1.name} ${matchedAspect.name} ${matchedAspect.planet2.name} (差 ${matchedAspect.orb}°)`
                            : '無相位'
                        }
                      >
                        {matchedAspect ? (
                          <div className="flex flex-col items-center justify-center">
                            <span
                              className="text-sm font-bold leading-none"
                              style={{ color: matchedAspect.color }}
                            >
                              {matchedAspect.symbol}
                            </span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                              {matchedAspect.orb}°
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
