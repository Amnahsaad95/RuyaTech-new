"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import './quillCustom.css'; // تأكد أن الملف موجود فعلاً
import { useTranslations, useLocale } from "next-intl";

// Import dynamically to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

type Direction = "ltr" | "rtl";

interface ReactEditorProps {
  value?: string;
  onChange: (value: string) => void;
  direction?: Direction | "auto";
}

const ReactEditor: React.FC<ReactEditorProps> = ({
  value,
  onChange,
  direction = "auto"
}) => {
  const t = useTranslations("admin");
  const locale = useLocale();
  const resolvedDirection =  (locale === "ar" ? "rtl" : "ltr") ;

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ size: ["small", false, "large", "huge"] }],
      ["link", "image", "video"],
      ["clean"],
      [{ direction: "rtl" }],
    ],
    clipboard: { matchVisual: false },
  };

  const formats = [
    "header", "font", "bold", "color", "background", "italic", "underline",
    "blockquote", "code-block", "list", "align", "indent", "size",
    "link", "image", "video", "direction"
  ];

  return (
    <div className="max-w-[1000px] mx-auto mt-10" >
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={onChange}
        placeholder={t("ReactEditor_placeholder")}
        className={`quill-wrapper ${resolvedDirection === "rtl" ? "ql-rtl" : "ql-ltr"} min-h-[200px]`}
      />
    </div>
  );
};

export default ReactEditor;
