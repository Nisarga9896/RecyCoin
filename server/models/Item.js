import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    condition: {
      type: String,
      enum: ['Refurbished', 'Good', 'Fair', 'Spare Parts'],
      default: 'Good',
    },
    price: { type: Number, required: true, min: 0 },
    emoji: { type: String, default: '📦' },
    images: {
      type: [String],
      validate: {
        validator: (images) => Array.isArray(images) && images.length > 0,
        message: 'At least one product image is required',
      },
    },
    age: { type: String, default: '', trim: true },
    defects: { type: String, default: '', trim: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['available', 'sold', 'hidden'],
      default: 'available',
    },
  },
  { timestamps: true }
);

itemSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.model('Item', itemSchema);