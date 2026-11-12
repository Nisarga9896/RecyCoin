import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: true, minlength: 6 },
    points: { type: Number, default: 0, min: 0 },
    totalEarned: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    roundsPlayed: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    avatarColor: { type: String, default: '#10b981' },
    isSeller: { type: Boolean, default: false },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  },
  { timestamps: true }
);

userSchema.methods.toSafe = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    points: this.points,
    totalEarned: this.totalEarned,
    totalSpent: this.totalSpent,
    roundsPlayed: this.roundsPlayed,
    bestScore: this.bestScore,
    avatarColor: this.avatarColor,
    isSeller: this.isSeller,
    wishlist: this.wishlist,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', userSchema);