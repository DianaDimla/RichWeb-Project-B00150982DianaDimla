import mongoose from 'mongoose';

// Define Product schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create Product model
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
