import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, default: 'Ethnic Wear' },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: String },
    badge: { type: String, default: '' },
    image: { type: String, required: true },
    images: [{ type: String }],
    swatches: [{ type: String }],
    stock: { type: Number, default: 10 },
    isFeatured: { type: Boolean, default: true },
    isNewItem: { type: Boolean, default: false },
    description: { type: String },
    details: [{ type: String }]
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
