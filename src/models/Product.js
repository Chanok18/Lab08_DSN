import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ''
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    category: {
      type: String,
      default: ''
    },

    imageUrl: {
      type: String,
      default: ''
    },

    store: {
      type: String,
      required: true,
      default: 'Tienda Central'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Product', productSchema);
