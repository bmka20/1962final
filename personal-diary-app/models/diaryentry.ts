import mongoose from 'mongoose';

const todoItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
});

const diaryEntrySchema = new mongoose.Schema({
  text: { type: String, required: true },
  mood: { type: String, required: true },
  todos: [todoItemSchema],
  date: { type: Date, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
});

export default mongoose.models.DiaryEntry || mongoose.model('DiaryEntry', diaryEntrySchema);
