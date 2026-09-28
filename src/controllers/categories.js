import { getAllCategories, getCategoryById, getProjectsByCategoryId, updateCategoryAssignments } from '../models/categories.js';

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

export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm };