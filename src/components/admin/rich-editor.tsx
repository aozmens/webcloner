"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Pilcrow, Redo2, Undo2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tool = { label: string; icon: LucideIcon; run: () => void; active?: boolean; disabled?: boolean };

/**
 * Word-like editor for product descriptions: headings, bold, italic, lists and links. What is written here looks
 * the same on the product page (the server removes anything else when saving).
 */
export function RichEditor({ value, onChange, label }: { value: string; onChange: (html: string) => void; label: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        "aria-label": label,
        class: "rich-content min-h-64 px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: current }) =>
      current
        ? {
            h2: current.isActive("heading", { level: 2 }),
            h3: current.isActive("heading", { level: 3 }),
            paragraph: current.isActive("paragraph"),
            bold: current.isActive("bold"),
            italic: current.isActive("italic"),
            bullet: current.isActive("bulletList"),
            ordered: current.isActive("orderedList"),
            link: current.isActive("link"),
            canUndo: current.can().undo(),
            canRedo: current.can().redo(),
          }
        : null,
  });

  const chain = () => editor!.chain().focus();
  const editLink = () => {
    const current = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Bağlantı adresi (boş bırakırsanız bağlantı kaldırılır):", current ?? "https://");
    if (url === null) return;
    if (!url.trim() || url.trim() === "https://") chain().extendMarkRange("link").unsetLink().run();
    else chain().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const tools: Tool[][] = editor && state
    ? [
        [
          { label: "Paragraf", icon: Pilcrow, run: () => chain().setParagraph().run(), active: state.paragraph },
          { label: "Başlık", icon: Heading2, run: () => chain().toggleHeading({ level: 2 }).run(), active: state.h2 },
          { label: "Alt başlık", icon: Heading3, run: () => chain().toggleHeading({ level: 3 }).run(), active: state.h3 },
        ],
        [
          { label: "Kalın", icon: Bold, run: () => chain().toggleBold().run(), active: state.bold },
          { label: "İtalik", icon: Italic, run: () => chain().toggleItalic().run(), active: state.italic },
          { label: "Bağlantı", icon: Link2, run: editLink, active: state.link },
        ],
        [
          { label: "Madde işaretli liste", icon: List, run: () => chain().toggleBulletList().run(), active: state.bullet },
          { label: "Numaralı liste", icon: ListOrdered, run: () => chain().toggleOrderedList().run(), active: state.ordered },
        ],
        [
          { label: "Geri al", icon: Undo2, run: () => chain().undo().run(), disabled: !state.canUndo },
          { label: "Yinele", icon: Redo2, run: () => chain().redo().run(), disabled: !state.canRedo },
        ],
      ]
    : [];

  return (
    <div className="overflow-hidden rounded-md border border-neutral-300 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
      <div className="sticky top-0 z-10 flex flex-wrap gap-1 border-b border-neutral-200 bg-neutral-50 p-1" role="toolbar" aria-label={`${label} biçimlendirme`}>
        {tools.map((group, index) => (
          <div key={index} className="flex gap-0.5 border-r border-neutral-200 pr-1 last:border-r-0">
            {group.map((tool) => (
              <button
                key={tool.label}
                type="button"
                title={tool.label}
                aria-label={tool.label}
                aria-pressed={tool.active}
                disabled={tool.disabled}
                onClick={tool.run}
                className={cn("inline-flex size-9 items-center justify-center rounded text-neutral-700 hover:bg-neutral-200 disabled:opacity-30", tool.active && "bg-blue-100 text-blue-800")}
              >
                <tool.icon className="size-4" aria-hidden />
              </button>
            ))}
          </div>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
