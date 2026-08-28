import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <motion.div
        className="absolute w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '-5rem', left: '-5rem' }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '-6rem', right: '-4rem' }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-pink-200/30 rounded-full blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '40%', left: '50%' }}
      />
    </div>
  );
};

export default AnimatedBackground;
