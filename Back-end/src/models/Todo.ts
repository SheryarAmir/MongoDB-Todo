import mongoose, { Document } from 'mongoose';

interface ITodo extends Document {
  value: string;
  isComplete: boolean;
  createDate: Date;
}

const TodoSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

export const Todo = mongoose.model<ITodo>('Todo', TodoSchema); 

