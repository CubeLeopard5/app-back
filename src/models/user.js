const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
    nickname: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    role: {type: String },
    token: { type: String },
    workflow: { type: Array },
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("user", userSchema);