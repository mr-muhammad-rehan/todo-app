const mongoose = require("mongoose");
const TodoStatus = require('../contracts/todoStatusEnum');

const todoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    title: { type: String, required: true, trim: true, },
    status: { type: String, required: false, trim: true, default: TodoStatus.TODO },
}, { timestamps: true });

module.exports = mongoose.model("Todo", todoSchema);