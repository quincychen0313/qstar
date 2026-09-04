import React, { useState } from 'react';
import { NatalChartResult, PlanetPosition, HouseCusp } from '../engine/types';
import { ZODIAC_SIGNS, ZODIAC_ORDER } from '../data/zodiac';
import { useApp } from '../context/AppContext';

interface ChartWheelProps {
  chart: NatalChartResult;
  selectedPlanetKey: string | null;
  onSelectPlanet: (planetKey: string | null) => void;
}

export const ChartWheel: React.FC<ChartWheelProps> = ({
  chart,
  selectedPlanetKey,
  onSelectPlanet,
}) => {
  const { theme, t } = useApp();
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetPosition | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<HouseCusp | null>(null);

  const asc = chart.angles.ascendant.longitude;
  const isLight = theme === 'light';

  /**
   * 將黃道經度 (0-360) 轉換為星盤輪圖角度 (度數)
   * 上升點 (ASC) 固定在西方水平線（9 點鐘位置，角度 180°）
   * 黃道經度依逆時針遞增
   */
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

  // 圓環半徑配置
  const R_OUTER = 280;
  const R_ZODIAC_DIV = 240;
  const R_HOUSE_OUTER = 236;
  const R_PLANETS = 180;
  const R_HOUSE_INNER = 120;
  const R_ASPECTS = 115;

  // 計算行星避讓演算法
  const sortedPlanets = [...chart.planets].sort(
    (a, b) => toWheelAngle(a.longitude) - toWheelAngle(b.longitude)
  );

  const planetRenderCoords: {
    planet: PlanetPosition;
    wheelAngle: number;
    renderAngle: number;
    renderRadius: number;
  }[] = [];

  for (let i = 0; i < sortedPlanets.length; i++) {
    const p = sortedPlanets[i];
    const originalAngle = toWheelAngle(p.longitude);
    let renderAngle = originalAngle;
    let renderRadius = R_PLANETS;

    if (i > 0) {
      const prev = planetRenderCoords[i - 1];
      const diff = Math.abs(originalAngle - prev.renderAngle);
      if (diff < 8 || diff > 352) {
        renderRadius = prev.renderRadius === R_PLANETS ? R_PLANETS - 26 : R_PLANETS;
        renderAngle = (prev.renderAngle + 6) % 360;
      }
    }

    planetRenderCoords.push({
      planet: p,
      wheelAngle: originalAngle,
      renderAngle,
      renderRadius,
    });
  }

  const activePlanetKey = hoveredPlanet?.key || selectedPlanetKey;
  const activePlanet = chart.planets.find((p) => p.key === activePlanetKey);

  const describeArc = (
    radius: number,
    startAngle: number,
    endAngle: number
  ): string => {
    const start = polarToCartesian(radius, endAngle);
    const end = polarToCartesian(radius, startAngle);
    let diff = endAngle - startAngle;
    if (diff < 0) diff += 360;
    const largeArcFlag = diff <= 180 ? '0' : '1';
    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* 輪狀星盤 SVG */}
      <svg
        viewBox="-300 -300 600 600"
        className="w-full max-w-[580px] h-auto drop-shadow-xl transition-all duration-300"
      >
        <defs>
          {/* 星空夜色 / 羊皮日光徑向漸層 */}
          <radialGradient id="centerGradient" cx="0" cy="0" r="100%">
            {isLight ? (
              <>
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#f8fafc" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#f1f5f9" stopOpacity="1" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#0b0f19" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#050811" stopOpacity="1" />
              </>
            )}
          </radialGradient>
          <radialGradient id="wheelRim" cx="0" cy="0" r="100%">
            {isLight ? (
              <>
                <stop offset="85%" stopColor="#e2e8f0" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.6" />
              </>
            ) : (
              <>
                <stop offset="85%" stopColor="#1e293b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#334155" stopOpacity="0.7" />
              </>
            )}
          </radialGradient>
        </defs>

        {/* 最外底圓 */}
        <circle cx="0" cy="0" r={R_OUTER} fill="url(#centerGradient)" />
        <circle cx="0" cy="0" r={R_OUTER} fill="url(#wheelRim)" />
        <circle
          cx="0"
          cy="0"
          r={R_OUTER}
          fill="none"
          stroke={isLight ? '#cbd5e1' : '#475569'}
          strokeWidth="1.5"
        />

        {/* 1. 黃道十二星座扇區環 (Zodiac Ring) */}
        {ZODIAC_ORDER.map((signKey) => {
          const sign = ZODIAC_SIGNS[signKey];
          const startDeg = sign.degreeStart;
          const endDeg = sign.degreeEnd;
          const startAngle = toWheelAngle(startDeg);
          const endAngle = toWheelAngle(endDeg);
          const midAngle = toWheelAngle((startDeg + endDeg) / 2);

          const symbolPos = polarToCartesian(
            (R_OUTER + R_ZODIAC_DIV) / 2,
            midAngle
          );

          const cuspLine = polarToCartesian(R_OUTER, startAngle);
          const cuspLineInner = polarToCartesian(R_ZODIAC_DIV, startAngle);

          const elementFill = isLight
            ? sign.element === 'fire'
              ? 'rgba(239, 68, 68, 0.08)'
              : sign.element === 'earth'
              ? 'rgba(16, 185, 129, 0.08)'
              : sign.element === 'air'
              ? 'rgba(14, 165, 233, 0.08)'
              : 'rgba(99, 102, 241, 0.08)'
            : sign.element === 'fire'
            ? 'rgba(239, 68, 68, 0.12)'
            : sign.element === 'earth'
            ? 'rgba(16, 185, 129, 0.12)'
            : sign.element === 'air'
            ? 'rgba(56, 189, 248, 0.12)'
            : 'rgba(129, 140, 248, 0.12)';

          return (
            <g key={signKey} className="group cursor-default">
              <path
                d={`
                  ${describeArc(R_OUTER, startAngle, endAngle)}
                  L ${polarToCartesian(R_ZODIAC_DIV, startAngle).x} ${polarToCartesian(R_ZODIAC_DIV, startAngle).y}
                  ${describeArc(R_ZODIAC_DIV, endAngle, startAngle)}
                  Z
                `}
                fill={elementFill}
                className="transition-colors duration-200 hover:fill-amber-500/20"
              />

              <line
                x1={cuspLineInner.x}
                y1={cuspLineInner.y}
                x2={cuspLine.x}
                y2={cuspLine.y}
                stroke={isLight ? '#94a3b8' : '#64748b'}
                strokeWidth="1"
                strokeOpacity={isLight ? '0.6' : '0.4'}
              />

              <text
                x={symbolPos.x}
                y={symbolPos.y + 6}
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                fill={sign.color}
                className="pointer-events-none transition-transform duration-200 group-hover:scale-110"
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}

        {/* 內外環分界圓 */}
        <circle
          cx="0"
          cy="0"
          r={R_ZODIAC_DIV}
          fill="none"
          stroke={isLight ? '#cbd5e1' : '#475569'}
          strokeWidth="1.2"
        />
        <circle
          cx="0"
          cy="0"
          r={R_HOUSE_OUTER}
          fill="none"
          stroke={isLight ? '#e2e8f0' : '#334155'}
          strokeWidth="1"
        />

        {/* 2. 宮位分割線與宮位數字 (12 Houses) */}
        {chart.houses.map((house) => {
          const houseAngle = toWheelAngle(house.longitude);
          const outerPoint = polarToCartesian(R_HOUSE_OUTER, houseAngle);
          const innerPoint = polarToCartesian(R_HOUSE_INNER, houseAngle);

          const isAngle = [1, 4, 7, 10].includes(house.house);
          const strokeColor = isAngle
            ? isLight
              ? '#d97706'
              : '#fbbf24'
            : isLight
            ? '#cbd5e1'
            : '#475569';
          const strokeWidth = isAngle ? '2.2' : '0.8';
          const strokeDash = isAngle ? undefined : '2 2';

          const nextHouseIndex = house.house % 12;
          const nextHouse = chart.houses[nextHouseIndex];
          const nextHouseAngle = toWheelAngle(nextHouse.longitude);
          let midHouseAngle = (houseAngle + nextHouseAngle) / 2;
          if (Math.abs(nextHouseAngle - houseAngle) > 180) {
            midHouseAngle = (midHouseAngle + 180) % 360;
          }
          const numberPos = polarToCartesian(
            (R_HOUSE_INNER + R_PLANETS) / 2 - 8,
            midHouseAngle
          );

          const isHovered = hoveredHouse?.house === house.house;

          return (
            <g
              key={`house-${house.house}`}
              onMouseEnter={() => setHoveredHouse(house)}
              onMouseLeave={() => setHoveredHouse(null)}
              className="cursor-pointer"
            >
              <line
                x1={innerPoint.x}
                y1={innerPoint.y}
                x2={outerPoint.x}
                y2={outerPoint.y}
                stroke={isHovered ? '#0284c7' : strokeColor}
                strokeWidth={isHovered ? '2.5' : strokeWidth}
                strokeDasharray={strokeDash}
                className="transition-colors duration-200"
              />

              {house.house === 1 && (
                <text
                  x={outerPoint.x - 14}
                  y={outerPoint.y + 4}
                  textAnchor="end"
                  fill={isLight ? '#b45309' : '#fbbf24'}
                  fontSize="11"
                  fontWeight="bold"
                >
                  ASC
                </text>
              )}
              {house.house === 10 && (
                <text
                  x={outerPoint.x}
                  y={outerPoint.y - 8}
                  textAnchor="middle"
                  fill={isLight ? '#b45309' : '#fbbf24'}
                  fontSize="11"
                  fontWeight="bold"
                >
                  MC
                </text>
              )}
              {house.house === 7 && (
                <text
                  x={outerPoint.x + 14}
                  y={outerPoint.y + 4}
                  textAnchor="start"
                  fill={isLight ? '#b45309' : '#fbbf24'}
                  fontSize="11"
                  fontWeight="bold"
                >
                  DSC
                </text>
              )}
              {house.house === 4 && (
                <text
                  x={outerPoint.x}
                  y={outerPoint.y + 14}
                  textAnchor="middle"
                  fill={isLight ? '#b45309' : '#fbbf24'}
                  fontSize="11"
                  fontWeight="bold"
                >
                  IC
                </text>
              )}

              <text
                x={numberPos.x}
                y={numberPos.y + 4}
                textAnchor="middle"
                fontSize="11"
                fill={isHovered ? '#0284c7' : isLight ? '#94a3b8' : '#64748b'}
                fontWeight={isHovered ? 'bold' : 'normal'}
                className="pointer-events-none"
              >
                {house.house}
              </text>
            </g>
          );
        })}

        {/* 宮位內環界線 */}
        <circle
          cx="0"
          cy="0"
          r={R_HOUSE_INNER}
          fill={isLight ? '#ffffff' : '#0a0f1d'}
          stroke={isLight ? '#cbd5e1' : '#334155'}
          strokeWidth="1.2"
        />

        {/* 3. 相位連線 (Aspect Lines) */}
        <g className="aspect-lines">
          {chart.aspects.map((aspect, idx) => {
            const p1Angle = toWheelAngle(aspect.planet1.longitude);
            const p2Angle = toWheelAngle(aspect.planet2.longitude);
            const pt1 = polarToCartesian(R_ASPECTS, p1Angle);
            const pt2 = polarToCartesian(R_ASPECTS, p2Angle);

            const isConnected =
              !activePlanetKey ||
              aspect.planet1.key === activePlanetKey ||
              aspect.planet2.key === activePlanetKey;

            const opacity = activePlanetKey
              ? isConnected
                ? '0.95'
                : '0.08'
              : isLight
              ? '0.65'
              : '0.45';

            const strokeW = activePlanetKey && isConnected ? '2' : '1';

            return (
              <line
                key={`aspect-${idx}`}
                x1={pt1.x}
                y1={pt1.y}
                x2={pt2.x}
                y2={pt2.y}
                stroke={aspect.color}
                strokeWidth={strokeW}
                strokeOpacity={opacity}
                className="transition-all duration-300"
              />
            );
          })}
        </g>

        {/* 中央裝飾小圓盤 */}
        <circle
          cx="0"
          cy="0"
          r={28}
          fill={isLight ? '#f1f5f9' : '#0e1526'}
          stroke={isLight ? '#0284c7' : '#3b82f6'}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <circle cx="0" cy="0" r={4} fill={isLight ? '#d97706' : '#fbbf24'} />

        {/* 4. 行星符號與度數標記 (Planets Glyphs) */}
        {planetRenderCoords.map(({ planet, wheelAngle, renderAngle, renderRadius }) => {
          const exactPoint = polarToCartesian(R_HOUSE_OUTER - 2, wheelAngle);
          const iconPoint = polarToCartesian(renderRadius, renderAngle);

          const isSelected = selectedPlanetKey === planet.key;
          const isHovered = hoveredPlanet?.key === planet.key;
          const isActive = isSelected || isHovered;

          return (
            <g
              key={`planet-glyph-${planet.key}`}
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setHoveredPlanet(planet)}
              onMouseLeave={() => setHoveredPlanet(null)}
              onClick={() =>
                onSelectPlanet(isSelected ? null : planet.key)
              }
            >
              {/* 精確經度指示刻度線 */}
              <line
                x1={exactPoint.x}
                y1={exactPoint.y}
                x2={iconPoint.x}
                y2={iconPoint.y}
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
                strokeOpacity={isActive ? '1' : '0.5'}
              />

              <circle
                cx={exactPoint.x}
                cy={exactPoint.y}
                r={isActive ? 3 : 1.8}
                fill={
                  isActive
                    ? isLight
                      ? '#d97706'
                      : '#fbbf24'
                    : isLight
                    ? '#64748b'
                    : '#94a3b8'
                }
              />

              <circle
                cx={iconPoint.x}
                cy={iconPoint.y}
                r={isActive ? 16 : 13}
                fill={
                  isActive
                    ? isLight
                      ? '#fef3c7'
                      : '#1e293b'
                    : isLight
                    ? '#ffffff'
                    : '#0f172a'
                }
                stroke={
                  isActive
                    ? isLight
                      ? '#d97706'
                      : '#fbbf24'
                    : isLight
                    ? '#cbd5e1'
                    : '#475569'
                }
                strokeWidth={isActive ? '2' : '1'}
                className="transition-all duration-200 drop-shadow-sm"
              />

              <text
                x={iconPoint.x}
                y={iconPoint.y + 5}
                textAnchor="middle"
                fontSize={isActive ? '15' : '13'}
                fontWeight="bold"
                fill={
                  isActive
                    ? isLight
                      ? '#b45309'
                      : '#ffffff'
                    : isLight
                    ? '#1e293b'
                    : '#e2e8f0'
                }
                className="pointer-events-none"
              >
                {planet.symbol}
              </text>

              {planet.isRetrograde && (
                <text
                  x={iconPoint.x + 9}
                  y={iconPoint.y - 7}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#ef4444"
                  fontWeight="bold"
                >
                  ℞
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* 互動資訊提示浮動卡片 */}
      <div className="mt-3 min-h-[56px] w-full max-w-[540px] flex items-center justify-center text-center">
        {activePlanet ? (
          <div className="bg-white/95 dark:bg-slate-900/90 border border-amber-400/50 rounded-xl px-4 py-2 text-sm shadow-md backdrop-blur-md flex items-center gap-3 animate-fade-in text-slate-800 dark:text-slate-100">
            <span className="text-2xl">{activePlanet.symbol}</span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-600 dark:text-amber-300">
                  {activePlanet.name}
                </span>
                <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  {activePlanet.signSymbol} {activePlanet.signName}{' '}
                  {activePlanet.degrees}°{activePlanet.minutes.toString().padStart(2, '0')}'
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                  {t('houseLabel', { n: activePlanet.house })}
                </span>
                {activePlanet.isRetrograde && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700">
                    {t('retrograde')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : hoveredHouse ? (
          <div className="bg-white/95 dark:bg-slate-900/90 border border-sky-400/50 rounded-xl px-4 py-2 text-sm shadow-md backdrop-blur-md text-slate-700 dark:text-slate-300">
            <span className="font-bold text-sky-600 dark:text-sky-300 mr-2">
              {t('houseLabel', { n: hoveredHouse.house })}
            </span>
            {hoveredHouse.signSymbol} {hoveredHouse.signName}{' '}
            {hoveredHouse.degrees}°{hoveredHouse.minutes.toString().padStart(2, '0')}'
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('wheelInstruction')}
          </p>
        )}
      </div>
    </div>
  );
};
