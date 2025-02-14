const Category = require("../Model/CategoryModel");
const Subcategory = require('../Model/SubcategoryModel');


const CreateCategory = async (req, res) => {
    const { competition } = req.body; // Expecting the competition name (Turban or Dumala)

    try {
        // Check if the category already exists
        let category = await Category.findOne({ name: competition });

        if (!category) {
            // If not, create a new category
            category = new Category({ name: competition });
            await category.save();
        }

        res.status(201).json({
            success: true,
            message: `Category '${competition}' created or already exists.`,
            category,
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const fetehCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const CreateSubCategory = async (req, res) => {
    const { categoryId, group } = req.body; // Expecting the categoryId (category like Turban/Dumala) and group (Junior, Senior, Expert)

    try {
        // Check if the category exists
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(400).json({ success: false, message: "Category not found" });
        }

        // Check if subcategory already exists under this category
        let subcategory = await Subcategory.findOne({ categoryId, group });

        if (!subcategory) {
            // If not, create a new subcategory
            subcategory = new Subcategory({ group, categoryId, name: `${group} - ${category.name}` });
            await subcategory.save();
        }

        res.status(201).json({
            success: true,
            message: `Subcategory '${group}' created or already exists.`,
            subcategory,
        });
    } catch (error) {
        console.error('Error creating subcategory:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}
const fetchSubcategory = async (req, res) => {
    try {
        const subcategories = await Subcategory.find()
            .populate('categoryId', 'name')
            .exec();

        res.status(200).json(subcategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { CreateCategory, CreateSubCategory, fetehCategory, fetchSubcategory };