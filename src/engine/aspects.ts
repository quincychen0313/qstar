// 相位計算與元素/形態能量分佈分析
import {
  Aspect,
  AspectType,
  ElementBalance,
  ModalityBalance,
  PlanetPosition,
} from './types';
import { ASPECT_CONFIG, ZODIAC_SIGNS } from '../data/zodiac';

/**
 * 計算兩行星之間的角距離 (0 - 180 度)
 */
export function getAngularDifference(deg1: number, deg2: number): number {
  let diff = Math.abs(deg1 - deg2) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * 計算所有行星間的主要相位
 */
export function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  const aspectTypes: AspectType[] = [
    'conjunction',
    'opposition',
    'trine',
    'square',
    'sextile',
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];

      // 檢查是否包含發光體（太陽或月亮），放寬容許度 +1.5~2 度
      const hasLuminary =
        p1.key === 'sun' ||
        p1.key === 'moon' ||
        p2.key === 'sun' ||
        p2.key === 'moon';

      const diff = getAngularDifference(p1.longitude, p2.longitude);

      for (const aType of aspectTypes) {
        const config = ASPECT_CONFIG[aType];
        const maxOrb = hasLuminary ? config.defaultOrb + 1.5 : config.defaultOrb;
        const currentOrb = Math.abs(diff - config.angle);

        if (currentOrb <= maxOrb) {
          // 判斷出入相 (Applying vs Separating)
          // 速度較快的行星是否正在趨近精確相位
          const relativeSpeed = p1.speed - p2.speed;
          // 若經度差隨時間縮小則為入相
          let isApplying = false;
          if (p1.longitude < p2.longitude) {
            isApplying = relativeSpeed > 0;
          } else {
            isApplying = relativeSpeed < 0;
          }

          aspects.push({
            planet1: p1,
            planet2: p2,
            aspectType: aType,
            name: config.name,
            symbol: config.symbol,
            angle: config.angle,
            actualDifference: diff,
            orb: parseFloat(currentOrb.toFixed(2)),
            isApplying,
            nature: config.nature,
            color: config.color,
          });
        }
      }
    }
  }

  // 按容許度緊密程度由小到大排序（最精確的相位排在最前）
  aspects.sort((a, b) => a.orb - b.orb);
  return aspects;
}

/**
 * 計算四元素能量分佈（火、土、風、水）
 */
export function calculateElementBalance(
  planets: PlanetPosition[]
): ElementBalance {
  // 核心納入統計的十主星（太陽至冥王星）加權
  const balance: ElementBalance = {
    fire: { count: 0, percentage: 0, planets: [] },
    earth: { count: 0, percentage: 0, planets: [] },
    air: { count: 0, percentage: 0, planets: [] },
    water: { count: 0, percentage: 0, planets: [] },
  };

  const corePlanets = planets.filter((p) =>
    ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(p.key)
  );

  for (const p of corePlanets) {
    const signInfo = ZODIAC_SIGNS[p.signKey];
    if (signInfo) {
      balance[signInfo.element].count += 1;
      balance[signInfo.element].planets.push(p.name);
    }
  }

  const total = corePlanets.length || 1;
  balance.fire.percentage = Math.round((balance.fire.count / total) * 100);
  balance.earth.percentage = Math.round((balance.earth.count / total) * 100);
  balance.air.percentage = Math.round((balance.air.count / total) * 100);
  balance.water.percentage = Math.round((balance.water.count / total) * 100);

  return balance;
}

/**
 * 計算三方特質能量分佈（本位、固定、變動）
 */
export function calculateModalityBalance(
  planets: PlanetPosition[]
): ModalityBalance {
  const balance: ModalityBalance = {
    cardinal: { count: 0, percentage: 0, planets: [] },
    fixed: { count: 0, percentage: 0, planets: [] },
    mutable: { count: 0, percentage: 0, planets: [] },
  };

  const corePlanets = planets.filter((p) =>
    ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(p.key)
  );

  for (const p of corePlanets) {
    const signInfo = ZODIAC_SIGNS[p.signKey];
    if (signInfo) {
      balance[signInfo.modality].count += 1;
      balance[signInfo.modality].planets.push(p.name);
    }
  }

  const total = corePlanets.length || 1;
  balance.cardinal.percentage = Math.round((balance.cardinal.count / total) * 100);
  balance.fixed.percentage = Math.round((balance.fixed.count / total) * 100);
  balance.mutable.percentage = Math.round((balance.mutable.count / total) * 100);

  return balance;
}
