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

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
