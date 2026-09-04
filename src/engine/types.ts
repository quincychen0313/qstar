// 星盤計算核心型別定義

export type ZodiacSignKey =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export type ElementType = 'fire' | 'earth' | 'air' | 'water';
export type ModalityType = 'cardinal' | 'fixed' | 'mutable';

export interface ZodiacSignInfo {
  key: ZodiacSignKey;
  name: string; // 繁體中文名稱：如「天蠍座」
  symbol: string; // 符號：如 ♏
  element: ElementType;
  elementName: string; // 「水象」
  modality: ModalityType;
  modalityName: string; // 「固定星座」
  ruler: string; // 守護星：如「冥王星 / 火星」
  degreeStart: number; // 0, 30, 60 ...
  degreeEnd: number;
  color: string;
}

export type PlanetKey =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto'
  | 'chiron'
  | 'northNode'
  | 'lilith';

export interface PlanetInfo {
  key: PlanetKey;
  name: string; // 繁體中文名稱：「太陽」、「月亮」
  symbol: string; // ☉, ☽, ☿, ♀, ♂, etc.
  category: 'luminary' | 'personal' | 'social' | 'transpersonal' | 'point';
  color: string;
}

export interface PlanetPosition {
  key: PlanetKey;
  name: string;
  symbol: string;
  longitude: number; // 0 - 360 總黃道度數
  signKey: ZodiacSignKey;
  signName: string;
  signSymbol: string;
  degrees: number; // 在該星座內的度數 0 - 29
  minutes: number; // 分 0 - 59
  seconds: number; // 秒 0 - 59
  house: number; // 所落宮位 1 - 12
  isRetrograde: boolean; // 是否逆行
  speed: number; // 每日運行速度（度/天）
}

export type HouseSystemType = 'placidus' | 'whole-sign' | 'equal';

export interface HouseCusp {
  house: number; // 1 - 12
  longitude: number; // 0 - 360 總黃道度數
  signKey: ZodiacSignKey;
  signName: string;
  signSymbol: string;
  degrees: number;
  minutes: number;
  rulerSign: string;
}

export interface Angles {
  ascendant: {
    longitude: number;
    signKey: ZodiacSignKey;
    signName: string;
    degrees: number;
    minutes: number;
  };
  midheaven: {
    longitude: number;
    signKey: ZodiacSignKey;
    signName: string;
    degrees: number;
    minutes: number;
  };
  descendant: {
    longitude: number;
    signKey: ZodiacSignKey;
    signName: string;
    degrees: number;
    minutes: number;
  };
  imumCoeli: {
    longitude: number;
    signKey: ZodiacSignKey;
    signName: string;
    degrees: number;
    minutes: number;
  };
}

export type AspectType =
  | 'conjunction' // 合相 0°
  | 'sextile' // 六分相 60°
  | 'square' // 四分相 90°
  | 'trine' // 三分相 120°
  | 'opposition'; // 對分相 180°

export interface Aspect {
  planet1: PlanetPosition;
  planet2: PlanetPosition;
  aspectType: AspectType;
  name: string; // 「合相」、「對分相」等
  symbol: string; // ☌, ⚹, □, △, ☍
  angle: number; // 精確理論角度 0, 60, 90, 120, 180
  actualDifference: number; // 實際兩星夾角
  orb: number; // 容許度偏差值（絕對值）
  isApplying: boolean; // 是否入相位
  nature: 'harmonious' | 'challenging' | 'neutral'; // 和諧、挑戰、中性
  color: string;
}

export interface ElementBalance {
  fire: { count: number; percentage: number; planets: string[] };
  earth: { count: number; percentage: number; planets: string[] };
  air: { count: number; percentage: number; planets: string[] };
  water: { count: number; percentage: number; planets: string[] };
}

export interface ModalityBalance {
  cardinal: { count: number; percentage: number; planets: string[] };
  fixed: { count: number; percentage: number; planets: string[] };
  mutable: { count: number; percentage: number; planets: string[] };
}

export interface BirthData {
  id?: string;
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
  isUnknownTime?: boolean; // 未知確切出生時間
  cityName: string;
  latitude: number; // 緯度（北緯為正，南緯為負）
  longitude: number; // 經度（東經為正，西經為負）
  timezoneOffset: number; // 與 UTC 的時差（如台北為 +8）
  houseSystem: HouseSystemType;
}

export interface NatalChartResult {
  birthData: BirthData;
  julianDay: number;
  localSiderealTime: number;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  angles: Angles;
  aspects: Aspect[];
  elementBalance: ElementBalance;
  modalityBalance: ModalityBalance;
  bigThree: {
    sun: PlanetPosition;
    moon: PlanetPosition;
    ascendant: {
      signKey: ZodiacSignKey;
      signName: string;
      signSymbol: string;
      degrees: number;
      minutes: number;
    };
  };
}

// ──────────────────────────────────────────────
// 雙人合盤 (Synastry) 與中點組合盤 (Composite) 型別
// ──────────────────────────────────────────────

export type ChartAppMode = 'natal' | 'synastry' | 'composite';
export type RelationshipType = 'romance' | 'friendship' | 'business';

/**
 * 盤主 A 與盤主 B 行星間的交叉相位 (Cross-Aspect)
 */
export interface CrossAspect {
  planetA: PlanetPosition;
  planetB: PlanetPosition;
  aspectType: AspectType;
  name: string;
  symbol: string;
  angle: number;
  actualDifference: number;
  orb: number;
  nature: 'harmonious' | 'challenging' | 'neutral';
  color: string;
  scoreContribution: number; // 對契合度的加減分權重
}

/**
 * 盤主 A 的行星落入盤主 B 的後天宮位
 */
export interface PlanetInPartnerHouse {
  planet: PlanetPosition;
  houseInPartner: number; // 1 - 12
  houseThemeName: string;
  interpretation: string;
}

/**
 * 四維關係契合度量化評分
 */
export interface CompatibilityScores {
  overallScore: number; // 0 - 100 綜合契合總分
  soulResonance: number; // 靈魂共鳴 (日月、月月、月木等)
  romanticAttraction: number; // 激情吸引 (金火、日金、火火等)
  communication: number; // 思維溝通 (水水、日水、水木等)
  longTermStability: number; // 長久羈絆 (土星責任、木星庇護等)
  chemistryLabel: string; // 如：「宿世情緣·靈魂伴侶」、「致命吸引·烈火燃燒」、「知己好友·心有靈犀」
  summary: string; // 綜合評析導言
}

/**
 * 雙人比較盤 (Synastry) 完整計算結果
 */
export interface SynastryResult {
  chartA: NatalChartResult;
  chartB: NatalChartResult;
  crossAspects: CrossAspect[];
  aInBHouses: PlanetInPartnerHouse[];
  bInAHouses: PlanetInPartnerHouse[];
  compatibility: CompatibilityScores;
  relationshipType: RelationshipType;
}

/**
 * 關係中點組合盤 (Composite Chart) 完整計算結果
 */
export interface CompositeResult {
  partnerA: BirthData;
  partnerB: BirthData;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  angles: Angles;
  aspects: Aspect[];
  elementBalance: ElementBalance;
  modalityBalance: ModalityBalance;
  bigThree: {
    sun: PlanetPosition;
    moon: PlanetPosition;
    ascendant: {
      signKey: ZodiacSignKey;
      signName: string;
      signSymbol: string;
      degrees: number;
      minutes: number;
    };
  };
}
