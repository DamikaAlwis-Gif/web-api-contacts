const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
// check mongoose npm documentation
const contact = new mongoose.Schema({
  firstName:{
    type: String,
    required: [true, "first name is required"],
    minLength: [3, "Must at least 3, got {VALUE}"],
    maxLength: 20,
    trim: true,
    validate: {
      validator: function(v){
        const nameRegex = /^[a-zA-Z]+$/; 
        return nameRegex.test(v); // custom validators
      },
      message: props => `${props.value} is not a valid fist name.`

    }

  },
  lastName: {
    type: String,
    required: [true, "last name is required"],
    minLength: [3, "Must at least 3, got {VALUE}"],
    maxLength: 20,
    trim: true,
    validate: {
      validator: function(v){
        const nameRegex = /[a-zA-Z]/; 
        return nameRegex.test(v); // custom validators
      },
      message: props => `${props.value} is not a valid fist name.`
      

    }

  },
  email : {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v){
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        emailRegex.test(v);
      },
      message: "Email is not valid!"
    },
    unique: [true, "This email is already used!"]

  }




});

module.exports = mongoose.model("Contact", contact);