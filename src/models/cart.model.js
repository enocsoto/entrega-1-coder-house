import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Middleware para popular los productos cuando se consulta un carrito
cartSchema.pre('findOne', function () {
  this.populate('products.product');
});

export const Cart = mongoose.model('Cart', cartSchema);