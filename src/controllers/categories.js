import { body, validationResult } from 'express-validator';
import { getProjectDetails } from '../models/projects.js';
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const { id } = req.params;
    const category = await getCategoryById(id);
    const projects = await getProjectsByCategoryId(id);
    const title = category ? category.name : 'Category';
    res.render('category', { title, category, projects });
};

const showAssignCategoriesForm = async (req, res) => {
    const { projectId } = req.params;

    const project = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    res.render('assign-categories', {
        title: 'Assign Categories to Project',
        project,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async (req, res) => {
    const { projectId } = req.params;

    let categoryIds = req.body.categoryIds || [];
    if (!Array.isArray(categoryIds)) {
        categoryIds = [categoryIds];
    }

    await updateCategoryAssignments(projectId, categoryIds);

    req.flash('success', 'Categories updated successfully!');
    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'New Category' });
};

const processNewCategoryForm = async (req, res) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    await createCategory(req.body.name);

    req.flash('success', 'Category added successfully!');
    res.redirect('/categories');
};

const showEditCategoryForm = async (req, res) => {
    const { id } = req.params;
    const category = await getCategoryById(id);

    res.render('edit-category', {
        title: 'Edit Category',
        category
    });
};

const processEditCategoryForm = async (req, res) => {
    const { id } = req.params;
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-category/${id}`);
    }

    await updateCategory(id, req.body.name);

    req.flash('success', 'Category updated successfully!');
    res.redirect('/categories');
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};