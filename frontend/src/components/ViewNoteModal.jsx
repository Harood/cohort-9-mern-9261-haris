import { X } from 'lucide-react';

const ViewNoteModal = ({ note, onClose }) => {
  if (!note) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800 pr-4">{note.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className="prose prose-sm max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

        <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
          Last updated: {new Date(note.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ViewNoteModal;