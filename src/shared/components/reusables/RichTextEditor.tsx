import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

interface RichTextEditorProps {
  title?: string;
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number | string;
  className?: string;
  disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  title,
  value,
  onChange,
  placeholder = "Start typing...",
  height = 400,
  className = "",
  disabled = false,
}) => {
  const editorRef = useRef(null);

  const config = useMemo(
    () => ({
      readonly: disabled,
      placeholder: placeholder,
      height: height,
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "align",
        "|",
        "link",
        "|",
        "undo",
        "redo",
      ],
      buttonsMD: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "align",
        "|",
        "link",
        "|",
        "undo",
        "redo",
      ],
      buttonsSM: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "align",
        "|",
        "link",
        "|",
        "undo",
        "redo",
      ],
    }),
    [disabled, placeholder, height]
  );

  console.log(disabled);

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}

      <JoditEditor
        ref={editorRef}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
      />
    </div>
  );
};
