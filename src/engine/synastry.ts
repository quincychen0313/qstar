// 雙人合盤 (Synastry) 與中點組合盤 (Composite Chart) 計算核心
import {
  BirthData,
  CrossAspect,
  CompatibilityScores,
  PlanetInPartnerHouse,
  PlanetKey,
  PlanetPosition,
  RelationshipType,
  SynastryResult,
  CompositeResult,
  Aspect,
  AspectType,
  HouseCusp,
  Angles,
} from './types';
import { calculateNatalChart } from './index';
import { getHouseForLongitude } from './houses';
import { getAngularDifference, calculateAspects, calculateElementBalance, calculateModalityBalance } from './aspects';
import { degreeToSignDetail, PLANETS_META, ASPECT_CONFIG, ZODIAC_SIGNS } from '../data/zodiac';
import { HOUSES_THEMES } from '../data/interpretations';

/**
 * 計算圓周上的劣弧中點（Shortest Arc Midpoint）
 * 占星學權威中點計算法，保證中點落在兩人星體較短的弧度上
 */
export function calculateMidpoint(deg1: number, deg2: number): number {
  const d1 = ((deg1 % 360) + 360) % 360;
  const d2 = ((deg2 % 360) + 360) % 360;

  const diff = Math.abs(d1 - d2);
  if (diff <= 180) {
    return (d1 + d2) / 2;
  } else {
    return ((d1 + d2) / 2 + 180) % 360;
  }
}

/**
 * 計算盤主 A 與盤主 B 行星間的所有交叉相位 (Cross-Aspects)
 */
export function calculateCrossAspects(
  planetsA: PlanetPosition[],
  planetsB: PlanetPosition[]
): CrossAspect[] {
  const crossAspects: CrossAspect[] = [];
  const aspectTypes: AspectType[] = [
    'conjunction',
    'opposition',
    'trine',
    'square',
    'sextile',
  ];

  for (const pA of planetsA) {
    for (const pB of planetsB) {
      const diff = getAngularDifference(pA.longitude, pB.longitude);
      const hasLuminary =
        pA.key === 'sun' ||
        pA.key === 'moon' ||
        pB.key === 'sun' ||
        pB.key === 'moon';

      for (const aType of aspectTypes) {
        const config = ASPECT_CONFIG[aType];
        const maxOrb = hasLuminary ? config.defaultOrb + 1.5 : config.defaultOrb;
        const currentOrb = Math.abs(diff - config.angle);

        if (currentOrb <= maxOrb) {
          // 計算對關係契合度的權重影響
          let score = 0;
          const isHarmonious = config.nature === 'harmonious';
          const isChallenging = config.nature === 'challenging';
          const isConjunction = aType === 'conjunction';

          // 日月吉相（大加分）
          if (
            (pA.key === 'sun' && pB.key === 'moon') ||
            (pA.key === 'moon' && pB.key === 'sun')
          ) {
            score = isConjunction || isHarmonious ? 12 : -5;
          }
          // 金火吉相（激情加分）
          else if (
            (pA.key === 'venus' && pB.key === 'mars') ||
            (pA.key === 'mars' && pB.key === 'venus')
          ) {
            score = isConjunction || isHarmonious ? 10 : isChallenging ? 4 : 2; // 金火即使四分相也有強烈吸引張力
          }
          // 水星溝通
          else if (pA.key === 'mercury' && pB.key === 'mercury') {
            score = isHarmonious || isConjunction ? 8 : -4;
          }
          // 土星穩定與責任
          else if (pA.key === 'saturn' || pB.key === 'saturn') {
            score = isHarmonious || isConjunction ? 7 : -6;
          }
          // 泛用相位權重
          else {
            score = isHarmonious ? 5 : isChallenging ? -4 : 4;
          }

          crossAspects.push({
            planetA: pA,
            planetB: pB,
            aspectType: aType,
            name: config.name,
            symbol: config.symbol,
            angle: config.angle,
            actualDifference: diff,
            orb: parseFloat(currentOrb.toFixed(2)),
            nature: config.nature,
            color: config.color,
            scoreContribution: score,
          });
        }
      }
    }
  }

  // 依容許度緊密程度排序
  crossAspects.sort((a, b) => a.orb - b.orb);
  return crossAspects;
}

/**
 * 計算一方行星落入另一方後天宮位
 */
export function calculatePlanetsInPartnerHouses(
  planetsSource: PlanetPosition[],
  housesTarget: HouseCusp[]
): PlanetInPartnerHouse[] {
  return planetsSource.map((p) => {
    const houseNum = getHouseForLongitude(p.longitude, housesTarget);
    const theme = HOUSES_THEMES[houseNum];
    return {
      planet: p,
      houseInPartner: houseNum,
      houseThemeName: theme?.name || `第 ${houseNum} 宮`,
      interpretation: `${p.name}落入對方的${theme?.name || ''}：為對方的「${theme?.lifeArea || ''}」生活領域注入了強烈的個人色彩。`,
    };
  });
}

