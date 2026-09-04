// 本命星盤完整計算核心入口
import {
  BirthData,
  NatalChartResult,
  PlanetKey,
  PlanetPosition,
} from './types';
import {
  calculateJulianDay,
  calculateLST,
  getPlanetLongitude,
  getPlanetSpeedAndRetrograde,
} from './astronomy';
import {
  calculateAngles,
  calculateHouses,
  getHouseForLongitude,
} from './houses';
import {
  calculateAspects,
  calculateElementBalance,
  calculateModalityBalance,
} from './aspects';
import { degreeToSignDetail, PLANETS_META } from '../data/zodiac';

export * from './types';
export * from './astronomy';
export * from './houses';
export * from './aspects';
export * from './synastry';

const PLANET_KEYS_TO_CALCULATE: PlanetKey[] = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
  'chiron',
  'northNode',
  'lilith',
];

/**
 * 主計算函式：依據生辰資料產出完整本命星盤結果
 */
export function calculateNatalChart(birthData: BirthData): NatalChartResult {
  const hour = birthData.isUnknownTime ? 12 : birthData.hour;
  const minute = birthData.isUnknownTime ? 0 : birthData.minute;
  const second = birthData.second || 0;

  // 1. 計算儒略日
  const jd = calculateJulianDay(
    birthData.year,
    birthData.month,
    birthData.day,
    hour,
    minute,
    second,
    birthData.timezoneOffset
  );

  // 2. 地方平恆星時
  const lst = calculateLST(jd, birthData.longitude);

  // 3. 四大軸點
  const angles = calculateAngles(jd, birthData.latitude, birthData.longitude);

  // 4. 十二宮位
  const houses = calculateHouses(
    jd,
    birthData.latitude,
    birthData.longitude,
    birthData.houseSystem || 'placidus'
  );

  // 5. 計算各大行星與虛點
  const planets: PlanetPosition[] = [];

  for (const key of PLANET_KEYS_TO_CALCULATE) {
    const meta = PLANETS_META[key];
    const lon = getPlanetLongitude(key, jd);
    const detail = degreeToSignDetail(lon);
    const { speed, isRetrograde } = getPlanetSpeedAndRetrograde(key, jd);
    const houseNumber = getHouseForLongitude(lon, houses);

    planets.push({
      key,
      name: meta.name,
      symbol: meta.symbol,
      longitude: lon,
      signKey: detail.signKey,
      signName: detail.signName,
      signSymbol: detail.signSymbol,
      degrees: detail.degrees,
      minutes: detail.minutes,
      seconds: detail.seconds,
      house: houseNumber,
      isRetrograde,
      speed,
    });
  }

  // 6. 相位計算
  const aspects = calculateAspects(planets);

  // 7. 元素與三方特質統計
  const elementBalance = calculateElementBalance(planets);
  const modalityBalance = calculateModalityBalance(planets);

  // 8. 太陽、月亮、上升「星盤三巨頭」
  const sun = planets.find((p) => p.key === 'sun')!;
  const moon = planets.find((p) => p.key === 'moon')!;
  const ascDetail = degreeToSignDetail(angles.ascendant.longitude);

  const bigThree = {
    sun,
    moon,
    ascendant: {
      signKey: ascDetail.signKey,
      signName: ascDetail.signName,
      signSymbol: ascDetail.signSymbol,
      degrees: ascDetail.degrees,
      minutes: ascDetail.minutes,
    },
  };

  return {
    birthData,
    julianDay: jd,
    localSiderealTime: lst,
    planets,
    houses,
    angles,
    aspects,
    elementBalance,
    modalityBalance,
    bigThree,
  };
}
