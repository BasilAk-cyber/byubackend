import db from './db.js'

const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getOrganizationById = async (id) => {
  const query = `
      SELECT
          organization_id,
          name,
          description,
          contact_email,
          logo_filename
      FROM organization
      WHERE organization_id = $1
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const getProjectsByOrganizationId = async (id) => {
  const query = `
      SELECT project_id, title, date, location
      FROM service_projects
      WHERE organization_id = $1
      ORDER BY date
  `;
  const result = await db.query(query, [id]);
  return result.rows;
};

export { getAllOrganizations, getOrganizationById, getProjectsByOrganizationId };