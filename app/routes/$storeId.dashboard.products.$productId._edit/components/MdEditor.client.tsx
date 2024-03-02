import { useRef } from "react";
import { Label } from "~/components/ui/label";
import useEditor from "~/hooks/useEditor";

export const MdEditor = () => {
  const editorEl = useRef<HTMLDivElement>();
  const editor = useEditor(editorEl);

  return (
    <div>
      <Label>Product Description</Label>
      <div
        ref={editorEl}
        id="editor"
        style={{
          height: 150,
          width: "100%",
        }}
      ></div>
    </div>
  );
};
