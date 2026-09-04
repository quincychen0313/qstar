// 天文演算法核心：計算儒略日、恆星時、黃赤交角與行星/虛點黃道經度
import { PlanetKey } from './types';


const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * 角度正規化至 [0, 360) 區間
 */
export function normalizeDegrees(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

/**
 * 將公曆年月日時分秒轉換為儒略日 (Julian Day)
 */
export function calculateJulianDay(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number = 0,
  timezoneOffset: number = 8
): number {
  // 將本地時間轉換為 UTC 時間
  let utcHour = hour - timezoneOffset + minute / 60 + second / 3600;
  let y = year;
  let m = month;

  if (utcHour < 0) {
    utcHour += 24;
    day -= 1;
  } else if (utcHour >= 24) {
    utcHour -= 24;
    day += 1;
  }

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5 +
    utcHour / 24;

  return jd;
}

/**
 * 計算格林威治平恆星時 GMST（度數）
 */
export function calculateGMST(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  // Meeus Astronomical Algorithms
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;
  return normalizeDegrees(gmst);
}

/**
 * 計算地方平恆星時 LST（度數）
 */
export function calculateLST(jd: number, longitude: number): number {
  const gmst = calculateGMST(jd);
  return normalizeDegrees(gmst + longitude);
}

/**
 * 計算黃赤交角 ε (Obliquity of Ecliptic)
 */
export function calculateObliquity(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const eps =
    23.439291 -
    0.0130042 * T -
    0.00000016 * T * T +
    0.000000504 * T * T * T;
  return eps;
}

/**
 * 求解克卜勒方程式：E - e * sin(E) = M
 */
function solveKepler(M_rad: number, e: number): number {
  let E = M_rad;
  for (let i = 0; i < 15; i++) {
    const delta = (E - e * Math.sin(E) - M_rad) / (1 - e * Math.cos(E));
    E -= delta;
    if (Math.abs(delta) < 1e-7) break;
  }
  return E;
}

/**
 * 計算太陽黃道經度（度數）
 */
export function calculateSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = normalizeDegrees(M) * DEG2RAD;

  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);

  const sunTrueLong = normalizeDegrees(L0 + C);
  const omega = (125.04 - 1934.136 * T) * DEG2RAD;
  const apparentLong = sunTrueLong - 0.00569 - 0.00478 * Math.sin(omega);
  return normalizeDegrees(apparentLong);
}

/**
 * 計算月球黃道經度（度數）- 採用高階月球攝動展開項
 */
export function calculateMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;

  const Lp = normalizeDegrees(218.3164477 + 481267.88128 * T - 0.0015786 * T * T);
  const D = normalizeDegrees(297.8501921 + 445267.1114 * T - 0.0018819 * T * T) * DEG2RAD;
  const M = normalizeDegrees(357.5291092 + 35999.05029 * T - 0.0001536 * T * T) * DEG2RAD;
  const Mp = normalizeDegrees(134.9633964 + 477198.8675 * T + 0.0087414 * T * T) * DEG2RAD;
  const F = normalizeDegrees(93.272095 + 483202.01752 * T - 0.0036539 * T * T) * DEG2RAD;

  // 主要攝動展開項 (Chapront / ELP-2000 主要周期項)
  let l =
    Lp +
    6.288774 * Math.sin(Mp) +
    1.274027 * Math.sin(2 * D - Mp) +
    0.658314 * Math.sin(2 * D) +
    0.213618 * Math.sin(2 * Mp) -
    0.185116 * Math.sin(M) -
    0.114332 * Math.sin(2 * F) +
    0.058793 * Math.sin(2 * D - 2 * Mp) +
    0.057066 * Math.sin(2 * D - M - Mp) +
    0.053322 * Math.sin(2 * D + Mp) +
    0.045758 * Math.sin(2 * D - M) -
    0.040923 * Math.sin(M - Mp) -
    0.03472 * Math.sin(D) -
    0.030383 * Math.sin(M + Mp) +
    0.015327 * Math.sin(2 * D - 2 * F) -
    0.012528 * Math.sin(2 * D + M - Mp) +
    0.01098 * Math.sin(4 * D - Mp) +
    0.010675 * Math.sin(4 * D - 2 * Mp);

  return normalizeDegrees(l);
}

