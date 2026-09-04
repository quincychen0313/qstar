import React, { useState } from 'react';
import { CompositeResult, NatalChartResult } from '../engine/types';
import { ChartWheel } from './ChartWheel';
import { PlanetsTable } from './PlanetsTable';
import { AspectsGrid } from './AspectsGrid';
import { ElementBalanceBar } from './ElementBalanceBar';
import { ZODIAC_SIGNS } from '../data/zodiac';
import { getCompositeSunInterpretation } from '../data/synastry-interpretations';
import { Sparkles, Sun, Moon, Compass, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CompositeViewProps {
  composite: CompositeResult;
}

export const CompositeView: React.FC<CompositeViewProps> = ({ composite }) => {
  const { t } = useApp();
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const chartWheelData: NatalChartResult = {
    birthData: {
      name: `${composite.partnerA.name} & ${composite.partnerB.name} 的關係組合盤`,
      year: Math.round((composite.partnerA.year + composite.partnerB.year) / 2),
      month: Math.round((composite.partnerA.month + composite.partnerB.month) / 2),
      day: Math.round((composite.partnerA.day + composite.partnerB.day) / 2),
      hour: 12,
      minute: 0,
      cityName: '雙人中點坐標',
      latitude: (composite.partnerA.latitude + composite.partnerB.latitude) / 2,
      longitude: (composite.partnerA.longitude + composite.partnerB.longitude) / 2,
      timezoneOffset: composite.partnerA.timezoneOffset,
      houseSystem: 'placidus',
    },
    julianDay: 0,
    localSiderealTime: 0,
    planets: composite.planets,
    houses: composite.houses,
    angles: composite.angles,
    aspects: composite.aspects,
    elementBalance: composite.elementBalance,
    modalityBalance: composite.modalityBalance,
    bigThree: composite.bigThree,
  };

  const compSun = composite.bigThree.sun;
  const compMoon = composite.bigThree.moon;
  const compAsc = composite.bigThree.ascendant;

  const sunSign = ZODIAC_SIGNS[compSun.signKey];
  const moonSign = ZODIAC_SIGNS[compMoon.signKey];
  const ascSign = ZODIAC_SIGNS[compAsc.signKey];

  const sunHouseInterp = getCompositeSunInterpretation(compSun.house);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 組合盤導言 */}
      <div className="bg-white/90 dark:bg-gradient-to-r dark:from-purple-900/30 dark:via-slate-900/90 dark:to-amber-900/30 border border-slate-200 dark:border-purple-500/30 rounded-2xl p-6 shadow-md dark:shadow-xl backdrop-blur-xl transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {t('compositeTitle')}
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-medium">
            {t('compositeTag')}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {t('compositeIntro')}
        </p>
      </div>

      {/* 組合盤三巨頭 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 組合太陽 */}
        <div className="bg-white/85 dark:bg-slate-950/70 border border-amber-400/40 dark:border-amber-500/30 rounded-2xl p-5 shadow-sm dark:shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                {t('compSunTitle')}
              </span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {t('houseLabel', { n: compSun.house })}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{sunSign.name}</span>
            <span className="text-xl text-amber-500 dark:text-amber-400">{sunSign.symbol}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {compSun.degrees}°{compSun.minutes.toString().padStart(2, '0')}'
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('compSunDesc')}
          </p>
        </div>

        {/* 組合月亮 */}
        <div className="bg-white/85 dark:bg-slate-950/70 border border-indigo-400/40 dark:border-indigo-500/30 rounded-2xl p-5 shadow-sm dark:shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-300" />
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                {t('compMoonTitle')}
              </span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {t('houseLabel', { n: compMoon.house })}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{moonSign.name}</span>
            <span className="text-xl text-indigo-500 dark:text-indigo-300">{moonSign.symbol}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {compMoon.degrees}°{compMoon.minutes.toString().padStart(2, '0')}'
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('compMoonDesc')}
          </p>
        </div>

        {/* 組合上升 */}
        <div className="bg-white/85 dark:bg-slate-950/70 border border-emerald-400/40 dark:border-emerald-500/30 rounded-2xl p-5 shadow-sm dark:shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                {t('compAscTitle')}
              </span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {t('ascHouseLabel')}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{ascSign.name}</span>
            <span className="text-xl text-emerald-500 dark:text-emerald-400">{ascSign.symbol}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {compAsc.degrees}°{compAsc.minutes.toString().padStart(2, '0')}'
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('compAscDesc')}
          </p>
        </div>
      </div>

      {/* 組合太陽落宮重點深度解讀 */}
      <div className="bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-lg">
        <h4 className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {t('compMissionTitle', { house: compSun.house })}
        </h4>
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50/80 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          {sunHouseInterp}
        </p>
      </div>

      {/* 組合盤輪狀圖與詳細列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md dark:shadow-xl backdrop-blur-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2 px-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              {t('compWheelTitle')}
            </span>
          </div>
          <ChartWheel
            chart={chartWheelData}
            selectedPlanetKey={selectedPlanet}
            onSelectPlanet={setSelectedPlanet}
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <PlanetsTable
            planets={composite.planets}
            selectedPlanetKey={selectedPlanet}
            onSelectPlanet={setSelectedPlanet}
          />
          <ElementBalanceBar
            elementBalance={composite.elementBalance}
            modalityBalance={composite.modalityBalance}
          />
        </div>
      </div>

      {/* 組合盤內部相位矩陣 */}
      <AspectsGrid
        aspects={composite.aspects}
        planets={composite.planets}
        selectedPlanetKey={selectedPlanet}
        onSelectPlanet={setSelectedPlanet}
      />
    </div>
  );
};
