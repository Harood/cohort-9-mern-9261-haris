import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Edit3, Eye, LogOut, Moon, Search, Sun, UserRound } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { sanitizeHtml } from '../utils/sanitize';
import ViewNoteModal from '../components/ViewNoteModal';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingNote, setViewingNote] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

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
    return (
      note.title.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query)
    );
  });

  const dotColors = ['bg-yellow-300', 'bg-pink-400', 'bg-blue-300', 'bg-purple-300'];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 px-4 py-8 text-gray-900 dark:text-slate-100 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p
              className="text-2xl text-indigo-600 mb-0.5"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              SyncNote
            </p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hi, {user?.name}</h1>
          </div>
          <div className="flex items-center gap-5">
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 font-medium transition"
            >
              <UserRound size={15} />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:border-red-200 hover:text-red-600 font-medium transition"
            >
              <LogOut size={15} />
              Log out
            </button>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-300 hover:border-indigo-200 hover:text-indigo-600 transition"
              title={isDark ? 'Use light mode' : 'Use dark mode'}
              aria-label={isDark ? 'Use light mode' : 'Use dark mode'}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>

        {/* Search + New Note row */}
        <div className="flex justify-between items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200 shrink-0">Your Notes</h2>
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-200 rounded-full shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="shrink-0">
            <Link
              to="/notes/new"
              className="bg-linear-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition inline-block"
            >
              <span className="inline-flex items-center gap-2">
                <BookOpen size={16} />
                New Note
              </span>
            </Link>
          </motion.div>
        </div>

        {loading && <p className="text-gray-400">Loading notes...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && notes.length === 0 && (
          <p className="text-gray-400">You don't have any notes yet. Create one!</p>
        )}

        {!loading && notes.length > 0 && filteredNotes.length === 0 && (
          <p className="text-gray-400">No notes match your search.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredNotes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className={`relative rounded-2xl p-4 border transition-shadow hover:shadow-lg ${
                ['bg-indigo-50 dark:bg-indigo-950/70 border-indigo-100 dark:border-indigo-800', 'bg-pink-50 dark:bg-pink-950/60 border-pink-100 dark:border-pink-800', 'bg-blue-50 dark:bg-blue-950/70 border-blue-100 dark:border-blue-800', 'bg-purple-50 dark:bg-purple-950/70 border-purple-100 dark:border-purple-800'][i % 4]
              }`}
            >
              <span className={`absolute top-3 left-3 w-2 h-2 rounded-full ${dotColors[i % dotColors.length]}`} />

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setViewingNote(note);
                }}
                className="absolute top-3 right-12 text-gray-400 hover:text-indigo-600 p-1 transition"
                title="View note"
              >
                <Eye size={19} />
              </button>
              <Link
                to={`/notes/${note.id}`}
                className="absolute top-3 right-3 text-gray-400 hover:text-indigo-600 p-1 transition"
                title="Edit note"
                aria-label="Edit note"
              >
                <Edit3 size={18} />
              </Link>

              <Link to={`/notes/${note.id}`} className="block pt-3 pr-6">
                <h3 className="font-semibold text-gray-800 dark:text-slate-100 truncate">{note.title}</h3>
                <div
                  className="text-sm text-gray-500 dark:text-slate-300 mt-1 line-clamp-2 max-h-10 overflow-hidden [&_img]:hidden"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content) }}
                />
                <p className="text-xs text-gray-400 dark:text-slate-400 mt-2">
                  {new Date(note.updated_at).toLocaleDateString()}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <ViewNoteModal note={viewingNote} onClose={() => setViewingNote(null)} />
    </div>
  );
};

export default Dashboard;