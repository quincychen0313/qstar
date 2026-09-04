import {
  ZodiacSignKey,
  ZodiacSignInfo,
  PlanetKey,
  PlanetInfo,
  AspectType
} from '../engine/types';

export const ZODIAC_SIGNS: Record<ZodiacSignKey, ZodiacSignInfo> = {
  aries: {
    key: 'aries',
    name: '牡羊座',
    symbol: '♈',
    element: 'fire',
    elementName: '火象',
    modality: 'cardinal',
    modalityName: '本位星座',
    ruler: '火星',
    degreeStart: 0,
    degreeEnd: 30,
    color: '#ef4444',
  },
  taurus: {
    key: 'taurus',
    name: '金牛座',
    symbol: '♉',
    element: 'earth',
    elementName: '土象',
    modality: 'fixed',
    modalityName: '固定星座',
    ruler: '金星',
    degreeStart: 30,
    degreeEnd: 60,
    color: '#10b981',
  },
  gemini: {
    key: 'gemini',
    name: '雙子座',
    symbol: '♊',
    element: 'air',
    elementName: '風象',
    modality: 'mutable',
    modalityName: '變動星座',
    ruler: '水星',
    degreeStart: 60,
    degreeEnd: 90,
    color: '#06b6d4',
  },
  cancer: {
    key: 'cancer',
    name: '巨蟹座',
    symbol: '♋',
    element: 'water',
    elementName: '水象',
    modality: 'cardinal',
    modalityName: '本位星座',
    ruler: '月亮',
    degreeStart: 90,
    degreeEnd: 120,
    color: '#6366f1',
  },
  leo: {
    key: 'leo',
    name: '獅子座',
    symbol: '♌',
    element: 'fire',
    elementName: '火象',
    modality: 'fixed',
    modalityName: '固定星座',
    ruler: '太陽',
    degreeStart: 120,
    degreeEnd: 150,
    color: '#f59e0b',
  },
  virgo: {
    key: 'virgo',
    name: '處女座',
    symbol: '♍',
    element: 'earth',
    elementName: '土象',
    modality: 'mutable',
    modalityName: '變動星座',
    ruler: '水星',
    degreeStart: 150,
    degreeEnd: 180,
    color: '#059669',
  },
  libra: {
    key: 'libra',
    name: '天秤座',
    symbol: '♎',
    element: 'air',
    elementName: '風象',
    modality: 'cardinal',
    modalityName: '本位星座',
    ruler: '金星',
    degreeStart: 180,
    degreeEnd: 210,
    color: '#38bdf8',
  },
  scorpio: {
    key: 'scorpio',
    name: '天蠍座',
    symbol: '♏',
    element: 'water',
    elementName: '水象',
    modality: 'fixed',
    modalityName: '固定星座',
    ruler: '冥王星 / 火星',
    degreeStart: 210,
    degreeEnd: 240,
    color: '#8b5cf6',
  },
  sagittarius: {
    key: 'sagittarius',
    name: '射手座',
    symbol: '♐',
    element: 'fire',
    elementName: '火象',
    modality: 'mutable',
    modalityName: '變動星座',
    ruler: '木星',
    degreeStart: 240,
    degreeEnd: 270,
    color: '#ea580c',
  },
  capricorn: {
    key: 'capricorn',
    name: '摩羯座',
    symbol: '♑',
    element: 'earth',
    elementName: '土象',
    modality: 'cardinal',
    modalityName: '本位星座',
    ruler: '土星',
    degreeStart: 270,
    degreeEnd: 300,
    color: '#047857',
  },
  aquarius: {
    key: 'aquarius',
    name: '水瓶座',
    symbol: '♒',
    element: 'air',
    elementName: '風象',
    modality: 'fixed',
    modalityName: '固定星座',
    ruler: '天王星 / 土星',
    degreeStart: 300,
    degreeEnd: 330,
    color: '#0284c7',
  },
  pisces: {
    key: 'pisces',
    name: '雙魚座',
    symbol: '♓',
    element: 'water',
    elementName: '水象',
    modality: 'mutable',
    modalityName: '變動星座',
    ruler: '海王星 / 木星',
    degreeStart: 330,
    degreeEnd: 360,
    color: '#a855f7',
  },
};

export const ZODIAC_ORDER: ZodiacSignKey[] = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
];

