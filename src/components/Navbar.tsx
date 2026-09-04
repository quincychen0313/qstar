import React from 'react';
import { Sparkles, Users, Edit3, Printer, Heart, User } from 'lucide-react';
import { BirthData, ChartAppMode } from '../engine/types';
import { useApp } from '../context/AppContext';
import { LiquidGlassControls } from './LiquidGlassControls';

interface NavbarProps {
  currentMode: ChartAppMode;
  onModeChange: (mode: ChartAppMode) => void;
  partnerA: BirthData;
  partnerB: BirthData;
  onOpenForm: () => void;
  onOpenDualModal: () => void;
  onOpenSavedProfiles: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onModeChange,
  partnerA,
  partnerB,
  onOpenForm,
  onOpenDualModal,
  onOpenSavedProfiles,
}) => {
  const { t } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* 左側：品牌與三大模式切換標籤 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-sky-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-serif">
                {t('appTitle')}{' '}
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-sans font-normal border border-amber-500/40 px-1.5 py-0.2 rounded">
                  ASTROLAB
                </span>
              </h1>
            </div>
          </div>

          {/* 模式切換鈕 */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => onModeChange('natal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                currentMode === 'natal'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('natalChart')}</span>
            </button>

            <button
              onClick={() => onModeChange('synastry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                currentMode === 'synastry'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{t('synastryChart')}</span>
            </button>

            <button
              onClick={() => onModeChange('composite')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                currentMode === 'composite'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t('compositeChart')}</span>
            </button>
          </div>
        </div>

        {/* 右側：盤主狀態、排盤動作與設定切換 */}
        <div className="flex items-center justify-end gap-2 sm:gap-2.5">
          {/* 當前盤主資訊 */}
          {currentMode === 'natal' ? (
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>
                {t('currentSubject')}：
                <strong className="text-amber-600 dark:text-amber-300">{partnerA.name}</strong>
              </span>
            </div>
          ) : (
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400 animate-pulse" />
              <span>
                {t('synastrySubjects')}：
                <strong className="text-amber-600 dark:text-amber-300">{partnerA.name}</strong> ×{' '}
                <strong className="text-sky-600 dark:text-sky-300">{partnerB.name}</strong>
              </span>
            </div>
          )}

          {/* 重新設定對象 */}
          {currentMode === 'natal' ? (
            <button
              onClick={onOpenForm}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition shadow-sm active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('newChart')}</span>
            </button>
          ) : (
            <button
              onClick={onOpenDualModal}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition shadow-sm active:scale-95"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t('changePartners')}</span>
            </button>
          )}

          <button
            onClick={onOpenSavedProfiles}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
          >
            <Users className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline">{t('profileLibrary')}</span>
          </button>

          {/* 🌟 Liquid Glass 膠囊切換按鈕組 (中/EN 膠囊滑動 + ☾ 圓形切換) */}
          <LiquidGlassControls />

          {/* 列印按鈕 */}
          <button
            onClick={handlePrint}
            title={t('print')}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition hidden sm:flex items-center justify-center"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
