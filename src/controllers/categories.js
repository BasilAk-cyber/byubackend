import { getAllCategories } from '../models/catergories.js';

const showCategoriesPage = async (req, res) => {
    const catergories = await getAllCategories();
    const title = 'Service Categories';
    res.render('catergories', { title, catergories });
};

export { showCategoriesPage };