/**
 * 計算四維度契合度評分
 */
export function calculateCompatibilityScores(
  crossAspects: CrossAspect[],
  relationshipType: RelationshipType = 'romance'
): CompatibilityScores {
  let soul = 65;
  let romance = 60;
  let communication = 62;
  let stability = 60;

  for (const a of crossAspects) {
    const p1 = a.planetA.key;
    const p2 = a.planetB.key;
    const isHarmonious = a.nature === 'harmonious' || a.aspectType === 'conjunction';

    // 靈魂共鳴維度（日、月、木）
    if (['sun', 'moon', 'jupiter'].includes(p1) && ['sun', 'moon', 'jupiter'].includes(p2)) {
      soul += isHarmonious ? 4.5 : -3;
    }

    // 浪漫與激情吸引（金、火、日、冥）
    if (['venus', 'mars', 'pluto'].includes(p1) && ['venus', 'mars', 'pluto'].includes(p2)) {
      romance += isHarmonious ? 4.5 : 2.5; // 張力相位亦可激發強烈性吸引力
    }

    // 思維交流與溝通（水、日、天王）
    if (p1 === 'mercury' || p2 === 'mercury') {
      communication += isHarmonious ? 4 : -3.5;
    }

    // 長期穩定與責任羈絆（土、木、月、日）
    if (p1 === 'saturn' || p2 === 'saturn') {
      stability += isHarmonious ? 5 : -4;
    }
  }

  // 數值箝制在 20 - 99 區間
  soul = Math.min(99, Math.max(25, Math.round(soul)));
  romance = Math.min(99, Math.max(25, Math.round(romance)));
  communication = Math.min(99, Math.max(25, Math.round(communication)));
  stability = Math.min(99, Math.max(25, Math.round(stability)));

  // 綜合總分依關係類型加權
  let overall = 0;
  if (relationshipType === 'romance') {
    overall = Math.round(soul * 0.3 + romance * 0.35 + communication * 0.15 + stability * 0.2);
  } else if (relationshipType === 'friendship') {
    overall = Math.round(soul * 0.35 + communication * 0.35 + stability * 0.2 + romance * 0.1);
  } else {
    overall = Math.round(communication * 0.4 + stability * 0.4 + soul * 0.2);
  }

  // 給予關係化學反應稱號標籤
  let chemistryLabel = '和諧共鳴·平穩相伴';
  let summary = '兩人星盤間具備穩健的互動基底，相處自在從容。';

  if (overall >= 88) {
    chemistryLabel = '天作之合·靈魂契合';
    summary = '命盤間存在極為罕見的高和諧相位共鳴，彼此心意相通，具備深刻的精神默契與難以割捨的深厚羈絆。';
  } else if (romance >= 85 && soul >= 75) {
    chemistryLabel = '致命吸引·火花璀璨';
    summary = '兩人的金星與火星彼此強力呼應，初次相遇便能引發強烈的吸引力與浪漫憧憬，相處充滿激情與趣味。';
  } else if (soul >= 85 && communication >= 80) {
    chemistryLabel = '心有靈犀·知己同頻';
    summary = '彼此在思維觀點與內在情感上高度共振，無話不談，能夠接住彼此最脆弱細膩的情緒。';
  } else if (romance >= 80 && stability < 60) {
    chemistryLabel = '相愛相殺·歡喜冤家';
    summary = '吸引力極強且充滿戲劇性火花，但相處中也伴隨著觀點碰撞與性格磨合，需要多一份包容與理性傾聽。';
  } else if (stability >= 85) {
    chemistryLabel = '相濡以沫·長久相守';
    summary = '彼此帶來極大的信任感與責任感，適合攜手面對現實生活中的各項考驗，是彼此最堅固的後盾。';
  }

  return {
    overallScore: overall,
    soulResonance: soul,
    romanticAttraction: romance,
    communication,
    longTermStability: stability,
    chemistryLabel,
    summary,
  };
}

/**
 * 主計算函式：推算雙人合盤 (Synastry Chart)
 */
export function calculateSynastryChart(
  birthA: BirthData,
  birthB: BirthData,
  relationshipType: RelationshipType = 'romance'
): SynastryResult {
  const chartA = calculateNatalChart(birthA);
  const chartB = calculateNatalChart(birthB);

  const crossAspects = calculateCrossAspects(chartA.planets, chartB.planets);
  const aInBHouses = calculatePlanetsInPartnerHouses(chartA.planets, chartB.houses);
  const bInAHouses = calculatePlanetsInPartnerHouses(chartB.planets, chartA.houses);
  const compatibility = calculateCompatibilityScores(crossAspects, relationshipType);

  return {
    chartA,
    chartB,
    crossAspects,
    aInBHouses,
    bInAHouses,
    compatibility,
    relationshipType,
  };
}

