const {
  createNote,
  getNotesByUser,
  getNoteById,
  updateNote,
  deleteNote,
} = require('../models/noteModel');

const addNote = async (userId, title, content) => {
  if (!title) {
    const error = new Error('Title is required');
    error.statusCode = 400;
    throw error;
  }
  const normalizedContent = content || '';
  const noteId = await createNote(userId, title, normalizedContent);
  return { id: noteId, title, content: normalizedContent };
};

const listNotes = async (userId) => {
  return await getNotesByUser(userId);
};

const getNote = async (noteId, userId) => {
  const note = await getNoteById(noteId, userId);
  if (!note) {
    const error = new Error('Note not found');
    error.statusCode = 404;
    throw error;
  }
  return note;
};

const editNote = async (noteId, userId, title, content) => {
  const affectedRows = await updateNote(noteId, userId, title, content);
  if (affectedRows === 0) {
    const error = new Error('Note not found or you do not have permission to edit it');
    error.statusCode = 404;
    throw error;
  }
  return { id: noteId, title, content };
};

const removeNote = async (noteId, userId) => {
  const affectedRows = await deleteNote(noteId, userId);
  if (affectedRows === 0) {
    const error = new Error('Note not found or you do not have permission to delete it');
    error.statusCode = 404;
    throw error;
  }
};

module.exports = { addNote, listNotes, getNote, editNote, removeNote };