export const PLANETS_META: Record<PlanetKey, PlanetInfo> = {
  sun: {
    key: 'sun',
    name: '太陽',
    symbol: '☉',
    category: 'luminary',
    color: '#fbbf24', // 金黃
  },
  moon: {
    key: 'moon',
    name: '月亮',
    symbol: '☽',
    category: 'luminary',
    color: '#e2e8f0', // 銀白
  },
  mercury: {
    key: 'mercury',
    name: '水星',
    symbol: '☿',
    category: 'personal',
    color: '#38bdf8', // 蔚藍
  },
  venus: {
    key: 'venus',
    name: '金星',
    symbol: '♀',
    category: 'personal',
    color: '#f472b6', // 粉紅
  },
  mars: {
    key: 'mars',
    name: '火星',
    symbol: '♂',
    category: 'personal',
    color: '#ef4444', // 火紅
  },
  jupiter: {
    key: 'jupiter',
    name: '木星',
    symbol: '♃',
    category: 'social',
    color: '#fb923c', // 橙紅
  },
  saturn: {
    key: 'saturn',
    name: '土星',
    symbol: '♄',
    category: 'social',
    color: '#eab308', // 穩重土褐黃
  },
  uranus: {
    key: 'uranus',
    name: '天王星',
    symbol: '♅',
    category: 'transpersonal',
    color: '#2dd4bf', // 青綠
  },
  neptune: {
    key: 'neptune',
    name: '海王星',
    symbol: '♆',
    category: 'transpersonal',
    color: '#60a5fa', // 海藍
  },
  pluto: {
    key: 'pluto',
    name: '冥王星',
    symbol: '♇',
    category: 'transpersonal',
    color: '#c084fc', // 紫芒
  },
  chiron: {
    key: 'chiron',
    name: '凱龍星',
    symbol: '⚷',
    category: 'point',
    color: '#a3e635', // 萊姆綠
  },
  northNode: {
    key: 'northNode',
    name: '北交點',
    symbol: '☊',
    category: 'point',
    color: '#facc15', // 金黃
  },
  lilith: {
    key: 'lilith',
    name: '莉莉絲',
    symbol: '⚸',
    category: 'point',
    color: '#f43f5e', // 玫瑰深紅
  },
};

export const ASPECT_CONFIG: Record<
  AspectType,
  {
    name: string;
    symbol: string;
    angle: number;
    defaultOrb: number;
    nature: 'harmonious' | 'challenging' | 'neutral';
    color: string;
  }
> = {
  conjunction: {
    name: '合相',
    symbol: '☌',
    angle: 0,
    defaultOrb: 8,
    nature: 'neutral',
    color: '#38bdf8', // 亮藍
  },
  sextile: {
    name: '六分相',
    symbol: '⚹',
    angle: 60,
    defaultOrb: 6,
    nature: 'harmonious',
    color: '#34d399', // 翠綠
  },
  square: {
    name: '四分相',
    symbol: '□',
    angle: 90,
    defaultOrb: 7,
    nature: 'challenging',
    color: '#f87171', // 鮮紅
  },
  trine: {
    name: '三分相',
    symbol: '△',
    angle: 120,
    defaultOrb: 8,
    nature: 'harmonious',
    color: '#60a5fa', // 柔藍
  },
  opposition: {
    name: '對分相',
    symbol: '☍',
    angle: 180,
    defaultOrb: 8,
    nature: 'challenging',
    color: '#fb923c', // 亮橘
  },
};

/**
 * 將 0-360 黃道度數轉換為星座詳細資訊
 */
export function degreeToSignDetail(longitude: number): {
  signKey: ZodiacSignKey;
  signName: string;
  signSymbol: string;
  degrees: number;
  minutes: number;
  seconds: number;
} {
  const norm = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const signKey = ZODIAC_ORDER[signIndex];
  const sign = ZODIAC_SIGNS[signKey];
  const totalDegreesInSign = norm - signIndex * 30;
  const deg = Math.floor(totalDegreesInSign);
  const minRemainder = (totalDegreesInSign - deg) * 60;
  const min = Math.floor(minRemainder);
  const sec = Math.floor((minRemainder - min) * 60);

  return {
    signKey,
    signName: sign.name,
    signSymbol: sign.symbol,
    degrees: deg,
    minutes: min,
    seconds: sec,
  };
}

/**
 * 格式化度數為易讀字串，如 15°24' ♏ 天蠍座
 */
export function formatDegreeString(longitude: number): string {
  const detail = degreeToSignDetail(longitude);
  const padMin = detail.minutes.toString().padStart(2, '0');
  return `${detail.signSymbol} ${detail.signName} ${detail.degrees}°${padMin}'`;
}
