import { useEffect, useRef } from "react";
import { Spring } from "./spring";
import styles from "./styles.module.css";

/* Motion+ Cursor defaults: magneticOptions { morph: true, padding: 5, snap: 0.8 } */
const SNAP = 0.8;
const PADDING = 5;
const FREE_SIZE = 40;
const ROTATION_SPEED = 90; /* deg per second, one turn per 4s */
const CENTER_SPRING = { stiffness: 600, damping: 50 };

const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

/**
 * Event-delegation target detection: one window listener, walk up from
 * whatever the pointer entered. Any link/button is magnetic automatically,
 * no wrapper component needed; [data-cursor] is the explicit opt-in.
 */
const findTarget = (el: Element): HTMLElement | null =>
  el.closest("[data-cursor], a, button:not(:disabled)");

export const MagneticMotionCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const pointer = { x: 0, y: 0, moved: false };
    let target: HTMLElement | null = null;
    let pressed = false;
    let hidden = false;

    const centerX = new Spring(0, CENTER_SPRING);
    const centerY = new Spring(0, CENTER_SPRING);
    const snap = new Spring(0, CENTER_SPRING);
    const width = new Spring(FREE_SIZE, CENTER_SPRING);
    const height = new Spring(FREE_SIZE, CENTER_SPRING);
    const scale = new Spring(0, CENTER_SPRING);
    const springs = [centerX, centerY, snap, width, height, scale];

    /* free rotation accumulates forever; on snap we hand off to a spring
       aimed at the NEXT full turn (the rotate(1440deg) trick) so the
       brackets settle axis-aligned instead of jerking back to 0 */
    let rotation = 0;
    const rotationSpring = new Spring(0, CENTER_SPRING);

    /* scale doubles as visibility (enter/exit) and the pressed effect */
    const updateScale = () => {
      scale.set(hidden || !pointer.moved ? 0 : pressed ? 0.9 : 1);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      /* don't show the cursor at 0,0 before the first real move */
      if (!pointer.moved) {
        pointer.moved = true;
        updateScale();
      }
    };

    const onPointerOver = (e: PointerEvent) => {
      const next = e.target instanceof Element ? findTarget(e.target) : null;
      if (next === target) return;
      const prev = target;
      target = next;

      if (target) {
        /* coming from free spin: stop at the next full turn, not at 0 */
        if (!prev) {
          rotationSpring.jump(rotation);
          rotationSpring.set(Math.ceil(rotation / 360) * 360);
        }
        const rect = target.getBoundingClientRect();
        /* arriving from free space: teleport the center to the element so
           the box doesn't fly in from wherever the last target was; moving
           directly between two targets: spring across */
        const arrivingFresh = snap.current === 0 && !snap.isAnimating;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        if (arrivingFresh) {
          centerX.jump(cx);
          centerY.jump(cy);
        } else {
          centerX.set(cx);
          centerY.set(cy);
        }
        snap.set(SNAP);
        width.set(rect.width + PADDING * 2);
        height.set(rect.height + PADDING * 2);
      } else {
        /* resume the free spin from wherever the stop-spring left off */
        rotation = rotationSpring.current;
        snap.set(0);
        width.set(FREE_SIZE);
        height.set(FREE_SIZE);
      }
    };

    const onPointerDown = () => {
      pressed = true;
      updateScale();
    };
    const onPointerUp = () => {
      pressed = false;
      updateScale();
    };
    const onLeaveWindow = () => {
      hidden = true;
      updateScale();
    };
    const onEnterWindow = () => {
      hidden = false;
      updateScale();
    };

    /* The render loop: springs advance, then ONE formula places the cursor.
       snap = 0   -> glued to the pointer
       snap = 0.8 -> 80% at the element center, 20% still following the hand
       Animating snap between the two produces the entry glide, the floaty
       hover-follow, and the exit glide — all from the same line. */
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      for (const s of springs) s.step(dt);

      const x = mix(pointer.x, centerX.current, snap.current);
      const y = mix(pointer.y, centerY.current, snap.current);

      let angle: number;
      if (target) {
        angle = rotationSpring.step(dt);
      } else {
        rotation += ROTATION_SPEED * dt;
        angle = rotation;
      }

      /* write styles directly — React never re-renders during movement */
      cursor.style.width = `${width.current}px`;
      cursor.style.height = `${height.current}px`;
      cursor.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${angle}deg) scale(${scale.current})`;
      /* the dot is the real cursor: raw pointer, no snap, no spring */
      dot.style.transform = `translate(-50%, -50%) translate3d(${pointer.x}px, ${pointer.y}px, 0) scale(${scale.current})`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerover", onPointerOver);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    document.documentElement.addEventListener("mouseenter", onEnterWindow);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.removeEventListener("mouseenter", onEnterWindow);
    };
  }, []);

  /* the reticule: 8 corner strips pinned to the box edges — they never
     transform themselves, the parent's resize/rotate carries them */
  return (
    <>
      <div ref={cursorRef} className={styles.cursor}>
        <div className={styles["corner-top-left-v"]}></div>
        <div className={styles["corner-top-left-h"]}></div>
        <div className={styles["corner-top-right-v"]}></div>
        <div className={styles["corner-top-right-h"]}></div>
        <div className={styles["corner-bot-left-v"]}></div>
        <div className={styles["corner-bot-left-h"]}></div>
        <div className={styles["corner-bot-right-v"]}></div>
        <div className={styles["corner-bot-right-h"]}></div>
      </div>
      <div ref={dotRef} className={styles.dot}></div>
    </>
  );
};

export const MagneticMotionDemo = () => {
  return (
    <>
      <MagneticMotionCursor />
      <div className={styles.grid}>
        <div className={styles.grid_row}>
          <button className={styles.grid_element}>About</button>
          <button className={styles.grid_element}>About</button>
          <button className={styles.grid_element}>About</button>
        </div>
        <div className={styles.grid_row}>
          <div className={styles.grid_element} data-cursor="pointer">
            Photos
          </div>
        </div>
      </div>
    </>
  );
};
