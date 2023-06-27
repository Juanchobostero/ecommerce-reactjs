import mongoose from 'mongoose';

const productCategorySchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

export default ProductCategory;