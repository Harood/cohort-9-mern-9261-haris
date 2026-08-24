import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ConfirmDialog from '../components/ConfirmDialog';
import RichTextEditor from '../components/RichTextEditor';

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
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {isNewNote ? 'New Note' : 'Edit Note'}
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Note title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Cancel
            </button>

            <div className="flex gap-3">
              {!isNewNote && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
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