import mongoose from 'mongoose';

const gallerySchema = mongoose.Schema({
  imageURL: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Gallery = mongoose.model('Gallery', gallerySchema);
