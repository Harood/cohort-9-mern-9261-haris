import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Eye, Search } from 'lucide-react';
import ViewNoteModal from '../components/ViewNoteModal';
import { sanitizeHtml } from '../utils/sanitize';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [viewingNote, setViewingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = note.title.toLowerCase().includes(query);
    const contentMatch = note.content?.toLowerCase().includes(query);
    return titleMatch || contentMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    S
                  </div>
                  <span className="font-bold text-gray-800">SyncNote</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Hi, {user?.name}</h1>
              </div>
          <div className="flex items-center gap-4">
              <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-600 font-medium"
              >
                Log out
              </button>
            </div>
        </div>

        <div className="flex justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold text-gray-700 shrink-0">Your Notes</h2>
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Link
            to="/notes/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shrink-0"
          >
            + New Note
          </Link>
        </div>

        {loading && <p className="text-gray-500">Loading notes...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && notes.length === 0 && (
          <p className="text-gray-500">You don't have any notes yet. Create one!</p>
        )}

        {!loading && notes.length > 0 && filteredNotes.length === 0 && (
          <p className="text-gray-500">No notes match your search.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {filteredNotes.map((note) => (
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
                <div
                  className="text-sm text-gray-500 mt-1 line-clamp-2 max-h-10 overflow-hidden [&_img]:hidden"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content) }}
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