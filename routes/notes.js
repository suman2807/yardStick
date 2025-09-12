const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticate, checkNoteLimit, getNotes, updateNotes } = require('../middleware/auth');

const router = express.Router();

// Get all notes for the current tenant
router.get('/', authenticate, (req, res) => {
  try {
    const notes = getNotes();
    const tenantNotes = notes.filter(note => note.tenantId === req.user.tenantId);
    res.json(tenantNotes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific note by ID
router.get('/:id', authenticate, (req, res) => {
  try {
    const notes = getNotes();
    const note = notes.find(note => 
      note.id === req.params.id && note.tenantId === req.user.tenantId
    );
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new note
router.post('/', authenticate, checkNoteLimit, (req, res) => {
  try {
    const notes = getNotes();
    const { title, content } = req.body;
    
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    // Create new note
    const newNote = {
      id: uuidv4(),
      title,
      content,
      tenantId: req.user.tenantId,
      userId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    notes.push(newNote);
    updateNotes(notes); // Update the notes array in middleware
    
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a note
router.put('/:id', authenticate, (req, res) => {
  try {
    const notes = getNotes();
    const noteIndex = notes.findIndex(note => 
      note.id === req.params.id && note.tenantId === req.user.tenantId
    );
    
    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Only the note owner or admin can update the note
    if (notes[noteIndex].userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { title, content } = req.body;
    
    // Update note
    notes[noteIndex].title = title || notes[noteIndex].title;
    notes[noteIndex].content = content || notes[noteIndex].content;
    notes[noteIndex].updatedAt = new Date();
    
    updateNotes(notes); // Update the notes array in middleware
    
    res.json(notes[noteIndex]);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a note
router.delete('/:id', authenticate, (req, res) => {
  try {
    const notes = getNotes();
    const noteIndex = notes.findIndex(note => 
      note.id === req.params.id && note.tenantId === req.user.tenantId
    );
    
    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Only the note owner or admin can delete the note
    if (notes[noteIndex].userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Delete note
    const deletedNote = notes.splice(noteIndex, 1)[0];
    updateNotes(notes); // Update the notes array in middleware
    
    res.json({ message: 'Note deleted successfully', note: deletedNote });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;