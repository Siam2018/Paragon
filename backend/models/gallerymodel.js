import mongoose from 'mongoose';

const gallerySchema = mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true,
    default: 'Gallery Image'
  },
  description: {
    type: String,
    trim: true
  },
  imageURL: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Gallery = mongoose.model('Gallery', gallerySchema);
