import React, { useState, useEffect } from 'react';
import { BirthData, RelationshipType } from '../engine/types';
import { CITIES_DATABASE, DEFAULT_CITY } from '../data/cities';
import { Users, ArrowLeftRight, Heart, Sparkles, Briefcase, UserCheck, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DualBirthModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerA: BirthData;
  partnerB: BirthData;
  relationshipType: RelationshipType;
  onSave: (partnerA: BirthData, partnerB: BirthData, relType: RelationshipType) => void;
}

const STORAGE_KEY = 'astrology_saved_profiles_v1';

export const DualBirthModal: React.FC<DualBirthModalProps> = ({
  isOpen,
  onClose,
  partnerA,
  partnerB,
  relationshipType,
  onSave,
}) => {
  const { t } = useApp();
  const [dataA, setDataA] = useState<BirthData>(partnerA);
  const [dataB, setDataB] = useState<BirthData>(partnerB);
  const [relType, setRelType] = useState<RelationshipType>(relationshipType);
  const [savedProfiles, setSavedProfiles] = useState<BirthData[]>([]);

  useEffect(() => {
    setDataA(partnerA);
    setDataB(partnerB);
    setRelType(relationshipType);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedProfiles(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [isOpen, partnerA, partnerB, relationshipType]);

  if (!isOpen) return null;

  const handleSwap = () => {
    const temp = { ...dataA };
    setDataA({ ...dataB });
    setDataB(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(dataA, dataB, relType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl p-6 my-8 overflow-hidden transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t('synastrySettings')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 關係類型選擇 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {t('relationTypeTitle')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'romance', label: t('romance'), icon: Heart, desc: t('romanceDesc') },
                { id: 'friendship', label: t('friendship'), icon: Sparkles, desc: t('friendshipDesc') },
                { id: 'business', label: t('business'), icon: Briefcase, desc: t('businessDesc') },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = relType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRelType(item.id as RelationshipType)}
                    className={`p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/15 text-amber-900 dark:text-amber-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 兩人資料輸入區 */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                onClick={handleSwap}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-lg transition active:scale-90"
                title="互換兩人順序"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* 盤主 A */}
            <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-amber-300 dark:border-amber-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  {t('partnerAInner')}
                </span>
                {savedProfiles.length > 0 && (
                  <select
                    onChange={(e) => {
                      const found = savedProfiles.find((p) => p.name === e.target.value);
                      if (found) setDataA(found);
                    }}
                    className="text-[11px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-slate-700 dark:text-slate-300"
                  >
                    <option value="">{t('loadFromProfiles')}</option>
                    {savedProfiles.map((p) => (
                      <option key={p.id || p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">{t('nameOrNickname')}</label>
                <input
                  type="text"
                  value={dataA.name}
                  onChange={(e) => setDataA({ ...dataA, name: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">{t('yearUnit')}</label>
                  <input
                    type="number"
                    value={dataA.year}
                    onChange={(e) => setDataA({ ...dataA, year: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">{t('monthUnit')}</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={dataA.month}
                    onChange={(e) => setDataA({ ...dataA, month: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">{t('dayUnit')}</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dataA.day}
                    onChange={(e) => setDataA({ ...dataA, day: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">{t('birthTime')}</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={dataA.hour}
                      onChange={(e) => setDataA({ ...dataA, hour: Number(e.target.value) })}
                      className="w-1/2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={dataA.minute}
                      onChange={(e) => setDataA({ ...dataA, minute: Number(e.target.value) })}
                      className="w-1/2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">{t('birthLocation')}</label>
                  <select
                    value={dataA.cityName}
                    onChange={(e) => {
                      const city = CITIES_DATABASE.find((c) => c.name === e.target.value) || DEFAULT_CITY;
                      setDataA({
                        ...dataA,
                        cityName: city.name,
                        latitude: city.latitude,
                        longitude: city.longitude,
                        timezoneOffset: city.timezoneOffset,
                      });
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-slate-100"
                  >
                    {CITIES_DATABASE.slice(0, 16).map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 盤主 B */}
            <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-sky-300 dark:border-sky-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  {t('partnerBOuter')}
                </span>
                {savedProfiles.length > 0 && (
                  <select
                    onChange={(e) => {
                      const found = savedProfiles.find((p) => p.name === e.target.value);
                      if (found) setDataB(found);
                    }}
                    className="text-[11px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-slate-700 dark:text-slate-300"
                  >
                    <option value="">{t('loadFromProfiles')}</option>
                    {savedProfiles.map((p) => (
                      <option key={p.id || p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">{t('nameOrNickname')}</label>
                <input
                  type="text"
                  value={dataB.name}
                  onChange={(e) => setDataB({ ...dataB, name: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">{t('yearUnit')}</label>
                  <input
                    type="number"
                    value={dataB.year}
                    onChange={(e) => setDataB({ ...dataB, year: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">{t('monthUnit')}</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={dataB.month}
                    onChange={(e) => setDataB({ ...dataB, month: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">{t('dayUnit')}</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dataB.day}
                    onChange={(e) => setDataB({ ...dataB, day: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">{t('birthTime')}</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={dataB.hour}
                      onChange={(e) => setDataB({ ...dataB, hour: Number(e.target.value) })}
                      className="w-1/2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={dataB.minute}
                      onChange={(e) => setDataB({ ...dataB, minute: Number(e.target.value) })}
                      className="w-1/2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">{t('birthLocation')}</label>
                  <select
                    value={dataB.cityName}
                    onChange={(e) => {
                      const city = CITIES_DATABASE.find((c) => c.name === e.target.value) || DEFAULT_CITY;
                      setDataB({
                        ...dataB,
                        cityName: city.name,
                        latitude: city.latitude,
                        longitude: city.longitude,
                        timezoneOffset: city.timezoneOffset,
                      });
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-slate-100"
                  >
                    {CITIES_DATABASE.slice(0, 16).map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-md transition"
            >
              {t('calculateSynastry')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
