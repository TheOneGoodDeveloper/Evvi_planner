const SubCategory = require('../models/subCategoryModel');

const getAllSubCategory = async (req, res) => {
    try {
        const [rows] = await SubCategory.getAll();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch sub-categories.' });
    }
};

const getByIdSubCategory = async (req, res) => {
    try {
        const [rows] = await SubCategory.getById(req.params.id);
        if (rows.length === 0) {
            return res.status(404).json({status:false, message: 'Sub-category not found.' });
        }
       return res.status(200).json({status:true, message:"Sub Category Fetched Sucessfully",sub_category:rows[0]});
    } catch (error) {
       return res.status(500).json({ status:false, message: 'Failed to fetch sub-category.' });
    }
};

const createSubCategory = async (req, res) => {
    try {
        const { category_id, name } = req.body;
        await SubCategory.create(category_id, name);
       return res.status(201).json({ status:false,message: 'Sub-category created successfully.' });
    } catch (error) {
       return res.status(500).json({ error: 'Failed to create sub-category.' });
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        await SubCategory.update(id, name);
       return res.json({ message: 'Sub-category updated successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update sub-category.' });
    }
};

const removeSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await SubCategory.delete(id);
        return res.json({ message: 'Sub-category deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete sub-category.' });
    }
};

module.exports = {
    getAllSubCategory,
    getByIdSubCategory,
    createSubCategory,
    updateSubCategory,
    removeSubCategory,
};
