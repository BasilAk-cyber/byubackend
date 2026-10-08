import { getAllOrganizations, getOrganizationById, getProjectsByOrganizationId, createOrganization, updateOrganization } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
        body('contactEmail')
        .trim()
        .notEmpty().withMessage('Contact email is required')
        .isEmail().withMessage('Please provide a valid email address'),
    body('logoFilename')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 255 }).withMessage('Logo filename cannot exceed 255 characters')
];

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const { id } = req.params;
    const organization = await getOrganizationById(id);
    const projects = await getProjectsByOrganizationId(id);
    res.render('organization', {
        title: organization ? organization.name : 'Organization',
        organization,
        projects
    });
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};

const processNewOrganizationForm = async (req, res) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png';

    const organizationId = await createOrganization(
        name,
        description,
        contactEmail,
        logoFilename
    );

    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res) => {
    const { id } = req.params;
    const organizationDetails = await getOrganizationById(id);

    console.log(organizationDetails);

    res.render('edit-organization', {
        title: 'Edit Organization',
        organizationDetails
    });
};

const processEditOrganizationForm = async (req, res) => {
    const { id } = req.params;

    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-organization/${id}`);
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = req.body.logoFilename?.trim() || 'placeholder-logo.png';

    await updateOrganization(id, name, description, contactEmail, logoFilename);

    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${id}`);
};

export { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm };