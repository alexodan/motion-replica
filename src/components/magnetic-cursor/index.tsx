import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import styles from "./styles.module.css";

export type MagneticContextType = {
  target?: React.ReactElement;
  setTarget: (t: React.ReactElement | undefined) => void;
};

const MagneticContext = createContext<MagneticContextType>({
  target: undefined,
  setTarget: () => {},
});

export const MagneticContextProvider = ({ children }: PropsWithChildren) => {
  const [target, setTarget] = useState<React.ReactElement | undefined>(
    undefined,
  );
  return (
    <MagneticContext.Provider value={{ target, setTarget }}>
      <MagneticCursor />
      {children}
    </MagneticContext.Provider>
  );
};

export const MagneticCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const { x, y } = pos;

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientY, y: e.clientX });
    };
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <div
      className={styles.cursor}
      style={{
        top: `${x}px`,
        left: `${y}px`,
      }}
    >
      <div className={styles["cursor-edges"]}>
        <div className={styles["edge-top-left-1"]}></div>
        <div className={styles["edge-top-left-2"]}></div>
        <div className={styles["edge-top-right-1"]}></div>
        <div className={styles["edge-top-right-2"]}></div>
        <div className={styles["edge-bot-right-1"]}></div>
        <div className={styles["edge-bot-right-2"]}></div>
        <div className={styles["edge-bot-left-1"]}></div>
        <div className={styles["edge-bot-left-2"]}></div>
      </div>
      <div className={styles["cursor-dot"]}></div>
    </div>
  );
};

export const MagneticCursorDemo = () => {
  return (
    <MagneticContextProvider>
      <div className={styles.grid}>
        <div className={styles.grid_row}>
          <div className={styles.grid_element}>About</div>
          <div className={styles.grid_element}>About</div>
          <div className={styles.grid_element}>About</div>
        </div>
        <div className={styles.grid_row}>
          <div className={styles.grid_element}>Photos</div>
        </div>
      </div>
    </MagneticContextProvider>
  );
};
