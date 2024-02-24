const express = require("express");
const router = express.Router();
const Contact = require("../models/Contacts");
const mongoose = require("mongoose")
//api/contact
router.post("/contact", async (req, res) => {
  try {
    const newContact = new Contact(req.body); // validation is not handle in here

    await newContact // validation process done by mongoose the contact is adding
      .save()
      .then((savedContact) => {
        console.log(savedContact);
        res.status(201).json({ msg: "Contact successfully saved!" });
      
      })
      .catch((err) => {
        //res.status(400).json({msg: err}) return err object to see the struture of the err
        // err obj has its name , message and errors obj
        if (err.name == "ValidationError") {
          const validationErrors = err.errors;
          let errors = {};
          Object.keys(validationErrors).forEach((key) => {
            errors[key] = validationErrors[key].message;
          });
          res.status(400).json({ msg: "Validation error!", err: errors });
        }
        // 11000 => duplicate key error
        else if (err.code == 11000 && err.keyPattern.email) {
          res.status(400).json({ msg: "Email is already exists!" });
        } else {
          res
            .status(500)
            .json({ msg: "Unable to save the new contact!", err: err });
        }
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to save a new contact!" });
  }
});

// read all contacts
router.get("/contact", async (req, res) => {
  try {
    await Contact.find()
      .then((contacts) => {
        console.log(contacts);
        res.status(200).json({ contacts }); // same{ contacts: contacts}
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "Unable to get contacts!" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to get contacts!" });
  }
});

//
router.get("/contact/:id", async (req, res) => {
  try {
    const id = req.params.id;// getting inputs

    if (!mongoose.Types.ObjectId.isValid(id)){ // validate id before use it in the queries
      return res.status(400).json({msg: "Not a valid ID!"})
    }
      await Contact.findById(id)
        .then((contact) => {
          //console.log(contact);
          // !contact =>  undefined or null
          // in findById get null
          if (!contact) {
           
            return res.status(404).json({ msg: "Contact not found!" });
          } else {
            return res.status(200).json({ contact });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({ msg: "Unable to find the contact!" });
        });
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg:"Unable to find the contact!"})
    
  }

});

router.get("/contact/search/:searchTerm", async (req,res)=> {
  try {
    const searchTerm = req.params.searchTerm;
    // console.log(req.params); params { searchTerm: 'fdsf' }
    const searchRegex = new RegExp(searchTerm, "i"); // i for case insensitive
    await Contact.find({
      // mongo db queries learn them
      $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
    })
      .then((contacts) => {
        //console.log(!contacts)
        //console.log(contacts) in here []
        // in find we get a []
        if(!contacts || contacts.length == 0){
          return res.status(404).json({ msg: "Contacts not found!"});
        }
        return res.status(200).json({ contacts });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json("Error serching contacts!");
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error serching contacts!");
  }
})

// update
router.put("/contact/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedContact = req.body;
    //(filter, update) // {new : true} return the new one
    await Contact.findOneAndUpdate({ _id: id }, updatedContact, { new: true })
    .then((newContact) => {
      console.log(newContact);
      return res.status(200).json({msg: "Contact updated successfully!" , contact: newContact})
    })
    .catch((error) =>{
      console.log(error);
      return res.status(500).json("Error updating contact!");
    });
  } catch (error) {
     console.log(error);
     return res.status(500).json("Error updating contact!");
  }
});

//delete 
// 2 types of deletes
// 1.soft delete => active or not
// 2.hard delete

router.delete("/contact/:id", async (req,res) => {
  try {
    const id = req.params.id;
    await Contact.findByIdAndDelete(id).then((deletedContact) =>{
      console.log(deletedContact);
      res.status(200).json({msg: "Contact deleted successfully!", contact: deletedContact})
    })
    .catch((error) =>{
      console.log(error);
      return res.status(500).json("Error deleting contact!");
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error deleting contact!");
  }
})





module.exports = router;

// {
//     "msg": {
//         "errors": {
//             "email": {
//                 "name": "ValidatorError",
//                 "message": "Path `email` is required.",
//                 "properties": {
//                     "message": "Path `email` is required.",
//                     "type": "required",
//                     "path": "email"
//                 },
//                 "kind": "required",
//                 "path": "email"
//             },
//             "lastName": {
//                 "name": "ValidatorError",
//                 "message": "last name is required",
//                 "properties": {
//                     "message": "last name is required",
//                     "type": "required",
//                     "path": "lastName"
//                 },
//                 "kind": "required",
//                 "path": "lastName"
//             },
//             "firstName": {
//                 "name": "ValidatorError",
//                 "message": "d53t534 is not a valid fist name.",
//                 "properties": {
//                     "message": "d53t534 is not a valid fist name.",
//                     "type": "user defined",
//                     "path": "firstName",
//                     "value": "d53t534"
//                 },
//                 "kind": "user defined",
//                 "path": "firstName",
//                 "value": "d53t534"
//             }
//         },
//         "_message": "Contact validation failed",
//         "name": "ValidationError",
//         "message": "Contact validation failed: email: Path `email` is required., lastName: last name is required, firstName: d53t534 is not a valid fist name."
//     }
// }