interface KeplerOrbitElements {
  a: number; // 半長軸 (AU)
  e: number; // 離心率
  i: number; // 軌道傾角 (deg)
  L: number; // 平經度 (deg)
  longPeri: number; // 近日點經度 (deg)
  longNode: number; // 升交點經度 (deg)
  // 變化率 (世紀率 per century)
  a_rate?: number;
  e_rate?: number;
  i_rate?: number;
  L_rate?: number;
  longPeri_rate?: number;
  longNode_rate?: number;
}

// NASA JPL / Standish 行星平均軌道根數 (J2000.0)
const PLANET_ELEMENTS: Record<
  'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto',
  KeplerOrbitElements
> = {
  mercury: {
    a: 0.38709927,
    e: 0.20563593,
    i: 7.00497902,
    L: 252.2503235,
    longPeri: 77.45779628,
    longNode: 48.33076593,
    L_rate: 149472.67411175,
    longPeri_rate: 0.16047689,
    longNode_rate: -0.12534081,
  },
  venus: {
    a: 0.72333566,
    e: 0.00677672,
    i: 3.39467605,
    L: 181.9790995,
    longPeri: 131.60246718,
    longNode: 76.67984255,
    L_rate: 58517.81538729,
    longPeri_rate: 0.00268329,
    longNode_rate: -0.27769418,
  },
  earth: {
    a: 1.00000261,
    e: 0.01671123,
    i: 0.00001531,
    L: 100.46457166,
    longPeri: 102.93768193,
    longNode: 0.0,
    L_rate: 35999.37244981,
    longPeri_rate: 0.32327364,
    longNode_rate: 0.0,
  },
  mars: {
    a: 1.52371034,
    e: 0.0933941,
    i: 1.84969142,
    L: -4.55343205,
    longPeri: -23.94362959,
    longNode: 49.55953891,
    L_rate: 19140.30268499,
    longPeri_rate: 0.44441088,
    longNode_rate: -0.29257343,
  },
  jupiter: {
    a: 5.202887,
    e: 0.04838624,
    i: 1.30439695,
    L: 34.39644051,
    longPeri: 14.72847983,
    longNode: 100.47390909,
    L_rate: 3034.74612775,
    longPeri_rate: 0.21252668,
    longNode_rate: -0.22077288,
  },
  saturn: {
    a: 9.53667594,
    e: 0.05386179,
    i: 2.48599187,
    L: 49.95424423,
    longPeri: 92.59887831,
    longNode: 113.66242448,
    L_rate: 1222.49362201,
    longPeri_rate: -0.41897216,
    longNode_rate: -0.28867794,
  },
  uranus: {
    a: 19.18916464,
    e: 0.04725744,
    i: 0.77263783,
    L: 313.23810451,
    longPeri: 170.9542763,
    longNode: 74.01692503,
    L_rate: 428.48202785,
    longPeri_rate: 0.40805281,
    longNode_rate: 0.04240589,
  },
  neptune: {
    a: 30.06992276,
    e: 0.0086061,
    i: 1.77004347,
    L: -55.12002969,
    longPeri: 44.96476224,
    longNode: 131.78422574,
    L_rate: 218.45945325,
    longPeri_rate: -0.32241464,
    longNode_rate: -0.00598709,
  },
  pluto: {
    a: 39.48211675,
    e: 0.2488273,
    i: 17.14001206,
    L: 238.92903833,
    longPeri: 224.068799,
    longNode: 110.30393608,
    L_rate: 145.20780515,
    longPeri_rate: -0.04062942,
    longNode_rate: -0.00809981,
  },
};

