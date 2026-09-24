import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

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

export { showCategoriesPage, showCategoryDetailsPage };