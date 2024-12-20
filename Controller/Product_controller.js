const ProductModel = require('../Model/Product_model.js');
const { calculateFinalPrice } = require('../Helper/Helper.js');

// Middleware for file uploads
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products'); // Folder for storing images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    },
}).array('images', 10); // Accept up to 10 images

const createProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { category, sub_category, product_name, mrp, discount, stock, specification, gst } = req.body;

            // Get image paths from multer
            const images = req.files.map(file => file.path);

            // Calculate the final price using helper function
            const final_price = calculateFinalPrice(mrp, discount, gst);

            const productData = {
                category,
                sub_category,
                product_name,
                mrp,
                discount,
                final_price,
                stock,
                specification,
                gst,
                images, // Store image paths in the product data
            };

            await ProductModel.createProduct(productData);
            res.status(201).json({ message: 'Product created successfully', productData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
};

const updateProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { id } = req.params;
            const { category, sub_category, product_name, mrp, discount, stock, specification, gst } = req.body;

            // Get image paths from multer (if any new images are uploaded)
            const images = req.files.map(file => file.path);

            // Calculate the final price using helper function
            const final_price = calculateFinalPrice(mrp, discount, gst);

            const productData = {
                category,
                sub_category,
                product_name,
                mrp,
                discount,
                final_price,
                stock,
                specification,
                gst,
                ...(images.length && { images }), // Include images only if provided
            };

            await ProductModel.updateProduct(id, productData);
            res.status(200).json({ message: 'Product updated successfully', productData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
};

const getAllProducts = async (req, res) => {
    try {
        const [products] = await ProductModel.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const [product] = await ProductModel.getProductById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await ProductModel.deleteProduct(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
