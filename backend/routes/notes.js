const express = require("express");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");


// ROUTE 1: Get all the Notes using: GET "/api/notes/getuser".  login required
router.get('/fetchallnotes',fetchuser, async(req, res)=>{
    try {
        const notes = await Notes.find({user: req.user.id})
   
        res.json(notes)
   
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
   
        
    }
})
   
// ROUTE 2: Add a new Note using: POST "/api/notes/addnote".  login required
router.post('/addnote',fetchuser,[
    body("title", "enter a valid title").isLength({ min: 3 }),

    body("description", "description must be atleat 5 characters").isLength({ min: 5 }),

], async(req, res)=>{
    try {
        const{title,description,tag} = req.body;

     // if there are errors return bad request and errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
     const note = new Notes({
         title,description,tag,user:req.user.id
     })
     const savedNote = await note.save()

   
    res.json(savedNote)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
        
    }
    
})

// ROUTE 3: Updatea an existing note using: PUT "/api/notes/updatenote".  login required
router.put('/updatenote/:id',fetchuser, async(req, res)=>{
    const{title,description,tag} = req.body;
    try {
        // create a newNote object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    // find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}
    
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("Not Allowed")


    }
    note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note});

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
        
        
    }
    
})
// ROUTE 4: Delete an existing note using: DELETE "/api/notes/deletenote".  login required
router.delete('/deletenote/:id',fetchuser, async(req, res)=>{
    try {
        
    // find the note to be delete and delete it
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    // Allow deletion if user owns this Note
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("Not Allowed")


    }
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success ":"notes has been deleted", note:note});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
        
    }
    

})

module.exports = router;