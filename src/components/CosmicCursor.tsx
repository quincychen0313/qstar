import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

type Point = { x: number; y: number };

type TrailStar = {
  id: number;
  x: number;
  y: number;
  size: number;
  life: number;
};

const supportsCustomCursor = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches;
};

export function CosmicCursor() {
  const { theme } = useApp();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [trailStars, setTrailStars] = useState<TrailStar[]>([]);

  const target = useRef<Point>({ x: -100, y: -100 });
  const rendered = useRef<Point>({ x: -100, y: -100 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTrailRef = useRef<Point>({ x: -100, y: -100 });
  const trailIdRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setEnabled(supportsCustomCursor());
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroVisible(false), 1050);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: MouseEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      if (!visible) {
        rendered.current = { x: event.clientX, y: event.clientY };
        setVisible(true);
      }

      if (theme === 'light' && cursorRef.current) {
        rendered.current = target.current;
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [enabled, theme, visible]);

  useEffect(() => {
    if (!enabled) return;

    const animate = () => {
      if (theme === 'dark') {
        // Intentional inertia: the star glides behind the pointer instead of snapping to it.
        const ease = 0.13;
        rendered.current.x += (target.current.x - rendered.current.x) * ease;
        rendered.current.y += (target.current.y - rendered.current.y) * ease;

        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${rendered.current.x}px, ${rendered.current.y}px, 0)`;
        }

        const dx = rendered.current.x - lastTrailRef.current.x;
        const dy = rendered.current.y - lastTrailRef.current.y;
        if (visible && Math.hypot(dx, dy) > 12) {
          lastTrailRef.current = { ...rendered.current };
          const id = trailIdRef.current++;
          const nextStar: TrailStar = {
            id,
            x: rendered.current.x + (Math.random() - 0.5) * 5,
            y: rendered.current.y + (Math.random() - 0.5) * 5,
            size: 2.5 + Math.random() * 3.5,
            life: 1,
          };
          setTrailStars((stars) => [...stars.slice(-7), nextStar]);
          window.setTimeout(() => {
            setTrailStars((stars) => stars.filter((star) => star.id !== id));
          }, 520);
        }
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, theme, visible]);

  useEffect(() => {
    setTrailStars([]);
    lastTrailRef.current = { ...rendered.current };
  }, [theme]);

  if (!enabled) return null;

  return (
    <>
      {introVisible && (
        <div className="cursor-intro-flash" aria-hidden="true">
          <span className="cursor-intro-flare cursor-intro-flare--horizontal" />
          <span className="cursor-intro-flare cursor-intro-flare--vertical" />
          <span className="cursor-intro-ring" />
          <span className="cursor-intro-core" />
        </div>
      )}

      {theme === 'dark' &&
        trailStars.map((star) => (
          <span
            key={star.id}
            className="cosmic-trail-star"
            style={{
              left: `${star.x}px`,
              top: `${star.y}px`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            aria-hidden="true"
          />
        ))}

      <div
        ref={cursorRef}
        className={`cosmic-cursor cosmic-cursor--${theme} ${visible ? 'is-visible' : ''} ${pressed ? 'is-pressed' : ''}`}
        aria-hidden="true"
      >
        {theme === 'dark' ? (
          <div className="cosmic-star-cursor">
            <span className="cosmic-star-glow" />
            <svg viewBox="0 0 40 40" focusable="false">
              <path d="M20 1.5C21.8 12.9 24.2 16.1 38.5 20C24.2 23.9 21.8 27.1 20 38.5C18.2 27.1 15.8 23.9 1.5 20C15.8 16.1 18.2 12.9 20 1.5Z" />
              <circle cx="20" cy="20" r="2.2" />
            </svg>
          </div>
        ) : (
          <div className="cosmic-sun-cursor">
            <span className="sun-ray ray-1" />
            <span className="sun-ray ray-2" />
            <span className="sun-ray ray-3" />
            <span className="sun-ray ray-4" />
            <span className="sun-core" />
          </div>
        )}
      </div>
    </>
  );
}
