import React, { useState, useEffect } from 'react';
import { BirthData } from '../engine/types';
import { Users, Trash2, Plus, X, Check, Calendar, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SavedProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: BirthData;
  onSelectProfile: (data: BirthData) => void;
}

const STORAGE_KEY = 'astrology_saved_profiles_v1';

export const SavedProfilesModal: React.FC<SavedProfilesModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onSelectProfile,
}) => {
  const { t } = useApp();
  const [profiles, setProfiles] = useState<BirthData[]>([]);
  const [isSavedCurrent, setIsSavedCurrent] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfiles(parsed);
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveCurrentProfile = () => {
    const newProfile: BirthData = {
      ...currentData,
      id: Date.now().toString(),
    };
    const updated = [newProfile, ...profiles.filter((p) => p.name !== newProfile.name)];
    setProfiles(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setIsSavedCurrent(true);
    setTimeout(() => setIsSavedCurrent(false), 2000);
  };

  const deleteProfile = (id?: string) => {
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 overflow-hidden transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t('manageProfiles')}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 快速儲存當前星盤 */}
        <div className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t('saveCurrent', { name: currentData.name })}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {currentData.year}/{currentData.month}/{currentData.day} · {currentData.cityName}
            </div>
          </div>
          <button
            onClick={saveCurrentProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition"
          >
            {isSavedCurrent ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                {t('savedBadge')}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-slate-950" />
                {t('saveToList')}
              </>
            )}
          </button>
        </div>

        {/* 檔案列表 */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {profiles.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              {t('emptyProfiles')}
            </div>
          ) : (
            profiles.map((item) => (
              <div
                key={item.id || item.name}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div
                  onClick={() => {
                    onSelectProfile(item);
                    onClose();
                  }}
                  className="cursor-pointer flex-1"
                >
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-300 transition">
                    {item.name}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                      {item.year}/{item.month}/{item.day}{' '}
                      {item.isUnknownTime ? '(時間不詳)' : `${item.hour}:${item.minute.toString().padStart(2, '0')}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                      {item.cityName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteProfile(item.id)}
                  title="刪除"
                  className="p-2 text-slate-400 hover:text-rose-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
          >
            {t('closeModal')}
          </button>
        </div>
      </div>
    </div>
  );
};
