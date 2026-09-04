import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

type Point = { x: number; y: number };

type TrailStar = {
  id: number;
  x: number;
  y: number;
  size: number;
};

export function CosmicCursor() {
  const { theme } = useApp();
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
  const activatedRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroVisible(false), 1150);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const activate = (x: number, y: number) => {
      if (!activatedRef.current) {
        activatedRef.current = true;
        document.documentElement.classList.add('custom-cursor-active');
        target.current = { x, y };
        rendered.current = { x, y };
        lastTrailRef.current = { x, y };
      }
      setVisible(true);
    };

    const onPointerMove = (event: PointerEvent) => {
      // Touch screens keep their native touch behaviour. A real mouse/trackpad
      // immediately activates the custom cursor, including Safari on macOS.
      if (event.pointerType === 'touch') return;
      activate(event.clientX, event.clientY);
      target.current = { x: event.clientX, y: event.clientY };

      // Light mode must have zero intentional lag.
      if (theme === 'light' && cursorRef.current) {
        rendered.current = { x: event.clientX, y: event.clientY };
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };

    // Fallback for browsers/environments that do not report PointerEvent cleanly.
    const onMouseMove = (event: MouseEvent) => {
      activate(event.clientX, event.clientY);
      target.current = { x: event.clientX, y: event.clientY };
      if (theme === 'light' && cursorRef.current) {
        rendered.current = { x: event.clientX, y: event.clientY };
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => {
      if (activatedRef.current) setVisible(true);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [theme]);

  useEffect(() => {
    const animate = () => {
      if (theme === 'dark' && activatedRef.current) {
        // Deliberate inertial drag: visible but controlled, not sluggish.
        const ease = 0.105;
        rendered.current.x += (target.current.x - rendered.current.x) * ease;
        rendered.current.y += (target.current.y - rendered.current.y) * ease;

        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${rendered.current.x}px, ${rendered.current.y}px, 0)`;
        }

        const dx = rendered.current.x - lastTrailRef.current.x;
        const dy = rendered.current.y - lastTrailRef.current.y;
        if (visible && Math.hypot(dx, dy) > 10) {
          lastTrailRef.current = { ...rendered.current };
          const id = trailIdRef.current++;
          const nextStar: TrailStar = {
            id,
            x: rendered.current.x + (Math.random() - 0.5) * 7,
            y: rendered.current.y + (Math.random() - 0.5) * 7,
            size: 2.5 + Math.random() * 4.5,
          };
          setTrailStars((stars) => [...stars.slice(-9), nextStar]);
          window.setTimeout(() => {
            setTrailStars((stars) => stars.filter((star) => star.id !== id));
          }, 600);
        }
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [theme, visible]);

  useEffect(() => {
    setTrailStars([]);
    lastTrailRef.current = { ...rendered.current };
    if (theme === 'light' && cursorRef.current && activatedRef.current) {
      cursorRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
    }
  }, [theme]);

  return (
    <>
      {introVisible && (
        <div className={`cursor-intro-flash cursor-intro-flash--${theme}`} aria-hidden="true">
          <span className="cursor-intro-flare cursor-intro-flare--horizontal" />
          <span className="cursor-intro-flare cursor-intro-flare--vertical" />
          <span className="cursor-intro-flare cursor-intro-flare--diag-a" />
          <span className="cursor-intro-flare cursor-intro-flare--diag-b" />
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
            <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
              <path d="M24 1C26.1 15.3 29.2 19.2 47 24C29.2 28.8 26.1 32.7 24 47C21.9 32.7 18.8 28.8 1 24C18.8 19.2 21.9 15.3 24 1Z" />
              <circle cx="24" cy="24" r="2.6" />
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
