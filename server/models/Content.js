import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    lastPublishedAt: { type: Date },
    lastDraftUpdatedAt: { type: Date }
  },
  { timestamps: true }
);

export const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);
