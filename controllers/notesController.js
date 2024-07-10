const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { json } = require("express");

const getAllNotes = asyncHandler(async (req, res)=>{
    const notes = await Note.find().lean()

    if(!notes?.length){
        return res.status(400).json({message:"No notes find"})
    }

    const noteWithUser = await Promise.all(notes.map(async (note) =>{
        const user = await User.findById(note.user).lean().exec()
        return { ...note,username: user.username}
    }))
    console.log(noteWithUser)
    return res.json(noteWithUser)
})


const updateNotes = asyncHandler(async (req, res)=>{
    
    const {id, user, title, text, completed } =req.body

    if(!id || !user || !title || !text || typeof completed !== 'boolean'){
        return res.status(400).json({message: "All fields are requied" })
    }

    const note = await Note.findById(id).exec()

    if(!note){
        return res.status(400).json({message: "Note not found"})
    }

    const duplicate = await Note.findOne({ title }).lean().exec()

    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(400).json({message:"Duplicate note title"})
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json(`'${updatedNote.title}' updated`)
})


const createNewNotes = asyncHandler(async (req, res)=>{
    const {user,title,text} = req.body

    if(!user || !title || !text){
        return res.status(400).json({message: "All fileds are required"})
    }

    const duplicated = await Note.findOne({title}).lean().exec()

    if(duplicated){
        return res.status(400).json({message: 'Duplicate note title'})
    }

    const note = await Note.create({user, title, text})

    if(note){
        return res.status(201).json({message: 'New Note created'})
    } else {
        return res.status(400).json({message: 'Invalid note data received'})
    }
})

const deleteNotes = asyncHandler(async (req, res)=>{
    const { id } = req.body
    
    if(!id){
        return res.status(400).json({message : 'Note ID required'})
    }

    const note = await Note.findById(id).exec()

    if(!note){
        return res.status(400).json({ messsage : 'Note not found'})
    }

    const result = await note.deleteOne()

    const reply = `Note '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllNotes,
    createNewNotes,
    updateNotes,
    deleteNotes
}
