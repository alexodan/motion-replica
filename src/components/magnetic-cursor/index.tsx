import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import styles from "./styles.module.css";

export type MagneticContextType = {
  target?: HTMLElement;
  setTarget: (t: HTMLElement | undefined) => void;
};

const MagneticContext = createContext<MagneticContextType>({
  target: undefined,
  setTarget: () => {},
});

export const MagneticContextProvider = ({ children }: PropsWithChildren) => {
  const [target, setTarget] = useState<HTMLElement | undefined>(undefined);
  return (
    <MagneticContext.Provider value={{ target, setTarget }}>
      <MagneticCursor />
      {children}
    </MagneticContext.Provider>
  );
};

export const MagneticTarget = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  const { setTarget } = useContext(MagneticContext);
  return (
    <div
      className={className}
      onMouseEnter={(e) => setTarget(e.currentTarget)}
      onMouseLeave={() => setTarget(undefined)}
    >
      {children}
    </div>
  );
};

/* how much the expanded box drifts toward the mouse (0 = static, 1 = glued) */
const FOLLOW_FACTOR = 0.1;
const EDGES_SIZE = 42;
const EXPAND_PADDING = 12;

export const MagneticCursor = () => {
  const { target } = useContext(MagneticContext);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const { x, y } = pos;

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  let edgesStyle: React.CSSProperties = {
    top: `${y}px`,
    left: `${x}px`,
    width: `${EDGES_SIZE}px`,
    height: `${EDGES_SIZE}px`,
  };

  if (target) {
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    /* top/left stay pinned to the element center (only animate on entry);
       the damped mouse-follow lives in the transform so it updates instantly */
    edgesStyle = {
      top: `${centerY}px`,
      left: `${centerX}px`,
      width: `${rect.width + EXPAND_PADDING}px`,
      height: `${rect.height + EXPAND_PADDING}px`,
      transform: `translate(calc(-50% + ${(x - centerX) * FOLLOW_FACTOR}px), calc(-50% + ${(y - centerY) * FOLLOW_FACTOR}px))`,
    };
  }

  return (
    <>
      <div
        className={`${styles["cursor-edges"]} ${
          target ? styles["cursor-edges-expanded"] : ""
        }`}
        style={edgesStyle}
      >
        <div className={styles["edge-top-left-1"]}></div>
        <div className={styles["edge-top-left-2"]}></div>
        <div className={styles["edge-top-right-1"]}></div>
        <div className={styles["edge-top-right-2"]}></div>
        <div className={styles["edge-bot-right-1"]}></div>
        <div className={styles["edge-bot-right-2"]}></div>
        <div className={styles["edge-bot-left-1"]}></div>
        <div className={styles["edge-bot-left-2"]}></div>
      </div>
      <div
        className={styles["cursor-dot"]}
        style={{
          top: `${y}px`,
          left: `${x}px`,
        }}
      ></div>
    </>
  );
};

export const MagneticCursorDemo = () => {
  return (
    <MagneticContextProvider>
      <div className={styles.grid}>
        <div className={styles.grid_row}>
          <MagneticTarget className={styles.grid_element}>
            About
          </MagneticTarget>
          <MagneticTarget className={styles.grid_element}>
            About
          </MagneticTarget>
          <MagneticTarget className={styles.grid_element}>
            About
          </MagneticTarget>
        </div>
        <div className={styles.grid_row}>
          <MagneticTarget className={styles.grid_element}>
            Photos
          </MagneticTarget>
        </div>
      </div>
    </MagneticContextProvider>
  );
};
