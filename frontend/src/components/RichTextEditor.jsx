import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { marked } from 'marked';

const TEXT_COLORS = ['#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
const HIGHLIGHT_COLORS = ['#FEF08A', '#BBF7D0', '#BFDBFE', '#FBCFE8', '#FED7AA'];

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, Highlight.configure({ multicolor: true })],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[250px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
      },
      handlePaste(view, event) {
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
    <div className="flex gap-1 mb-2 flex-wrap items-center">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
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

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Text color swatches */}
      <span className="text-xs text-gray-500 mr-1">Text</span>
      {TEXT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => editor.chain().focus().setColor(color).run()}
          className="w-5 h-5 rounded-full border border-gray-300"
          style={{ backgroundColor: color }}
          title={`Text color ${color}`}
        />
      ))}
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetColor().run()}
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
          onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
          className="w-5 h-5 rounded-full border border-gray-300"
          style={{ backgroundColor: color }}
          title={`Highlight ${color}`}
        />
      ))}
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetHighlight().run()}
        className="text-xs text-gray-500 hover:text-gray-700 px-1"
        title="Remove highlight"
      >
        ✕
      </button>
    </div>
  );
};

export default RichTextEditor;