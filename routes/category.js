const express = require('express');
const router = express.Router();
const CategoryModel = require('../schemas/category');
const { CreateErrorRes, CreateSuccessRes } = require('../utils/responseHandler');

router.get('/', async (req, res, next) => {
  try {
    let categories = await CategoryModel.find({ isDeleted: false });
    CreateSuccessRes(res, categories, 200);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let category = await CategoryModel.findOne({ _id: req.params.id, isDeleted: false });
    if (!category) return CreateErrorRes(res, 'Danh mục không tồn tại', 404);
    CreateSuccessRes(res, category, 200);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    let { name, description } = req.body;
    let newCategory = new CategoryModel({ name, description });
    await newCategory.save();
    CreateSuccessRes(res, newCategory, 201);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    let { name, description } = req.body;
    let updatedInfo = {};
    if (name) updatedInfo.name = name;
    if (description) updatedInfo.description = description;

    let updatedCategory = await CategoryModel.findByIdAndUpdate(req.params.id, updatedInfo, { new: true });
    if (!updatedCategory) return CreateErrorRes(res, 'Danh mục không tồn tại', 404);
    CreateSuccessRes(res, updatedCategory, 200);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    let deletedCategory = await CategoryModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!deletedCategory) return CreateErrorRes(res, 'Danh mục không tồn tại', 404);
    CreateSuccessRes(res, deletedCategory, 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
