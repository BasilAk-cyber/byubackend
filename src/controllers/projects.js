import { body, validationResult } from 'express-validator';
import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location cannot exceed 200 characters'),
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Please provide a valid date'),
    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Organization must be a valid ID')
];

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const { id } = req.params;
    const project = await getProjectDetails(id);
    const categories = await getCategoriesByProjectId(id);
    res.render('project', {
        title: project ? project.title : 'Project',
        project,
        categories
    });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    console.log(organizations);
    res.render('new-project', {
        title: 'New Project',   
        organizations
    });
};

const processNewProjectForm = async (req, res, next) => {
    try {
        const results = validationResult(req);
        if (!results.isEmpty()) {
            results.array().forEach((e) => req.flash('error', e.msg));
            return res.redirect('/new-project');
        }
        const { organizationId, title, description, location, date } = req.body;
        await createProject(title, description, location, date, Number(organizationId));
        req.flash('success', 'Project added successfully!');
        res.redirect('/projects');
    } catch (err) {
        next(err);
    }
};

const showEditProjectForm = async (req, res) => {
    const { id } = req.params;

    const project = await getProjectDetails(id);
    const organizations = await getAllOrganizations();

    res.render('edit-project', {
        title: 'Edit Project',
        project,
        organizations
    });
};

const processEditProjectForm = async (req, res) => {
    const { id } = req.params;

    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${id}`);
    }

    const { title, description, location, date, organizationId } = req.body;

    await updateProject(id, title, description, location, date, organizationId);

    req.flash('success', 'Project updated successfully!');
    res.redirect(`/project/${id}`);
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    processEditProjectForm,
    showEditProjectForm
};