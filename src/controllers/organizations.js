import { getAllOrganizations, getOrganizationById, getProjectsByOrganizationId, createOrganization } from '../models/organizations.js';

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
    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    res.redirect(`/organization/${organizationId}`);
};
export { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm };