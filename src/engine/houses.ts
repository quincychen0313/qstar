// 宮位與四軸點計算系統（普拉西度制、整宮制、等宮制）
import { Angles, HouseCusp, HouseSystemType } from './types';
import { calculateLST, calculateObliquity, normalizeDegrees } from './astronomy';
import { degreeToSignDetail, ZODIAC_SIGNS } from '../data/zodiac';

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * 計算四軸點：上升點 ASC、天頂 MC、下降點 DSC、天底 IC
 */
export function calculateAngles(
  jd: number,
  latitude: number,
  longitude: number
): Angles {
  const lst = calculateLST(jd, longitude);
  const eps = calculateObliquity(jd);

  const ramcRad = lst * DEG2RAD;
  const epsRad = eps * DEG2RAD;
  const latRad = latitude * DEG2RAD;

  // 天頂 MC (Midheaven)
  // tan(MC) = tan(RAMC) / cos(eps)
  const mcY = Math.sin(ramcRad);
  const mcX = Math.cos(ramcRad) * Math.cos(epsRad);
  let mc = normalizeDegrees(Math.atan2(mcY, mcX) * RAD2DEG);

  // 天底 IC
  const ic = normalizeDegrees(mc + 180);

  // 上升點 ASC (Ascendant)
  // tan(ASC) = cos(RAMC) / (-sin(RAMC)*cos(eps) - tan(lat)*sin(eps))
  const ascY = Math.cos(ramcRad);
  const ascX =
    -Math.sin(ramcRad) * Math.cos(epsRad) -
    Math.tan(latRad) * Math.sin(epsRad);
  let asc = normalizeDegrees(Math.atan2(ascY, ascX) * RAD2DEG);

  // 下降點 DSC
  const dsc = normalizeDegrees(asc + 180);

  const ascDetail = degreeToSignDetail(asc);
  const mcDetail = degreeToSignDetail(mc);
  const dscDetail = degreeToSignDetail(dsc);
  const icDetail = degreeToSignDetail(ic);

  return {
    ascendant: {
      longitude: asc,
      signKey: ascDetail.signKey,
      signName: ascDetail.signName,
      degrees: ascDetail.degrees,
      minutes: ascDetail.minutes,
    },
    midheaven: {
      longitude: mc,
      signKey: mcDetail.signKey,
      signName: mcDetail.signName,
      degrees: mcDetail.degrees,
      minutes: mcDetail.minutes,
    },
    descendant: {
      longitude: dsc,
      signKey: dscDetail.signKey,
      signName: dscDetail.signName,
      degrees: dscDetail.degrees,
      minutes: dscDetail.minutes,
    },
    imumCoeli: {
      longitude: ic,
      signKey: icDetail.signKey,
      signName: icDetail.signName,
      degrees: icDetail.degrees,
      minutes: icDetail.minutes,
    },
  };
}

/**
 * 求解普拉西度單一中介宮位度數
 */
function solvePlacidusCusp(
  ramc: number,
  fraction: number,
  eps: number,
  latitude: number,
  isAboveHorizon: boolean
): number {
  const epsRad = eps * DEG2RAD;
  const latRad = latitude * DEG2RAD;
  let targetAngle = normalizeDegrees(ramc + (isAboveHorizon ? 1 : -1) * fraction * 90);

  // 初始估計
  let lon = targetAngle;
  for (let iter = 0; iter < 20; iter++) {
    const lonRad = lon * DEG2RAD;
    // 赤緯 declination
    const sinDec = Math.sin(epsRad) * Math.sin(lonRad);
    const cosDec = Math.sqrt(Math.max(0, 1 - sinDec * sinDec));
    const tanDec = sinDec / (cosDec || 1e-6);

    // 赤經 right ascension
    const ra = Math.atan2(
      Math.cos(epsRad) * Math.sin(lonRad),
      Math.cos(lonRad)
    ) * RAD2DEG;

    // 半弧 semi-arc
    const tanLatTanDec = Math.tan(latRad) * tanDec;
    // 防止極區數值溢位
    const clamped = Math.max(-0.9999, Math.min(0.9999, tanLatTanDec));
    const semiArc = isAboveHorizon
      ? 90 + Math.asin(clamped) * RAD2DEG
      : 90 - Math.asin(clamped) * RAD2DEG;

    const diff = normalizeDegrees(ra - ramc);
    const currentDiff = diff > 180 ? diff - 360 : diff;
    const targetDiff = (isAboveHorizon ? 1 : -1) * fraction * semiArc;

    const error = currentDiff - targetDiff;
    if (Math.abs(error) < 0.001) break;

    lon = normalizeDegrees(lon - error * 0.8);
  }

  return lon;
}

