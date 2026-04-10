import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import styles from "./styles.module.css";

/* Copy to clipboard
[ http://whatever.com [x] ]

+5412312313 [x]

<CopyToClipboard content="alex@gmail.com\n+4123123\n...">
  <a href="mailto:">alex@gmail.com</a>
  <span>+42132131231</span>
</CopyToClipboard>

props:
 - content
*/

export function CopyToClipboard({
  content,
  children,
}: PropsWithChildren<{ content: string }>) {
  const [isCopying, setIsCopying] = useState(false);
  const timeoutIdRef = useRef<number>(undefined);

  const handleCopy = async () => {
    if (isCopying) return;
    setIsCopying(true);
    await navigator.clipboard.writeText(content);

    timeoutIdRef.current = setTimeout(() => {
      setIsCopying(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5ch",
        alignItems: "center",
      }}
    >
      {children}
      <button onClick={handleCopy} className={styles.button}>
        {isCopying ? <FaCheck /> : <FaRegCopy />}
      </button>
    </div>
  );
}
