import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true, 
  },
  title: {
    type: String,
    required: true,
  },
  xp_reward: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;