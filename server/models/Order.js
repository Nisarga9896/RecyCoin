import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    itemName: String,
    itemEmoji: String,
    itemImage: String,
    itemCategory: String,
    price: { type: Number, required: true },
    discountPoints: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    tracking: [
      {
        label: String,
        detail: String,
        at: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['placed', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);