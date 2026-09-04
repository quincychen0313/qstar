import React, { useState } from 'react';
import { BirthData, HouseSystemType } from '../engine/types';
import { CITIES_DATABASE, DEFAULT_CITY, CityInfo } from '../data/cities';
import { Sparkles, MapPin, Calendar, Clock, User, Compass, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BirthFormProps {
  initialData?: BirthData;
  onSubmit: (data: BirthData) => void;
  isLoading?: boolean;
}

export const BirthForm: React.FC<BirthFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useApp();
  const [name, setName] = useState(initialData?.name || '我的星盤');
  const [year, setYear] = useState(initialData?.year || 1996);
  const [month, setMonth] = useState(initialData?.month || 10);
  const [day, setDay] = useState(initialData?.day || 24);
  const [hour, setHour] = useState(initialData?.hour ?? 14);
  const [minute, setMinute] = useState(initialData?.minute ?? 30);
  const [isUnknownTime, setIsUnknownTime] = useState(
    initialData?.isUnknownTime || false
  );

  const [selectedCity, setSelectedCity] = useState<CityInfo>(
    CITIES_DATABASE.find((c) => c.name === initialData?.cityName) || DEFAULT_CITY
  );
  const [customLocation, setCustomLocation] = useState(false);
  const [customLat, setCustomLat] = useState(initialData?.latitude || 25.033);
  const [customLng, setCustomLng] = useState(initialData?.longitude || 121.5654);
  const [customTz, setCustomTz] = useState(initialData?.timezoneOffset || 8);

  const [houseSystem, setHouseSystem] = useState<HouseSystemType>(
    initialData?.houseSystem || 'placidus'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: BirthData = {
      name: name.trim() || '未命名星盤',
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: isUnknownTime ? 12 : Number(hour),
      minute: isUnknownTime ? 0 : Number(minute),
      isUnknownTime,
      cityName: customLocation ? '自訂坐標' : selectedCity.name,
      latitude: customLocation ? Number(customLat) : selectedCity.latitude,
      longitude: customLocation ? Number(customLng) : selectedCity.longitude,
      timezoneOffset: customLocation
        ? Number(customTz)
        : selectedCity.timezoneOffset,
      houseSystem,
    };
    onSubmit(data);
  };

  const loadSample = (sampleType: 'scorpio' | 'gemini' | 'pisces') => {
    if (sampleType === 'scorpio') {
      setName('範例：天蠍太陽 (台北)');
      setYear(1995);
      setMonth(10);
      setDay(24);
      setHour(14);
      setMinute(30);
      setIsUnknownTime(false);
      setSelectedCity(DEFAULT_CITY);
    } else if (sampleType === 'gemini') {
      setName('範例：雙子太陽 (東京)');
      setYear(1998);
      setMonth(6);
      setDay(8);
      setHour(9);
      setMinute(15);
      setIsUnknownTime(false);
      const tokyo = CITIES_DATABASE.find((c) => c.name === '東京') || DEFAULT_CITY;
      setSelectedCity(tokyo);
    } else {
      setName('範例：雙魚太陽 (紐約)');
      setYear(2000);
      setMonth(3);
      setDay(12);
      setHour(20);
      setMinute(45);
      setIsUnknownTime(false);
      const ny = CITIES_DATABASE.find((c) => c.name === '紐約') || DEFAULT_CITY;
      setSelectedCity(ny);
    }
  };

  return (
    <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-2xl p-5 sm:p-7 shadow-2xl transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400 animate-pulse" />
            {t('formTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('formSubtitle')}
          </p>
        </div>

        {/* 快速載入範例 */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">{t('loadSample')}</span>
          <button
            type="button"
            onClick={() => loadSample('scorpio')}
            className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700 transition"
          >
            {t('scorpioSample')}
          </button>
          <button
            type="button"
            onClick={() => loadSample('gemini')}
            className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 transition"
          >
            {t('geminiSample')}
          </button>
          <button
            type="button"
            onClick={() => loadSample('pisces')}
            className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-slate-700 transition"
          >
            {t('piscesSample')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 姓名 / 稱謂 */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <User className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            {t('nameOrNickname')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder')}
            className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
            required
          />
        </div>

        {/* 出生日期與時間 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              {t('birthDate')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min="1800"
                max="2100"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-sm text-center text-slate-900 dark:text-slate-100 focus:outline-none"
                required
              />
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-700 focus:border-amber-400 rounded-xl px-2 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m} {t('monthUnit')}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                max="31"
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-sm text-center text-slate-900 dark:text-slate-100 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                {t('birthTime')}
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isUnknownTime}
                  onChange={(e) => setIsUnknownTime(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-0 bg-slate-50 dark:bg-slate-950"
                />
                {t('unknownTime')}
              </label>
            </div>

            {isUnknownTime ? (
              <div className="bg-amber-50 dark:bg-slate-950/40 border border-dashed border-amber-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-800 dark:text-amber-300/90 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-500 dark:text-amber-400" />
                <span>{t('unknownTimeNotice')}</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-700 focus-within:border-amber-400 rounded-xl px-3 py-1">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={hour}
                    onChange={(e) => setHour(Number(e.target.value))}
                    className="w-full bg-transparent py-1.5 text-sm text-center text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{t('hourUnit')}</span>
                </div>
                <div className="flex items-center bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-700 focus-within:border-amber-400 rounded-xl px-3 py-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minute}
                    onChange={(e) => setMinute(Number(e.target.value))}
                    className="w-full bg-transparent py-1.5 text-sm text-center text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{t('minuteUnit')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 出生地點 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              {t('birthLocation')}
            </label>
            <button
              type="button"
              onClick={() => setCustomLocation(!customLocation)}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
            >
              {customLocation ? t('commonCities') : t('customCoords')}
            </button>
          </div>

          {!customLocation ? (
            <select
              value={selectedCity.name}
              onChange={(e) => {
                const found = CITIES_DATABASE.find((c) => c.name === e.target.value);
                if (found) setSelectedCity(found);
              }}
              className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <optgroup label="台灣各縣市">
                {CITIES_DATABASE.filter((c) => c.region === '台灣').map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name} (UTC+8)
                  </option>
                ))}
              </optgroup>
              <optgroup label="全球主要城市">
                {CITIES_DATABASE.filter((c) => c.region !== '台灣').map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name} ({city.region}, UTC{city.timezoneOffset >= 0 ? `+${city.timezoneOffset}` : city.timezoneOffset})
                  </option>
                ))}
              </optgroup>
            </select>
          ) : (
            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">{t('latitude')}</label>
                <input
                  type="number"
                  step="0.0001"
                  value={customLat}
                  onChange={(e) => setCustomLat(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">{t('longitude')}</label>
                <input
                  type="number"
                  step="0.0001"
                  value={customLng}
                  onChange={(e) => setCustomLng(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">{t('timezone')}</label>
                <input
                  type="number"
                  step="0.5"
                  value={customTz}
                  onChange={(e) => setCustomTz(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* 宮位制選擇 */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            {t('houseSystem')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'placidus', label: t('placidus'), desc: t('placidusDesc') },
              { id: 'whole-sign', label: t('wholeSign'), desc: t('wholeSignDesc') },
              { id: 'equal', label: t('equal'), desc: t('equalDesc') },
            ].map((sys) => (
              <button
                key={sys.id}
                type="button"
                onClick={() => setHouseSystem(sys.id as HouseSystemType)}
                className={`text-left p-2.5 rounded-xl border transition ${
                  houseSystem === sys.id
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-200'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{sys.label}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{sys.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 提交按鈕 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 text-slate-950" />
          {isLoading ? '計算中...' : t('calculateButton')}
        </button>
      </form>
    </div>
  );
};
