import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ConfirmDialog from '../components/ConfirmDialog';
import RichTextEditor from '../components/RichTextEditor';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const NoteEditor = () => {
  const { id } = useParams();
  const isNewNote = !id || id === 'new';
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!isNewNote);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isNewNote) return;

    const fetchNote = async () => {
      try {
        const res = await axiosInstance.get(`/notes/${id}`);
        setTitle(res.data.note.title);
        setContent(res.data.note.content || '');
      } catch (err) {
        setError('Failed to load note.');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, isNewNote]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    setSaving(true);
    try {
      if (isNewNote) {
        await axiosInstance.post('/notes', { title, content });
      } else {
        await axiosInstance.put(`/notes/${id}`, { title, content });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
  try {
    await axiosInstance.delete(`/notes/${id}`);
    navigate('/dashboard');
  } catch (err) {
    setError('Failed to delete note.');
  } finally {
    setShowDeleteConfirm(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading note...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 px-4 py-8 relative overflow-hidden text-gray-900 dark:text-slate-100">
      <div className="absolute top-14 right-16 w-3 h-3 rounded-full bg-pink-300" />
      <div className="absolute bottom-16 left-16 w-2.5 h-2.5 rounded-full bg-purple-300" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 relative"
      >
        <p className="text-2xl text-indigo-600 mb-1" style={{ fontFamily: "'Caveat', cursive" }}>
          SyncNote
        </p>
        <div className="flex items-center gap-3 mb-7">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-full text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
            title="Back to dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs text-indigo-500 uppercase tracking-wide font-semibold">Workspace</p>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {isNewNote ? 'New Note' : 'Edit Note'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title</label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pb-2 border-b-2 border-gray-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition text-gray-800 dark:text-white bg-transparent placeholder:text-gray-400 dark:placeholder:text-slate-500"
              placeholder="Note title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Content</label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition"
            >
              Cancel
            </button>

            <div className="flex gap-3">
              {!isNewNote && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-red-600 bg-red-50 hover:bg-red-100 text-sm font-medium transition"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-black transition disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
      <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete this note?"
          message="This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
    </div>
  );
};

export default NoteEditor;