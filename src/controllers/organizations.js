import { getAllOrganizations, getOrganizationById, getProjectsByOrganizationId } from '../models/organizations.js';

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
export { showOrganizationsPage, showOrganizationDetailsPage };