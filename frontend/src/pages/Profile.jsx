import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, Mail, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden text-gray-900 dark:text-slate-100">
      <div className="absolute top-16 left-16 w-3 h-3 rounded-full bg-yellow-300" />
      <div className="absolute bottom-20 right-20 w-3 h-3 rounded-full bg-blue-300" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 relative"
      >
        <p
          className="text-2xl text-indigo-600 mb-1"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          SyncNote
        </p>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <UserRound size={27} />
          </div>
          <div>
            <p className="text-xs text-indigo-500 uppercase tracking-wide font-semibold">Account</p>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Profile</h2>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs text-indigo-500 uppercase tracking-wide font-semibold">Name</p>
            <p className="text-gray-800 dark:text-slate-100 font-medium border-b-2 border-gray-100 dark:border-slate-700 pb-2">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-500 uppercase tracking-wide font-semibold">Email</p>
            <p className="text-gray-800 dark:text-slate-100 font-medium border-b-2 border-gray-100 dark:border-slate-700 pb-2">{user?.email}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300 hover:text-indigo-600 font-medium transition">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-red-50 text-sm text-red-600 hover:bg-red-100 font-medium transition"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;