import React from 'react';
import { ElementBalance, ModalityBalance } from '../engine/types';
import { Flame, Mountain, Wind, Droplets, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ElementBalanceBarProps {
  elementBalance: ElementBalance;
  modalityBalance: ModalityBalance;
}

export const ElementBalanceBar: React.FC<ElementBalanceBarProps> = ({
  elementBalance,
  modalityBalance,
}) => {
  const { t } = useApp();

  const elements = [
    {
      key: 'fire',
      name: t('fire'),
      sub: t('fireDesc'),
      color: '#ef4444',
      bgClass: 'bg-red-500',
      icon: Flame,
      data: elementBalance.fire,
    },
    {
      key: 'earth',
      name: t('earth'),
      sub: t('earthDesc'),
      color: '#10b981',
      bgClass: 'bg-emerald-500',
      icon: Mountain,
      data: elementBalance.earth,
    },
    {
      key: 'air',
      name: t('air'),
      sub: t('airDesc'),
      color: '#0ea5e9',
      bgClass: 'bg-sky-500',
      icon: Wind,
      data: elementBalance.air,
    },
    {
      key: 'water',
      name: t('water'),
      sub: t('waterDesc'),
      color: '#6366f1',
      bgClass: 'bg-indigo-500',
      icon: Droplets,
      data: elementBalance.water,
    },
  ];

  const modalities = [
    {
      key: 'cardinal',
      name: t('cardinal'),
      desc: t('cardinalDesc'),
      colorClass: 'bg-amber-500 dark:bg-amber-400',
      data: modalityBalance.cardinal,
    },
    {
      key: 'fixed',
      name: t('fixed'),
      desc: t('fixedDesc'),
      colorClass: 'bg-emerald-500 dark:bg-emerald-400',
      data: modalityBalance.fixed,
    },
    {
      key: 'mutable',
      name: t('mutable'),
      desc: t('mutableDesc'),
      colorClass: 'bg-sky-500 dark:bg-sky-400',
      data: modalityBalance.mutable,
    },
  ];

  return (
    <div className="bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md dark:shadow-xl backdrop-blur-xl space-y-6 transition-colors">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            {t('elementBalanceTitle')}
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {t('tenPlanetsStat')}
          </span>
        </div>

        {/* 總覽堆疊比例條 */}
        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden flex mb-4 border border-slate-200 dark:border-slate-800">
          {elements.map((el) => (
            <div
              key={el.key}
              style={{ width: `${el.data.percentage}%` }}
              className={`${el.bgClass} transition-all duration-500`}
              title={`${el.name}: ${el.data.percentage}%`}
            />
          ))}
        </div>

        {/* 四元素卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {elements.map((el) => {
            const Icon = el.icon;
            return (
              <div
                key={el.key}
                className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-4 h-4" style={{ color: el.color }} />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {el.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {el.data.percentage}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">{el.sub}</div>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400/90 truncate border-t border-slate-200 dark:border-slate-800 pt-1.5">
                  {el.data.planets.length > 0
                    ? el.data.planets.join('、')
                    : '無主要行星'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
          {t('modalityTitle')}
        </h4>

        <div className="space-y-2.5">
          {modalities.map((m) => (
            <div key={m.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">{m.name}</span>
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  {m.data.count} 星 · {m.data.percentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <div
                  className={`h-full ${m.colorClass} transition-all duration-500 rounded-full`}
                  style={{ width: `${m.data.percentage}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
