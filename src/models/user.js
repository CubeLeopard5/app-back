const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
    username: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    role: {type: String },
    token: { type: String },
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("user", userSchema);