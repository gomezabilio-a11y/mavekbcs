import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Minus, Link as LinkIcon, Undo, Redo,
  Heading1, Heading2, Heading3,
} from "lucide-react";
import { useEffect, useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Write content here...", minHeight = "300px" }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-400 underline cursor-pointer" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none px-4 py-3",
        style: `min-height: ${minHeight}`,
      },
    },
  });

  // Sync external value changes (e.g., when switching language tabs)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `p-1.5 rounded transition-colors ${active ? "bg-[#b48f4b]/30 text-[#b48f4b]" : "text-gray-400 hover:text-white hover:bg-white/10"}`;

  const Divider = () => <div className="w-px h-5 bg-gray-700 mx-0.5" />;

  return (
    <div className="rounded-lg border border-gray-700 overflow-hidden bg-[#0d1526]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-700 bg-[#0a0f1e]">
        {/* Undo / Redo */}
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btnClass(false)} title="Undo"><Undo size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btnClass(false)} title="Redo"><Redo size={14} /></button>
        <Divider />
        {/* Headings */}
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive("heading", { level: 1 }))} title="H1"><Heading1 size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive("heading", { level: 2 }))} title="H2"><Heading2 size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive("heading", { level: 3 }))} title="H3"><Heading3 size={14} /></button>
        <Divider />
        {/* Inline marks */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))} title="Bold"><Bold size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))} title="Italic"><Italic size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive("underline"))} title="Underline"><UnderlineIcon size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive("strike"))} title="Strikethrough"><Strikethrough size={14} /></button>
        <button type="button" onClick={setLink} className={btnClass(editor.isActive("link"))} title="Link"><LinkIcon size={14} /></button>
        <Divider />
        {/* Alignment */}
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btnClass(editor.isActive({ textAlign: "left" }))} title="Align Left"><AlignLeft size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btnClass(editor.isActive({ textAlign: "center" }))} title="Align Center"><AlignCenter size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={btnClass(editor.isActive({ textAlign: "right" }))} title="Align Right"><AlignRight size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("justify").run()} className={btnClass(editor.isActive({ textAlign: "justify" }))} title="Justify"><AlignJustify size={14} /></button>
        <Divider />
        {/* Lists */}
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))} title="Bullet List"><List size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))} title="Ordered List"><ListOrdered size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))} title="Blockquote"><Quote size={14} /></button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)} title="Horizontal Rule"><Minus size={14} /></button>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />

      {/* Prose styles for dark theme */}
      <style>{`
        .tiptap.ProseMirror h1 { font-size: 1.75rem; font-weight: 700; margin: 1rem 0 0.5rem; color: #f0e6d3; }
        .tiptap.ProseMirror h2 { font-size: 1.4rem; font-weight: 600; margin: 0.9rem 0 0.4rem; color: #e2d5c0; }
        .tiptap.ProseMirror h3 { font-size: 1.15rem; font-weight: 600; margin: 0.8rem 0 0.3rem; color: #d4c4a8; }
        .tiptap.ProseMirror p { margin: 0.5rem 0; color: #c8bfb0; line-height: 1.7; }
        .tiptap.ProseMirror ul { list-style: disc; padding-left: 1.5rem; color: #c8bfb0; }
        .tiptap.ProseMirror ol { list-style: decimal; padding-left: 1.5rem; color: #c8bfb0; }
        .tiptap.ProseMirror li { margin: 0.25rem 0; }
        .tiptap.ProseMirror blockquote { border-left: 3px solid #b48f4b; padding-left: 1rem; color: #8a9bb0; font-style: italic; margin: 0.75rem 0; }
        .tiptap.ProseMirror hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1rem 0; }
        .tiptap.ProseMirror strong { color: #f0e6d3; }
        .tiptap.ProseMirror em { color: #d4c4a8; }
        .tiptap.ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #4a5568; pointer-events: none; height: 0; }
      `}</style>
    </div>
  );
}
