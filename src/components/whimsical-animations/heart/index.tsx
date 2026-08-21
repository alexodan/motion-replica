import { useState } from "react";
import { createParticles, deriveFromChaos } from "./utils";
import styles from "./styles.module.css";

export function ExplodingHeartDemo() {
  return (
    <div className={styles.container}>
      <Heart />
    </div>
  );
}

export function Heart() {
  const [isLiked, setIsLiked] = useState(false);
  const [chaos, setChaos] = useState(50);

  const handleClick = () => setIsLiked((v) => !v);

  return (
    <>
      <button
        className={styles.heartBtn}
        onClick={handleClick}
        data-is-liked={isLiked}
      >
        <svg
          className={styles.heartImg}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M3.68546 6.43796C8.61936 2.29159 11.8685 8.4309 12.0406 8.4309C12.2126 8.43091 15.4617 2.29159 20.3956 6.43796C26.8941 11.8991 13.5 22.8215 12.0406 22.8215C10.5811 22.8215 -2.81297 11.8991 3.68546 6.43796Z"
            stroke="red"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {isLiked &&
          createParticles({
            quantity: deriveFromChaos("quantity", chaos),
          }).map((p) => {
            return (
              <div
                key={p.id}
                className={styles.particle}
                style={
                  {
                    backgroundColor: p.color,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    "--move-x": `${p.moveX}px`,
                    "--move-y": `${p.moveY}px`,
                  } as React.CSSProperties
                }
              />
            );
          })}
      </button>
      <div>
        <p>Chaos: {chaos}%</p>
        <input
          type="range"
          value={chaos}
          onChange={(e) => setChaos(+e.target.value)}
        />
      </div>
    </>
  );
}
