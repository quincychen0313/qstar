import React, { useState } from 'react';
import { SynastryResult, PlanetPosition } from '../engine/types';
import { ZODIAC_SIGNS, ZODIAC_ORDER } from '../data/zodiac';
import { ArrowLeftRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SynastryWheelProps {
  synastry: SynastryResult;
  selectedPlanetA: string | null;
  selectedPlanetB: string | null;
  onSelectPlanetA: (key: string | null) => void;
  onSelectPlanetB: (key: string | null) => void;
  onSwapPartners: () => void;
}

export const SynastryWheel: React.FC<SynastryWheelProps> = ({
  synastry,
  selectedPlanetA,
  selectedPlanetB,
  onSelectPlanetA,
  onSelectPlanetB,
  onSwapPartners,
}) => {
  const { theme, t } = useApp();
  const [hoveredA, setHoveredA] = useState<PlanetPosition | null>(null);
  const [hoveredB, setHoveredB] = useState<PlanetPosition | null>(null);

  const { chartA, chartB, crossAspects } = synastry;
  const asc = chartA.angles.ascendant.longitude;
  const isLight = theme === 'light';

  const toWheelAngle = (longitude: number): number => {
    let theta = 180 - (longitude - asc);
    theta = ((theta % 360) + 360) % 360;
    return theta;
  };

  const polarToCartesian = (radius: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad),
    };
  };

  const R_OUTER_RIM = 285;
  const R_OUTER_PLANETS = 255;
  const R_ZODIAC_OUTER = 230;
  const R_ZODIAC_INNER = 195;
  const R_INNER_PLANETS = 160;
  const R_HOUSES_INNER = 105;
  const R_ASPECTS = 100;

  const describeArc = (radius: number, startAngle: number, endAngle: number): string => {
    const start = polarToCartesian(radius, endAngle);
    const end = polarToCartesian(radius, startAngle);
    let diff = endAngle - startAngle;
    if (diff < 0) diff += 360;
    const largeArcFlag = diff <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const activeKeyA = hoveredA?.key || selectedPlanetA;
  const activeKeyB = hoveredB?.key || selectedPlanetB;

  return (
    <div className="relative flex flex-col items-center justify-center p-2 select-none">
      <svg
        viewBox="-300 -300 600 600"
        className="w-full max-w-[580px] h-auto drop-shadow-xl transition-all duration-300"
      >
        <defs>
          <radialGradient id="synastryBg" cx="0" cy="0" r="100%">
            {isLight ? (
              <>
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                <stop offset="70%" stopColor="#f8fafc" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#f1f5f9" stopOpacity="1" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#0b0f19" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#080c16" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#04060d" stopOpacity="1" />
              </>
            )}
          </radialGradient>
        </defs>

        {/* 底盤背景 */}
        <circle cx="0" cy="0" r={R_OUTER_RIM} fill="url(#synastryBg)" />
        <circle
          cx="0"
          cy="0"
          r={R_OUTER_RIM}
          fill="none"
          stroke={isLight ? '#cbd5e1' : '#475569'}
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* 外環裝飾底色 */}
        <circle
          cx="0"
          cy="0"
          r={(R_OUTER_RIM + R_ZODIAC_OUTER) / 2}
          fill="none"
          stroke={isLight ? 'rgba(14, 165, 233, 0.05)' : 'rgba(56, 189, 248, 0.05)'}
          strokeWidth={R_OUTER_RIM - R_ZODIAC_OUTER}
        />
        <circle
          cx="0"
          cy="0"
          r={R_ZODIAC_OUTER}
          fill="none"
          stroke={isLight ? '#e2e8f0' : '#334155'}
          strokeWidth="1.2"
        />

        {/* 1. 黃道十二星座中環 (Zodiac Ring) */}
        {ZODIAC_ORDER.map((signKey) => {
          const sign = ZODIAC_SIGNS[signKey];
          const startAngle = toWheelAngle(sign.degreeStart);
          const endAngle = toWheelAngle(sign.degreeEnd);
          const midAngle = toWheelAngle((sign.degreeStart + sign.degreeEnd) / 2);
          const symPos = polarToCartesian((R_ZODIAC_OUTER + R_ZODIAC_INNER) / 2, midAngle);
          const cuspLineOut = polarToCartesian(R_ZODIAC_OUTER, startAngle);
          const cuspLineIn = polarToCartesian(R_ZODIAC_INNER, startAngle);

          return (
            <g key={`syn-zodiac-${signKey}`}>
              <path
                d={`
                  ${describeArc(R_ZODIAC_OUTER, startAngle, endAngle)}
                  L ${polarToCartesian(R_ZODIAC_INNER, startAngle).x} ${polarToCartesian(R_ZODIAC_INNER, startAngle).y}
                  ${describeArc(R_ZODIAC_INNER, endAngle, startAngle)}
                  Z
                `}
                fill={isLight ? 'rgba(241, 245, 249, 0.9)' : 'rgba(15, 23, 42, 0.7)'}
                stroke={isLight ? '#e2e8f0' : '#334155'}
                strokeWidth="0.5"
              />
              <line
                x1={cuspLineIn.x}
                y1={cuspLineIn.y}
                x2={cuspLineOut.x}
                y2={cuspLineOut.y}
                stroke={isLight ? '#94a3b8' : '#64748b'}
                strokeWidth="0.8"
                strokeOpacity="0.5"
              />
              <text
                x={symPos.x}
                y={symPos.y + 5}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill={sign.color}
                className="pointer-events-none"
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}

        <circle
          cx="0"
          cy="0"
          r={R_ZODIAC_INNER}
          fill="none"
          stroke={isLight ? '#cbd5e1' : '#475569'}
          strokeWidth="1.2"
        />

        {/* 2. 盤主 A 之十二宮位分割線 */}
        {chartA.houses.map((house) => {
          const houseAngle = toWheelAngle(house.longitude);
          const outerPt = polarToCartesian(R_ZODIAC_INNER, houseAngle);
          const innerPt = polarToCartesian(R_HOUSES_INNER, houseAngle);

          const isAngle = [1, 4, 7, 10].includes(house.house);
          const strokeColor = isAngle
            ? isLight
              ? '#d97706'
              : '#fbbf24'
            : isLight
            ? '#cbd5e1'
            : '#475569';
          const strokeWidth = isAngle ? '2' : '0.8';

          return (
            <g key={`house-a-${house.house}`}>
              <line
                x1={innerPt.x}
                y1={innerPt.y}
                x2={outerPt.x}
                y2={outerPt.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={isAngle ? undefined : '2 2'}
              />
              {house.house === 1 && (
                <text
                  x={innerPt.x + 16}
                  y={innerPt.y - 4}
                  fill={isLight ? '#b45309' : '#fbbf24'}
                  fontSize="10"
                  fontWeight="bold"
                >
                  ASC (A)
                </text>
              )}
            </g>
          );
        })}

        <circle
          cx="0"
          cy="0"
          r={R_HOUSES_INNER}
          fill={isLight ? '#ffffff' : '#090d16'}
          stroke={isLight ? '#cbd5e1' : '#334155'}
          strokeWidth="1.2"
        />

        {/* 3. 雙人交叉相位連線 (Cross-Aspects) */}
        <g className="cross-aspect-lines">
          {crossAspects.map((aspect, idx) => {
            const angleA = toWheelAngle(aspect.planetA.longitude);
            const angleB = toWheelAngle(aspect.planetB.longitude);
            const ptA = polarToCartesian(R_ASPECTS, angleA);
            const ptB = polarToCartesian(R_ASPECTS, angleB);

            const isMatch =
              (!activeKeyA && !activeKeyB) ||
              (activeKeyA && aspect.planetA.key === activeKeyA) ||
              (activeKeyB && aspect.planetB.key === activeKeyB);

            const opacity = activeKeyA || activeKeyB
              ? isMatch
                ? '0.95'
                : '0.06'
              : isLight
              ? '0.5'
              : '0.35';
            const strokeW = isMatch && (activeKeyA || activeKeyB) ? '2.2' : '0.9';

            return (
              <line
                key={`cross-asp-${idx}`}
                x1={ptA.x}
                y1={ptA.y}
                x2={ptB.x}
                y2={ptB.y}
                stroke={aspect.color}
                strokeWidth={strokeW}
                strokeOpacity={opacity}
                className="transition-all duration-300"
              />
            );
          })}
        </g>

        {/* 中央裝飾圈 */}
        <circle
          cx="0"
          cy="0"
          r={24}
          fill={isLight ? '#f1f5f9' : '#0f172a'}
          stroke={isLight ? '#94a3b8' : '#475569'}
          strokeWidth="1"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize="10"
          fill={isLight ? '#475569' : '#94a3b8'}
          fontWeight="bold"
        >
          A × B
        </text>

        {/* 4. 內圈：盤主 A 的行星 (金色系) */}
        {chartA.planets.map((p) => {
          const angle = toWheelAngle(p.longitude);
          const iconPt = polarToCartesian(R_INNER_PLANETS, angle);
          const tickPt = polarToCartesian(R_ZODIAC_INNER - 2, angle);

          const isSelected = selectedPlanetA === p.key;
          const isHovered = hoveredA?.key === p.key;
          const isActive = isSelected || isHovered;

          return (
            <g
              key={`planetA-${p.key}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredA(p)}
              onMouseLeave={() => setHoveredA(null)}
              onClick={() => onSelectPlanetA(isSelected ? null : p.key)}
            >
              <line
                x1={iconPt.x}
                y1={iconPt.y}
                x2={tickPt.x}
                y2={tickPt.y}
                stroke={
                  isActive
                    ? isLight
                      ? '#d97706'
                      : '#fbbf24'
                    : isLight
                    ? '#94a3b8'
                    : '#64748b'
                }
                strokeWidth={isActive ? '1.5' : '0.6'}
              />
              <circle
                cx={iconPt.x}
                cy={iconPt.y}
                r={isActive ? 14 : 11}
                fill={
                  isActive
                    ? isLight
                      ? '#fef3c7'
                      : '#78350f'
                    : isLight
                    ? '#fffbeb'
                    : '#1e1b4b'
                }
                stroke={isLight ? '#d97706' : '#fbbf24'}
                strokeWidth={isActive ? '2' : '1'}
              />
              <text
                x={iconPt.x}
                y={iconPt.y + 4}
                textAnchor="middle"
                fontSize={isActive ? '13' : '11'}
                fill={isLight ? '#92400e' : '#fef08a'}
                fontWeight="bold"
                className="pointer-events-none"
              >
                {p.symbol}
              </text>
            </g>
          );
        })}

        {/* 5. 外圈：盤主 B 的行星 (水藍色系) */}
        {chartB.planets.map((p) => {
          const angle = toWheelAngle(p.longitude);
          const iconPt = polarToCartesian(R_OUTER_PLANETS, angle);
          const tickPt = polarToCartesian(R_ZODIAC_OUTER + 2, angle);

          const isSelected = selectedPlanetB === p.key;
          const isHovered = hoveredB?.key === p.key;
          const isActive = isSelected || isHovered;

          return (
            <g
              key={`planetB-${p.key}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredB(p)}
              onMouseLeave={() => setHoveredB(null)}
              onClick={() => onSelectPlanetB(isSelected ? null : p.key)}
            >
              <line
                x1={iconPt.x}
                y1={iconPt.y}
                x2={tickPt.x}
                y2={tickPt.y}
                stroke={
                  isActive
                    ? isLight
                      ? '#0284c7'
                      : '#38bdf8'
                    : isLight
                    ? '#94a3b8'
                    : '#475569'
                }
                strokeWidth={isActive ? '1.5' : '0.6'}
              />
              <circle
                cx={iconPt.x}
                cy={iconPt.y}
                r={isActive ? 14 : 11}
                fill={
                  isActive
                    ? isLight
                      ? '#e0f2fe'
                      : '#0c4a6e'
                    : isLight
                    ? '#f0f9ff'
                    : '#0f172a'
                }
                stroke={isLight ? '#0284c7' : '#38bdf8'}
                strokeWidth={isActive ? '2' : '1'}
              />
              <text
                x={iconPt.x}
                y={iconPt.y + 4}
                textAnchor="middle"
                fontSize={isActive ? '13' : '11'}
                fill={isLight ? '#0369a1' : '#bae6fd'}
                fontWeight="bold"
                className="pointer-events-none"
              >
                {p.symbol}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 內外盤主提示與互換按鈕 */}
      <div className="w-full max-w-[540px] mt-3 flex items-center justify-between bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400" />
          <span className="text-slate-700 dark:text-slate-300">
            {t('innerRing')}：
            <strong className="text-amber-600 dark:text-amber-300">
              {chartA.birthData.name}
            </strong>
          </span>
        </div>

        <button
          onClick={onSwapPartners}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 transition font-medium"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-sky-500" />
          <span>{t('swapInnerOuter')}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-sky-400" />
          <span className="text-slate-700 dark:text-slate-300">
            {t('outerRing')}：
            <strong className="text-sky-600 dark:text-sky-300">
              {chartB.birthData.name}
            </strong>
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 text-center">
        {t('synastryInstruction')}
      </p>
    </div>
  );
};
