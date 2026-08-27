import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import NotesIllustration from '../components/NotesIllustration';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        <div className="md:w-1/2 bg-linear-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-10">
          <NotesIllustration />
          <h3 className="text-gray-700 font-semibold text-lg mt-4 text-center">
            Join SyncNote today
          </h3>
          <p className="text-gray-500 text-sm text-center mt-1 max-w-[220px]">
            Organize your thoughts beautifully, from anywhere.
          </p>
        </div>

        <div className="md:w-1/2 p-10 flex flex-col justify-center dark:bg-slate-900">
          <p
            className="text-3xl text-indigo-600 mb-1"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            SyncNote
          </p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="signup-name" className="block text-xs text-gray-500 mb-1">
                Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pb-2 border-b-2 border-gray-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition text-gray-800 dark:text-white bg-transparent"
              />
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-xs text-gray-500 mb-1">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pb-2 border-b-2 border-gray-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition text-gray-800 dark:text-white bg-transparent"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-xs text-gray-500 mb-1">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pb-2 border-b-2 border-gray-200 dark:border-slate-700 focus:border-indigo-500 outline-none transition text-gray-800 dark:text-white bg-transparent"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 rounded-full font-medium shadow-md hover:bg-gray-900 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;