/**
 * 計算單一行星在日心黃道坐標系下的 (x, y, z)
 */
function getHeliocentricPosition(
  planetKey: keyof typeof PLANET_ELEMENTS,
  T: number
): { x: number; y: number; z: number } {
  const el = PLANET_ELEMENTS[planetKey];

  const a = el.a + (el.a_rate || 0) * T;
  const e = el.e + (el.e_rate || 0) * T;
  const i = (el.i + (el.i_rate || 0) * T) * DEG2RAD;
  const L = normalizeDegrees(el.L + (el.L_rate || 0) * T);
  const longPeri = normalizeDegrees(el.longPeri + (el.longPeri_rate || 0) * T);
  const longNode = normalizeDegrees(el.longNode + (el.longNode_rate || 0) * T);

  // 平近點角 M
  const M = normalizeDegrees(L - longPeri) * DEG2RAD;

  // 偏近點角 E
  const E = solveKepler(M, e);

  // 軌道平面坐標
  const x_orb = a * (Math.cos(E) - e);
  const y_orb = a * Math.sqrt(1 - e * e) * Math.sin(E);

  // 近日點幅角 omega
  const omega = (longPeri - longNode) * DEG2RAD;
  const Omega = longNode * DEG2RAD;

  // 轉換到日心黃道坐標系
  const Px = Math.cos(omega) * Math.cos(Omega) - Math.sin(omega) * Math.sin(Omega) * Math.cos(i);
  const Py = Math.cos(omega) * Math.sin(Omega) + Math.sin(omega) * Math.cos(Omega) * Math.cos(i);
  const Pz = Math.sin(omega) * Math.sin(i);

  const Qx = -Math.sin(omega) * Math.cos(Omega) - Math.cos(omega) * Math.sin(Omega) * Math.cos(i);
  const Qy = -Math.sin(omega) * Math.sin(Omega) + Math.cos(omega) * Math.cos(Omega) * Math.cos(i);
  const Qz = Math.cos(omega) * Math.sin(i);

  let x = x_orb * Px + y_orb * Qx;
  let y = x_orb * Py + y_orb * Qy;
  let z = x_orb * Pz + y_orb * Qz;

  // 木星與土星大不等項互攝修正
  if (planetKey === 'jupiter') {
    const M_jup = M;
    const M_sat = normalizeDegrees(PLANET_ELEMENTS.saturn.L + (PLANET_ELEMENTS.saturn.L_rate || 0) * T - (PLANET_ELEMENTS.saturn.longPeri + (PLANET_ELEMENTS.saturn.longPeri_rate || 0) * T)) * DEG2RAD;
    const pert = 0.332 * Math.sin(2 * M_jup - 5 * M_sat - 0.117);
    x += pert * -y / Math.sqrt(x * x + y * y);
    y += pert * x / Math.sqrt(x * x + y * y);
  } else if (planetKey === 'saturn') {
    const M_jup = normalizeDegrees(PLANET_ELEMENTS.jupiter.L + (PLANET_ELEMENTS.jupiter.L_rate || 0) * T - (PLANET_ELEMENTS.jupiter.longPeri + (PLANET_ELEMENTS.jupiter.longPeri_rate || 0) * T)) * DEG2RAD;
    const M_sat = M;
    const pert = -0.812 * Math.sin(2 * M_jup - 5 * M_sat - 0.117);
    x += pert * -y / Math.sqrt(x * x + y * y);
    y += pert * x / Math.sqrt(x * x + y * y);
  }

  return { x, y, z };
}

/**
 * 計算行星地心視黃道經度
 */
export function calculatePlanetGeocentricLongitude(
  planetKey: 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto',
  jd: number
): number {
  const T = (jd - 2451545.0) / 36525.0;
  const earth = getHeliocentricPosition('earth', T);
  const planet = getHeliocentricPosition(planetKey, T);

  const deltaX = planet.x - earth.x;
  const deltaY = planet.y - earth.y;

  let lonRad = Math.atan2(deltaY, deltaX);
  return normalizeDegrees(lonRad * RAD2DEG);
}

