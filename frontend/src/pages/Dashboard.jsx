import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Eye } from 'lucide-react';
import ViewNoteModal from '../components/ViewNoteModal';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [viewingNote, setViewingNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axiosInstance.get('/notes');
        setNotes(res.data.notes);
      } catch (err) {
        setError('Failed to load notes.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Hi, {user?.name}</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600 font-medium"
          >
            Log out
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Your Notes</h2>
          <Link
            to="/notes/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + New Note
          </Link>
        </div>

        {loading && <p className="text-gray-500">Loading notes...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && notes.length === 0 && (
          <p className="text-gray-500">You don't have any notes yet. Create one!</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {notes.map((note) => (
    <div
      key={note.id}
      className="relative block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setViewingNote(note);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 p-1"
                title="View note"
              >
                <Eye size={16} />
              </button>

              <Link to={`/notes/${note.id}`} className="block pr-6">
                <h3 className="font-semibold text-gray-800 truncate">{note.title}</h3>
                <p
                  className="text-sm text-gray-500 mt-1 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(note.updated_at).toLocaleDateString()}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <ViewNoteModal note={viewingNote} onClose={() => setViewingNote(null)} />
    </div>
  );
};

export default Dashboard;