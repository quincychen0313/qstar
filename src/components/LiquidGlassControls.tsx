import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LiquidGlassControls: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, t } = useApp();

  return (
    <div className="flex items-center gap-2 select-none">
      {/* 1. 中英文 Liquid Glass 膠囊滑動切換器 */}
      <div
        className="relative flex items-center h-[38px] p-1 rounded-full bg-[#f4f2ed]/80 dark:bg-slate-900/70 border border-black/[0.08] dark:border-white/15 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300"
        style={{ width: '92px' }}
      >
        {/* 滑動膠囊黑色/白色實體指示塊 */}
        <div
          className={`absolute top-1 bottom-1 w-[40px] rounded-full bg-[#18181b] dark:bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
            language === 'zh' ? 'translate-x-0' : 'translate-x-[42px]'
          }`}
        />

        {/* 繁體中文按鈕 */}
        <button
          type="button"
          onClick={() => setLanguage('zh')}
          className={`relative z-10 w-1/2 h-full flex items-center justify-center text-xs font-semibold tracking-wide transition-colors duration-200 ${
            language === 'zh'
              ? 'text-white dark:text-slate-950 font-bold'
              : 'text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
          }`}
          title="切換為繁體中文"
        >
          中
        </button>

        {/* 英文按鈕 */}
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`relative z-10 w-1/2 h-full flex items-center justify-center text-xs font-semibold tracking-wide transition-colors duration-200 ${
            language === 'en'
              ? 'text-white dark:text-slate-950 font-bold'
              : 'text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
          }`}
          title="Switch to English"
        >
          EN
        </button>
      </div>

      {/* 2. 深淺色模式 Liquid Glass 圓形/膠囊切換按鈕 */}
      <button
        type="button"
        onClick={toggleTheme}
        title={theme === 'dark' ? t('lightMode') : t('darkMode')}
        className="w-[38px] h-[38px] rounded-full flex items-center justify-center bg-[#f4f2ed]/80 dark:bg-slate-900/70 hover:bg-[#eae8e3] dark:hover:bg-slate-800/80 border border-black/[0.08] dark:border-white/15 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)] backdrop-blur-md active:scale-95 transition-all duration-200 cursor-pointer"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 hover:rotate-45" strokeWidth={1.8} />
        ) : (
          <Moon className="w-4 h-4 text-[#18181b] transition-transform duration-300 hover:-rotate-12" strokeWidth={1.8} />
        )}
      </button>
    </div>
  );
};
