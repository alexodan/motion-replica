import { CopyToClipboard } from ".";

// Inspiration
// https://www.shadcn.io/button/copy
export function CopyToClipboardDemo() {
  return (
    <CopyToClipboard content="Hello world!">
      {/* <h2 style={{ fontSize: "40px" }}>User information</h2> */}
      <span>Hello World!</span>
      {/* <span style={{ fontSize: "30px" }}>alex@gmail.com</span> */}
    </CopyToClipboard>
  );
}
