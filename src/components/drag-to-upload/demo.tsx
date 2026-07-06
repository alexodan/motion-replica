import { css } from "styled-system/css";
import screenshot from "./screenshot.png";
import { DraggableUpload } from "./draggable-upload";

const header = css({
  fontSize: "xl",
  mb: 2,
});

const legend = css({
  m: 1,
});

const layout = css({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  border: "1px solid red",
  textAlign: "left",
});

const wrapper = css({
  backgroundColor: "#111",
  padding: "12px 20px",
});

const image = css({
  w: "full",
});

export function DragToUploadDemo() {
  return (
    <main className={layout}>
      <section className={wrapper}>
        <h2 className={header}>Upload files</h2>
        <p className={legend}>Add your document by dragging it here</p>
        <DraggableUpload />
        <form>
          <label>File name</label>
          <br />
          <input required />
        </form>
      </section>
      <section>
        <img src={screenshot} alt="Reference design" className={image} />
      </section>
    </main>
  );
}
