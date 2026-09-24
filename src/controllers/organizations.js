import { getAllOrganizations, getOrganizationById } from '../models/organizations.js';

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const { id } = req.params;
    const organization = await getOrganizationById(id);
    const title = organization ? organization.name : 'Organization';
    res.render('organization', { title, organization });
};

export { showOrganizationsPage, showOrganizationDetailsPage };