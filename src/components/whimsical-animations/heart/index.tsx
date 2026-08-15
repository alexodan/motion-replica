import { useState } from "react";
import { css } from "styled-system/css";

const particleCss = css({
  width: 15,
  height: 15,
  background: "white",
  position: "absolute",
  borderRadius: "100%",
});

const PARTICLES = Array.from({ length: 10 }, (_, id) => ({
  id,
  x: randomIntBetween(-60, 60),
  y: randomIntBetween(-60, 60),
  duration: randomIntBetween(800, 1500),
}));

function randomIntBetween(a: number, b: number) {
  return a + Math.floor(Math.random() * (b - a + 1));
}

export function Heart() {
  const [isLiked, setIsLiked] = useState(false);

  const toggleState = () => {
    setIsLiked((p) => !p);
  };

  return (
    <button
      onClick={toggleState}
      style={{
        position: "relative",
        background: "none",
        outline: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      {PARTICLES.map((particle) => (
        <div
          key={particle.id}
          className={particleCss}
          style={{
            top: "calc(50% - 7.5px)",
            left: "calc(50% - 7.5px)",
            opacity: isLiked ? 1 : 0,

            transform: isLiked
              ? `translate(${particle.x}px, ${particle.y}px)`
              : "translate(0, 0)",

            transition: `transform 0.5s ease-in-out`,
            animation: isLiked
              ? `fadeOut ${particle.duration}ms ease-out forwards`
              : "none",
          }}
        />
      ))}
      <svg
        className={css({
          fill: isLiked ? "red" : "",
        })}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M3.68546 6.43796C8.61936 2.29159 11.8685 8.4309 12.0406 8.4309C12.2126 8.43091 15.4617 2.29159 20.3956 6.43796C26.8941 11.8991 13.5 22.8215 12.0406 22.8215C10.5811 22.8215 -2.81297 11.8991 3.68546 6.43796Z"
          className={css({ stroke: "red" })}
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <span className="visually-hidden">Like this post</span>
    </button>
  );
}

const container = css({
  minHeight: "100vh",
  width: "100%",
});

export function ExplodingHeartDemo() {
  return (
    <div className={container}>
      <Heart />
    </div>
  );
}
