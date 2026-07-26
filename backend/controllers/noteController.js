const { addNote, listNotes, getNote, editNote, removeNote } = require('../services/noteService');
const logger = require('../utils/logger');

const create = async (req, res, next) => {
  try {
    const { title, content } = req.body || {};
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const note = await addNote(req.user.id, title, content);
    logger.info({ noteId: note.id, userId: req.user.id }, 'Note created');
    res.status(201).json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const notes = await listNotes(req.user.id);
    res.status(200).json({ success: true, notes });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const note = await getNote(req.params.id, req.user.id);
    res.status(200).json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { title, content } = req.body || {};
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const note = await editNote(req.params.id, req.user.id, title, content);
    logger.info({ noteId: req.params.id, userId: req.user.id }, 'Note updated');
    res.status(200).json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await removeNote(req.params.id, req.user.id);
    logger.info({ noteId: req.params.id, userId: req.user.id }, 'Note deleted');
    res.status(200).json({ success: true, message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getOne, update, remove };