/**
 * 計算十二宮位宮頭經度
 */
export function calculateHouses(
  jd: number,
  latitude: number,
  longitude: number,
  system: HouseSystemType
): HouseCusp[] {
  const angles = calculateAngles(jd, latitude, longitude);
  const asc = angles.ascendant.longitude;
  const mc = angles.midheaven.longitude;
  const lst = calculateLST(jd, longitude);
  const eps = calculateObliquity(jd);

  const cuspsDeg: number[] = new Array(12);

  if (system === 'whole-sign') {
    // 整宮制：上升點所在星座 0 度為第一宮宮頭
    const signIndex = Math.floor(asc / 30);
    for (let i = 0; i < 12; i++) {
      cuspsDeg[i] = normalizeDegrees((signIndex + i) * 30);
    }
  } else if (system === 'equal') {
    // 等宮制：以 ASC 為第 1 宮，每宮精確遞增 30 度
    for (let i = 0; i < 12; i++) {
      cuspsDeg[i] = normalizeDegrees(asc + i * 30);
    }
  } else {
    // 預設普拉西度制 (Placidus)
    // 極區如果緯度過高 (|lat| > 66)，自動平滑回退至 Porphyry 等宮分割
    if (Math.abs(latitude) > 66) {
      const arcMCtoASC = normalizeDegrees(asc - mc);
      const arcASCtoIC = normalizeDegrees(angles.imumCoeli.longitude - asc);

      cuspsDeg[9] = mc; // 10宮
      cuspsDeg[10] = normalizeDegrees(mc + arcMCtoASC / 3); // 11宮
      cuspsDeg[11] = normalizeDegrees(mc + (2 * arcMCtoASC) / 3); // 12宮
      cuspsDeg[0] = asc; // 1宮
      cuspsDeg[1] = normalizeDegrees(asc + arcASCtoIC / 3); // 2宮
      cuspsDeg[2] = normalizeDegrees(asc + (2 * arcASCtoIC) / 3); // 3宮
    } else {
      cuspsDeg[9] = mc; // 10宮 (MC)
      cuspsDeg[0] = asc; // 1宮 (ASC)
      cuspsDeg[3] = angles.imumCoeli.longitude; // 4宮 (IC)
      cuspsDeg[6] = angles.descendant.longitude; // 7宮 (DSC)

      // 求解 11, 12, 2, 3 宮
      cuspsDeg[10] = solvePlacidusCusp(lst, 1 / 3, eps, latitude, true); // 11宮
      cuspsDeg[11] = solvePlacidusCusp(lst, 2 / 3, eps, latitude, true); // 12宮
      cuspsDeg[1] = solvePlacidusCusp(lst, 2 / 3, eps, latitude, false); // 2宮
      cuspsDeg[2] = solvePlacidusCusp(lst, 1 / 3, eps, latitude, false); // 3宮
    }

    // 對宮為精確對沖 180 度
    cuspsDeg[4] = normalizeDegrees(cuspsDeg[10] + 180); // 5宮
    cuspsDeg[5] = normalizeDegrees(cuspsDeg[11] + 180); // 6宮
    cuspsDeg[7] = normalizeDegrees(cuspsDeg[1] + 180); // 8宮
    cuspsDeg[8] = normalizeDegrees(cuspsDeg[2] + 180); // 9宮
  }

  // 封裝宮位結構
  const result: HouseCusp[] = [];
  for (let i = 0; i < 12; i++) {
    const cuspLon = cuspsDeg[i];
    const detail = degreeToSignDetail(cuspLon);
    const signInfo = ZODIAC_SIGNS[detail.signKey];

    result.push({
      house: i + 1,
      longitude: cuspLon,
      signKey: detail.signKey,
      signName: detail.signName,
      signSymbol: detail.signSymbol,
      degrees: detail.degrees,
      minutes: detail.minutes,
      rulerSign: signInfo.ruler,
    });
  }

  return result;
}

/**
 * 判斷特定黃道經度落入哪一個宮位 (1 - 12)
 */
export function getHouseForLongitude(
  longitude: number,
  houses: HouseCusp[]
): number {
  const norm = normalizeDegrees(longitude);

  for (let i = 0; i < 12; i++) {
    const currentCusp = houses[i].longitude;
    const nextCusp = houses[(i + 1) % 12].longitude;

    if (currentCusp <= nextCusp) {
      if (norm >= currentCusp && norm < nextCusp) {
        return i + 1;
      }
    } else {
      // 跨越 0 度 (牡羊座交界)
      if (norm >= currentCusp || norm < nextCusp) {
        return i + 1;
      }
    }
  }

  return 1;
}
