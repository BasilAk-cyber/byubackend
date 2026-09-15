import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/catergories.js';

// ES modules don't have __dirname built in, so reconstruct it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3003;

/**
 * Middleware
 */
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
});

app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();
        res.render('projects', {
            title: 'Service Projects',
            projects
        });
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).send('Error loading projects');
    }
});

app.get('/catergories', async (req, res) => {
    try {
        const catergories = await getAllCategories();
        console.log(catergories)
        res.render('catergories', {
            title: 'Project Categories',
            catergories
        });
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('Error loading categories');
    }
});

/**
 * Start server
 */
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        //console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});