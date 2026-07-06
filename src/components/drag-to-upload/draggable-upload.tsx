import { css } from "styled-system/css";
import { FaClipboard, FaFile } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const layout = css({
  width: "100%",
  backgroundColor: "#333",
  height: "140px",
  borderRadius: "12px",
  display: "flex",
  flexDir: "column",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",
  my: 4,
});

const MAX_SIZE = 10 * 1024 * 1024;

export function DraggableUpload() {
  const [file, setFile] = useState<File | null>(null);
  const draggableSpace = useRef<HTMLDivElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("dragged:", e);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("dropped:", e);
    const file = e.dataTransfer.files[0];
    if (file.size > MAX_SIZE) {
      throw Error("File too big. Should be less than 10MB");
    }
    setFile(file);
  };

  return (
    <div
      className={layout}
      ref={draggableSpace}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {file ? (
        <>
          <FaFile />
          <span>File selected</span>
        </>
      ) : (
        <>
          <span>
            <FaClipboard />
          </span>
          <span>Choose a file</span>
        </>
      )}
    </div>
  );
}
