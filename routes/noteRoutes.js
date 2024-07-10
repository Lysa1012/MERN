const express = require('express')
const router = express.Router()
const notesController = require('../controllers/notesController')
 router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.createNewNotes)
    .patch(notesController.updateNotes)
    .delete(notesController.deleteNotes)

module.exports = router