// 星盤天文核心與合盤/組合盤自動化單元驗證腳本
import {
  calculateJulianDay,
  calculateGMST,
  calculateSunLongitude,
  calculateMoonLongitude,
} from './astronomy';
import { calculateAngles, calculateHouses } from './houses';
import { calculateNatalChart } from './index';
import { calculateMidpoint, calculateCrossAspects, calculateCompatibilityScores, calculateCompositeChart } from './synastry';
import { degreeToSignDetail } from '../data/zodiac';

// 自建微型斷言函式（無須依賴額外 Node 型別套件）
function assert(condition: unknown, message?: string) {
  if (!condition) throw new Error(message || 'Assertion failed');
}
assert.strictEqual = function (actual: unknown, expected: unknown, message?: string) {
  if (actual !== expected) throw new Error(message || `Expected ${expected}, got ${actual}`);
};

console.log('🌟 開始執行星盤演算法與合盤/組合盤單元驗證測試...\n');

let passedTests = 0;

function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ 通過: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ 失敗: ${name}`);
    console.error(err);
    throw err;
  }
}

// 1. 測試儒略日計算 (J2000.0 基準點)
runTest('儒略日轉換驗證 (2000-01-01 12:00:00 UTC 應精確為 2451545.0)', () => {
  const jd = calculateJulianDay(2000, 1, 1, 12, 0, 0, 0);
  assert(Math.abs(jd - 2451545.0) < 1e-5, `實際 JD: ${jd}`);
});

// 2. 測試格林威治平恆星時 GMST
runTest('GMST 恆星時驗證 (J2000.0 時 GMST 應約為 280.46 度)', () => {
  const jd = 2451545.0;
  const gmst = calculateGMST(jd);
  assert(Math.abs(gmst - 280.46) < 0.1, `實際 GMST: ${gmst}`);
});

// 3. 測試太陽經度 (秋分與春分季節性驗證)
runTest('太陽黃道經度驗證 (2000-03-20 春分點附近太陽經度應接近 0 度牡羊)', () => {
  const jd = calculateJulianDay(2000, 3, 20, 7, 35, 0, 0);
  const sunLon = calculateSunLongitude(jd);
  const diff = Math.min(sunLon, 360 - sunLon);
  assert(diff < 1.0, `實際太陽經度: ${sunLon}`);
});

runTest('太陽黃道經度驗證 (1995-10-24 太陽應在天蠍座)', () => {
  const jd = calculateJulianDay(1995, 10, 24, 6, 30, 0, 0);
  const sunLon = calculateSunLongitude(jd);
  const sign = degreeToSignDetail(sunLon);
  assert.strictEqual(sign.signKey, 'scorpio', `太陽所在星座應為天蠍座，實際為: ${sign.signName}`);
});

// 4. 測試月球運算
runTest('月球黃道經度基本範圍驗證', () => {
  const jd = calculateJulianDay(2024, 1, 1, 0, 0, 0, 0);
  const moonLon = calculateMoonLongitude(jd);
  assert(moonLon >= 0 && moonLon < 360, `月球經度應在 0-360 區間，實際: ${moonLon}`);
});

// 5. 測試四軸點 ASC 與 MC
runTest('四軸點 ASC 與 MC 相互關係驗證', () => {
  const jd = calculateJulianDay(1996, 10, 24, 14, 30, 0, 8);
  const angles = calculateAngles(jd, 25.033, 121.5654);
  assert(angles.ascendant.longitude >= 0 && angles.ascendant.longitude < 360);
  assert(angles.midheaven.longitude >= 0 && angles.midheaven.longitude < 360);
  const dscExpected = (angles.ascendant.longitude + 180) % 360;
  assert(Math.abs(angles.descendant.longitude - dscExpected) < 1e-4, 'DSC 應與 ASC 相隔 180 度');
});

// 6. 測試宮位制
runTest('整宮制 (Whole Sign) 十二宮每宮間距精確 30 度', () => {
  const jd = calculateJulianDay(1996, 10, 24, 14, 30, 0, 8);
  const houses = calculateHouses(jd, 25.033, 121.5654, 'whole-sign');
  assert.strictEqual(houses.length, 12);
  for (let i = 0; i < 11; i++) {
    const diff = (houses[i + 1].longitude - houses[i].longitude + 360) % 360;
    assert(Math.abs(diff - 30) < 1e-4, `宮位 ${i+1} 與 ${i+2} 差非 30 度: ${diff}`);
  }
});

// 7. 測試劣弧中點計算 (Shortest Arc Midpoint)
runTest('劣弧中點演算法驗證 (跨 0 度交界點 350° 與 10° 之中點應為 0°)', () => {
  const mid1 = calculateMidpoint(350, 10);
  assert(Math.abs(mid1 - 0) < 1e-4, `350° 與 10° 劣弧中點應為 0°，實際為 ${mid1}°`);

  const mid2 = calculateMidpoint(10, 350);
  assert(Math.abs(mid2 - 0) < 1e-4, `交換參數 10° 與 350° 劣弧中點亦應為 0°，實際為 ${mid2}°`);

  const mid3 = calculateMidpoint(30, 90);
  assert(Math.abs(mid3 - 60) < 1e-4, `30° 與 90° 中點應為 60°，實際為 ${mid3}°`);
});

// 8. 測試雙人交叉相位與契合度評分
runTest('雙人合盤交叉相位與契合度量化運算驗證', () => {
  const chartA = calculateNatalChart({
    name: '盤主 A',
    year: 1996,
    month: 10,
    day: 24,
    hour: 14,
    minute: 30,
    cityName: '台北市',
    latitude: 25.033,
    longitude: 121.5654,
    timezoneOffset: 8,
    houseSystem: 'placidus',
  });

  const chartB = calculateNatalChart({
    name: '盤主 B',
    year: 1998,
    month: 6,
    day: 8,
    hour: 9,
    minute: 15,
    cityName: '東京',
    latitude: 35.6762,
    longitude: 139.6503,
    timezoneOffset: 9,
    houseSystem: 'placidus',
  });

  const crossAspects = calculateCrossAspects(chartA.planets, chartB.planets);
  assert(crossAspects.length > 0, '應計算出雙人交叉相位');

  const scores = calculateCompatibilityScores(crossAspects, 'romance');
  assert(scores.overallScore >= 0 && scores.overallScore <= 100, '綜合分數應在 0-100');
  assert(scores.chemistryLabel.length > 0, '應產生關係化學標籤');
});

// 9. 測試關係中點組合盤 (Composite Chart)
runTest('中點組合盤推算結構與行星落宮完整性驗證', () => {
  const birthA = {
    name: 'A',
    year: 1996,
    month: 10,
    day: 24,
    hour: 14,
    minute: 30,
    cityName: '台北市',
    latitude: 25.033,
    longitude: 121.5654,
    timezoneOffset: 8,
    houseSystem: 'placidus' as const,
  };

  const birthB = {
    name: 'B',
    year: 1998,
    month: 6,
    day: 8,
    hour: 9,
    minute: 15,
    cityName: '東京',
    latitude: 35.6762,
    longitude: 139.6503,
    timezoneOffset: 9,
    houseSystem: 'placidus' as const,
  };

  const composite = calculateCompositeChart(birthA, birthB);
  assert.strictEqual(composite.planets.length, 13, '組合盤應有 13 個天體');
  assert.strictEqual(composite.houses.length, 12, '組合盤應有 12 宮');
  assert(composite.bigThree.sun && composite.bigThree.moon && composite.bigThree.ascendant, '組合盤應包含三巨頭');
});

console.log(`\n🎉 全部 ${passedTests} 項單元測試順利通過！`);
