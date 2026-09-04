export interface CityInfo {
  name: string;
  region: string;
  latitude: number; // 北緯為正，南緯為負
  longitude: number; // 東經為正，西經為負
  timezoneOffset: number; // 與 UTC 的小時差
}

export const CITIES_DATABASE: CityInfo[] = [
  // 台灣主要縣市
  { name: '台北市', region: '台灣', latitude: 25.0330, longitude: 121.5654, timezoneOffset: 8 },
  { name: '新北市', region: '台灣', latitude: 25.0124, longitude: 121.4657, timezoneOffset: 8 },
  { name: '桃園市', region: '台灣', latitude: 24.9936, longitude: 121.3010, timezoneOffset: 8 },
  { name: '台中市', region: '台灣', latitude: 24.1477, longitude: 120.6736, timezoneOffset: 8 },
  { name: '台南市', region: '台灣', latitude: 22.9997, longitude: 120.2270, timezoneOffset: 8 },
  { name: '高雄市', region: '台灣', latitude: 22.6273, longitude: 120.3014, timezoneOffset: 8 },
  { name: '新竹市', region: '台灣', latitude: 24.8138, longitude: 120.9675, timezoneOffset: 8 },
  { name: '基隆市', region: '台灣', latitude: 25.1276, longitude: 121.7392, timezoneOffset: 8 },
  { name: '嘉義市', region: '台灣', latitude: 23.4801, longitude: 120.4491, timezoneOffset: 8 },
  { name: '彰化縣', region: '台灣', latitude: 24.0816, longitude: 120.5385, timezoneOffset: 8 },
  { name: '屏東縣', region: '台灣', latitude: 22.6761, longitude: 120.4941, timezoneOffset: 8 },
  { name: '宜蘭縣', region: '台灣', latitude: 24.7021, longitude: 121.7378, timezoneOffset: 8 },
  { name: '花蓮縣', region: '台灣', latitude: 23.9872, longitude: 121.6016, timezoneOffset: 8 },
  { name: '台東縣', region: '台灣', latitude: 22.7583, longitude: 121.1444, timezoneOffset: 8 },
  { name: '澎湖縣', region: '台灣', latitude: 23.5712, longitude: 119.5793, timezoneOffset: 8 },
  { name: '金門縣', region: '台灣', latitude: 24.4493, longitude: 118.3766, timezoneOffset: 8 },

  // 亞洲其他主要城市
  { name: '香港', region: '亞洲', latitude: 22.3193, longitude: 114.1694, timezoneOffset: 8 },
  { name: '澳門', region: '亞洲', latitude: 22.1987, longitude: 113.5439, timezoneOffset: 8 },
  { name: '東京', region: '日本', latitude: 35.6762, longitude: 139.6503, timezoneOffset: 9 },
  { name: '大阪', region: '日本', latitude: 34.6937, longitude: 135.5023, timezoneOffset: 9 },
  { name: '首爾', region: '韓國', latitude: 37.5665, longitude: 126.9780, timezoneOffset: 9 },
  { name: '新加坡', region: '東南亞', latitude: 1.3521, longitude: 103.8198, timezoneOffset: 8 },
  { name: '吉隆坡', region: '馬來西亞', latitude: 3.1390, longitude: 101.6869, timezoneOffset: 8 },
  { name: '曼谷', region: '泰國', latitude: 13.7563, longitude: 100.5018, timezoneOffset: 7 },
  { name: '上海', region: '中國', latitude: 31.2304, longitude: 121.4737, timezoneOffset: 8 },
  { name: '北京', region: '中國', latitude: 39.9042, longitude: 116.4074, timezoneOffset: 8 },
  { name: '廣州', region: '中國', latitude: 23.1291, longitude: 113.2644, timezoneOffset: 8 },

  // 歐美與大洋洲城市
  { name: '倫敦', region: '歐洲', latitude: 51.5074, longitude: -0.1278, timezoneOffset: 0 },
  { name: '巴黎', region: '歐洲', latitude: 48.8566, longitude: 2.3522, timezoneOffset: 1 },
  { name: '柏林', region: '歐洲', latitude: 52.5200, longitude: 13.4050, timezoneOffset: 1 },
  { name: '羅馬', region: '歐洲', latitude: 41.9028, longitude: 12.4964, timezoneOffset: 1 },
  { name: '紐約', region: '北美', latitude: 40.7128, longitude: -74.0060, timezoneOffset: -5 },
  { name: '洛杉磯', region: '北美', latitude: 34.0522, longitude: -118.2437, timezoneOffset: -8 },
  { name: '舊金山', region: '北美', latitude: 37.7749, longitude: -122.4194, timezoneOffset: -8 },
  { name: '西雅圖', region: '北美', latitude: 47.6062, longitude: -122.3321, timezoneOffset: -8 },
  { name: '溫哥華', region: '北美', latitude: 49.2827, longitude: -123.1207, timezoneOffset: -8 },
  { name: '多倫多', region: '北美', latitude: 43.6532, longitude: -79.3832, timezoneOffset: -5 },
  { name: '雪梨', region: '澳洲', latitude: -33.8688, longitude: 151.2093, timezoneOffset: 10 },
  { name: '墨爾本', region: '澳洲', latitude: -37.8136, longitude: 144.9631, timezoneOffset: 10 },
  { name: '奧克蘭', region: '紐西蘭', latitude: -36.8485, longitude: 174.7633, timezoneOffset: 12 },
];

export const DEFAULT_CITY = CITIES_DATABASE[0]; // 台北市
