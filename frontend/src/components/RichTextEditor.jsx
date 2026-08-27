import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { marked } from 'marked';
import Image from '@tiptap/extension-image';

const TEXT_COLORS = ['#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
const HIGHLIGHT_COLORS = ['#FEF08A', '#BBF7D0', '#BFDBFE', '#FBCFE8', '#FED7AA'];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, Highlight.configure({ multicolor: true }),  Image.configure({ inline: true, allowBase64: true }),],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none min-h-[250px] px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400',
      },
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of items) {
            if (item.type.startsWith('image/')) {
              const file = item.getAsFile();
              if (file) {
                fileToBase64(file).then((base64) => {
                  editor.chain().focus().setImage({ src: base64 }).run();
                });
                event.preventDefault();
                return true;
              }
            }
          }
        }

        const text = event.clipboardData?.getData('text/plain');
        const hasHtml = event.clipboardData?.getData('text/html');

        // Only intervene if there's no rich HTML already (e.g. pasting plain markdown text)
        if (text && !hasHtml && /(\*\*|##|^\d+\.|^-\s|^-\s\[)/m.test(text)) {
          const html = marked.parse(text);
          editor.commands.insertContent(html);
          event.preventDefault();
          return true;
        }
        return false;
      },
      handleDrop(view, event) {
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type.startsWith('image/')) {
            fileToBase64(file).then((base64) => {
              editor.chain().focus().setImage({ src: base64 }).run();
            });
            event.preventDefault();
            return true;
          }
        }
        return false;
      },
    },
  });

  if (!editor) return null;

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

const Toolbar = ({ editor }) => {
  const btnClass = (isActive) =>
    `px-2 py-1 text-sm rounded ${
      isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <div
      className="flex gap-1 mb-2 flex-wrap items-center"
      onMouseDown={(event) => {
        if (event.target.closest('button')) event.preventDefault();
      }}
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().extendMarkRange('italic').toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading', { level: 2 }))}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive('orderedList'))}
      >
        1. List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive('blockquote'))}
      >
        Quote
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={btnClass(editor.isActive('codeBlock'))}
      >
        Code
      </button>
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const base64 = await fileToBase64(file);
            editor.chain().focus().setImage({ src: base64 }).run();
          }
          e.target.value = '';
        }}
      />
      <label
        htmlFor="image-upload"
        className="px-2 py-1 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
      >
        🖼 Image
      </label>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Text color swatches */}
      <span className="text-xs text-gray-500 mr-1">Text</span>
      {TEXT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => editor.chain().focus().extendMarkRange('textStyle').setColor(color).run()}
          className="w-5 h-5 rounded-full border border-gray-300"
          style={{ backgroundColor: color }}
          title={`Text color ${color}`}
        />
      ))}
      <button
        type="button"
        onClick={() => editor.chain().focus().extendMarkRange('textStyle').unsetColor().run()}
        className="text-xs text-gray-500 hover:text-gray-700 px-1"
        title="Reset text color"
      >
        ✕
      </button>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Highlight swatches */}
      <span className="text-xs text-gray-500 mr-1">Highlight</span>
      {HIGHLIGHT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => editor.chain().focus().extendMarkRange('highlight').toggleHighlight({ color }).run()}
          className="w-5 h-5 rounded-full border border-gray-300"
          style={{ backgroundColor: color }}
          title={`Highlight ${color}`}
        />
      ))}
      <button
        type="button"
        onClick={() => editor.chain().focus().extendMarkRange('highlight').unsetHighlight().run()}
        className="text-xs text-gray-500 hover:text-gray-700 px-1"
        title="Remove highlight"
      >
        ✕
      </button>
    </div>
  );
};

export default RichTextEditor;