/**
 * 主計算函式：推算中點組合盤 (Composite Chart)
 */
export function calculateCompositeChart(
  birthA: BirthData,
  birthB: BirthData
): CompositeResult {
  const chartA = calculateNatalChart(birthA);
  const chartB = calculateNatalChart(birthB);

  // 1. 計算所有行星的中點
  const compositePlanets: PlanetPosition[] = [];
  const planetKeys: PlanetKey[] = [
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

  for (const key of planetKeys) {
    const pA = chartA.planets.find((p) => p.key === key)!;
    const pB = chartB.planets.find((p) => p.key === key)!;

    const midLon = calculateMidpoint(pA.longitude, pB.longitude);
    const detail = degreeToSignDetail(midLon);
    const meta = PLANETS_META[key];

    compositePlanets.push({
      key,
      name: meta.name,
      symbol: meta.symbol,
      longitude: midLon,
      signKey: detail.signKey,
      signName: detail.signName,
      signSymbol: detail.signSymbol,
      degrees: detail.degrees,
      minutes: detail.minutes,
      seconds: detail.seconds,
      house: 1, // 稍後指派
      isRetrograde: pA.isRetrograde || pB.isRetrograde,
      speed: (pA.speed + pB.speed) / 2,
    });
  }

  // 2. 計算組合盤四軸點中點
  const midASC = calculateMidpoint(
    chartA.angles.ascendant.longitude,
    chartB.angles.ascendant.longitude
  );
  const midMC = calculateMidpoint(
    chartA.angles.midheaven.longitude,
    chartB.angles.midheaven.longitude
  );
  const midDSC = (midASC + 180) % 360;
  const midIC = (midMC + 180) % 360;

  const ascDetail = degreeToSignDetail(midASC);
  const mcDetail = degreeToSignDetail(midMC);
  const dscDetail = degreeToSignDetail(midDSC);
  const icDetail = degreeToSignDetail(midIC);

  const angles: Angles = {
    ascendant: {
      longitude: midASC,
      signKey: ascDetail.signKey,
      signName: ascDetail.signName,
      degrees: ascDetail.degrees,
      minutes: ascDetail.minutes,
    },
    midheaven: {
      longitude: midMC,
      signKey: mcDetail.signKey,
      signName: mcDetail.signName,
      degrees: mcDetail.degrees,
      minutes: mcDetail.minutes,
    },
    descendant: {
      longitude: midDSC,
      signKey: dscDetail.signKey,
      signName: dscDetail.signName,
      degrees: dscDetail.degrees,
      minutes: dscDetail.minutes,
    },
    imumCoeli: {
      longitude: midIC,
      signKey: icDetail.signKey,
      signName: icDetail.signName,
      degrees: icDetail.degrees,
      minutes: icDetail.minutes,
    },
  };

  // 3. 計算組合盤宮位（以中點中介宮位計）
  const compositeHouses: HouseCusp[] = [];
  for (let i = 0; i < 12; i++) {
    const cuspA = chartA.houses[i].longitude;
    const cuspB = chartB.houses[i].longitude;
    const midCusp = calculateMidpoint(cuspA, cuspB);
    const detail = degreeToSignDetail(midCusp);
    const signInfo = ZODIAC_SIGNS[detail.signKey];

    compositeHouses.push({
      house: i + 1,
      longitude: midCusp,
      signKey: detail.signKey,
      signName: detail.signName,
      signSymbol: detail.signSymbol,
      degrees: detail.degrees,
      minutes: detail.minutes,
      rulerSign: signInfo.ruler,
    });
  }

  // 更新組合盤行星落宮
  for (const p of compositePlanets) {
    p.house = getHouseForLongitude(p.longitude, compositeHouses);
  }

  // 4. 計算組合盤內部相位
  const aspects: Aspect[] = calculateAspects(compositePlanets);

  // 5. 元素與形態平衡
  const elementBalance = calculateElementBalance(compositePlanets);
  const modalityBalance = calculateModalityBalance(compositePlanets);

  // 6. 組合盤三巨頭
  const sun = compositePlanets.find((p) => p.key === 'sun')!;
  const moon = compositePlanets.find((p) => p.key === 'moon')!;

  return {
    partnerA: birthA,
    partnerB: birthB,
    planets: compositePlanets,
    houses: compositeHouses,
    angles,
    aspects,
    elementBalance,
    modalityBalance,
    bigThree: {
      sun,
      moon,
      ascendant: {
        signKey: ascDetail.signKey,
        signName: ascDetail.signName,
        signSymbol: ascDetail.signSymbol,
        degrees: ascDetail.degrees,
        minutes: ascDetail.minutes,
      },
    },
  };
}
