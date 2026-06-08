import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Minus, Link as LinkIcon, Undo, Redo,
  Heading1, Heading2, Heading3, Table as TableIcon,
  Columns2, Rows2, Trash2, Plus,
} from "lucide-react";
import { useEffect, useCallback, useState, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Write content here...", minHeight = "300px" }: RichTextEditorProps) {
  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const tableMenuRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-400 underline cursor-pointer" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
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

  // Close table menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tableMenuRef.current && !tableMenuRef.current.contains(e.target as Node)) {
        setTableMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const isInTable = editor.isActive("table");

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
        <Divider />
        {/* Table */}
        <div className="relative" ref={tableMenuRef}>
          <button
            type="button"
            onClick={() => setTableMenuOpen((v) => !v)}
            className={btnClass(isInTable || tableMenuOpen)}
            title="Table"
          >
            <TableIcon size={14} />
          </button>
          {tableMenuOpen && (
            <div className="absolute left-0 top-full mt-1 z-50 bg-[#0a0f1e] border border-gray-700 rounded-lg shadow-xl py-1 min-w-[180px]">
              {/* Insert table */}
              {!isInTable && (
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  onClick={() => {
                    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                    setTableMenuOpen(false);
                  }}
                >
                  <TableIcon size={13} />
                  Insert Table (3×3)
                </button>
              )}
              {isInTable && (
                <>
                  <div className="px-3 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Columns</div>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={() => { editor.chain().focus().addColumnBefore().run(); setTableMenuOpen(false); }}
                  >
                    <Plus size={13} />
                    Add Column Before
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={() => { editor.chain().focus().addColumnAfter().run(); setTableMenuOpen(false); }}
                  >
                    <Plus size={13} />
                    Add Column After
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    onClick={() => { editor.chain().focus().deleteColumn().run(); setTableMenuOpen(false); }}
                  >
                    <Columns2 size={13} />
                    Delete Column
                  </button>
                  <div className="border-t border-gray-700 my-1" />
                  <div className="px-3 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Rows</div>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={() => { editor.chain().focus().addRowBefore().run(); setTableMenuOpen(false); }}
                  >
                    <Plus size={13} />
                    Add Row Before
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={() => { editor.chain().focus().addRowAfter().run(); setTableMenuOpen(false); }}
                  >
                    <Plus size={13} />
                    Add Row After
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    onClick={() => { editor.chain().focus().deleteRow().run(); setTableMenuOpen(false); }}
                  >
                    <Rows2 size={13} />
                    Delete Row
                  </button>
                  <div className="border-t border-gray-700 my-1" />
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    onClick={() => { editor.chain().focus().deleteTable().run(); setTableMenuOpen(false); }}
                  >
                    <Trash2 size={13} />
                    Delete Table
                  </button>
                </>
              )}
            </div>
          )}
        </div>
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
        /* Table styles - editor */
        .tiptap.ProseMirror table { border-collapse: collapse; width: 100%; margin: 1rem 0; table-layout: fixed; }
        .tiptap.ProseMirror th { background-color: #1a2540; color: #b48f4b; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.6rem 0.75rem; border: 1px solid #2a3a5c; text-align: left; }
        .tiptap.ProseMirror td { padding: 0.5rem 0.75rem; border: 1px solid #2a3a5c; color: #c8bfb0; font-size: 0.875rem; vertical-align: top; }
        .tiptap.ProseMirror tr:nth-child(even) td { background-color: rgba(255,255,255,0.02); }
        .tiptap.ProseMirror .selectedCell:after { z-index: 2; position: absolute; content: ""; left: 0; right: 0; top: 0; bottom: 0; background: rgba(180,143,75,0.15); pointer-events: none; }
        .tiptap.ProseMirror .column-resize-handle { position: absolute; right: -2px; top: 0; bottom: -2px; width: 4px; background-color: #b48f4b; pointer-events: none; }
        .tiptap.ProseMirror.resize-cursor { cursor: col-resize; }
      `}</style>
    </div>
  );
}
