const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: Boolean,
    default: false
  },
  projectIn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Task', TaskSchema);