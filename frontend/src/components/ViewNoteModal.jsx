import { CalendarDays, X } from 'lucide-react';
import { sanitizeHtml } from '../utils/sanitize';

const ViewNoteModal = ({ note, onClose }) => {
  if (!note) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white/95 dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 border border-white dark:border-slate-700">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white pr-4">{note.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 shrink-0 transition"
            title="Close note"
            aria-label="Close note"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className="prose prose-base max-w-none text-gray-700 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content) }}
        />

        <p className="flex items-center gap-2 text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
          <CalendarDays size={14} />
          Last updated: {new Date(note.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ViewNoteModal;