/**
 * 計算凱龍星黃道經度 (Chiron)
 */
export function calculateChironLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  // 凱龍星平均半長軸 a = 13.66 AU, 周期約 50.45 年
  const a = 13.66;
  const e = 0.38;
  const L = normalizeDegrees(190.2 + 713.5 * T);
  const longPeri = normalizeDegrees(339.6 + 0.35 * T);
  const M = normalizeDegrees(L - longPeri) * DEG2RAD;
  const E = solveKepler(M, e);

  const x_orb = a * (Math.cos(E) - e);
  const y_orb = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const omega = (longPeri - 209.3) * DEG2RAD;
  const x = x_orb * Math.cos(omega) - y_orb * Math.sin(omega);
  const y = x_orb * Math.sin(omega) + y_orb * Math.cos(omega);

  const earth = getHeliocentricPosition('earth', T);
  const deltaX = x - earth.x;
  const deltaY = y - earth.y;

  return normalizeDegrees(Math.atan2(deltaY, deltaX) * RAD2DEG);
}

/**
 * 計算月球北交點（True Node / North Node）經度
 */
export function calculateNorthNodeLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  // 羅睺平交點公式 + 周期攝動項
  const meanNode = normalizeDegrees(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  const D = normalizeDegrees(297.8501921 + 445267.1114 * T) * DEG2RAD;
  const Mp = normalizeDegrees(134.9633964 + 477198.8675 * T) * DEG2RAD;

  const trueNode = meanNode - 0.26 * Math.sin(2 * D) - 0.17 * Math.sin(2 * Mp);
  return normalizeDegrees(trueNode);
}

/**
 * 計算月球遠地點莉莉絲（Lilith / Black Moon）經度
 */
export function calculateLilithLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const meanApogee = normalizeDegrees(83.35324 + 4069.013728 * T - 0.01032 * T * T);
  const D = normalizeDegrees(297.8501921 + 445267.1114 * T) * DEG2RAD;
  const Mp = normalizeDegrees(134.9633964 + 477198.8675 * T) * DEG2RAD;

  const trueLilith = meanApogee + 0.38 * Math.sin(2 * D - 2 * Mp);
  return normalizeDegrees(trueLilith);
}

/**
 * 計算單一行星在特定儒略日的經度
 */
export function getPlanetLongitude(key: PlanetKey, jd: number): number {
  switch (key) {
    case 'sun':
      return calculateSunLongitude(jd);
    case 'moon':
      return calculateMoonLongitude(jd);
    case 'mercury':
    case 'venus':
    case 'mars':
    case 'jupiter':
    case 'saturn':
    case 'uranus':
    case 'neptune':
    case 'pluto':
      return calculatePlanetGeocentricLongitude(key, jd);
    case 'chiron':
      return calculateChironLongitude(jd);
    case 'northNode':
      return calculateNorthNodeLongitude(jd);
    case 'lilith':
      return calculateLilithLongitude(jd);
    default:
      return 0;
  }
}

/**
 * 計算行星的每日角速度與逆行狀態
 */
export function getPlanetSpeedAndRetrograde(
  key: PlanetKey,
  jd: number
): { speed: number; isRetrograde: boolean } {
  // 北交點通常為常態逆行
  if (key === 'northNode') {
    return { speed: -0.0529, isRetrograde: true };
  }

  const dt = 0.1; // 0.1 天
  const pos1 = getPlanetLongitude(key, jd);
  const pos0 = getPlanetLongitude(key, jd - dt);

  let diff = pos1 - pos0;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  const speed = diff / dt; // 度/天
  const isRetrograde = speed < 0;

  return { speed, isRetrograde };
}
