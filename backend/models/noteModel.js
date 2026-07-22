const db = require('../config/db');

const createNote = async (userId, title, content) => {
  const [result] = await db.query(
    'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
    [userId, title, content]
  );
  return result.insertId;
};

const getNotesByUser = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
    [userId]
  );
  return rows;
};

const getNoteById = async (noteId, userId) => {
  const [rows] = await db.query(
    'SELECT * FROM notes WHERE id = ? AND user_id = ?',
    [noteId, userId]
  );
  return rows[0];
};

const updateNote = async (noteId, userId, title, content) => {
  const [result] = await db.query(
    'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
    [title, content, noteId, userId]
  );
  return result.affectedRows;
};

const deleteNote = async (noteId, userId) => {
  const [result] = await db.query(
    'DELETE FROM notes WHERE id = ? AND user_id = ?',
    [noteId, userId]
  );
  return result.affectedRows;
};

module.exports = { createNote, getNotesByUser, getNoteById, updateNote, deleteNote };