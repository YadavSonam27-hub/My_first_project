import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    city: { type: String, required: true, trim: true },
    summary: { type: String, default: '' },
    searchedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

searchHistorySchema.index({ user: 1, searchedAt: -1 });

export default mongoose.model('SearchHistory', searchHistorySchema);
