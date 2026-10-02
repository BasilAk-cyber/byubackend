import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT 
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.date,
            o.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o 
            ON sp.organization_id = o.organization_id
        ORDER BY sp.date;
    `;

    const result = await db.query(query);
    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.date,
            sp.location,
            o.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.date >= CURRENT_DATE
        ORDER BY sp.date ASC
        LIMIT $1
    `;

    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.date,
            sp.location,
            o.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO service_projects (title, description, location, date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id
    `;

    const result = await db.query(query, [
        title,
        description,
        location,
        date,
        organizationId
    ]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    return result.rows[0].project_id;
};

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO project_categories (project_id, category_id)
        VALUES ($1, $2)
    `;
    await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const ids = []
        .concat(categoryIds ?? [])
        .map((id) => String(id).trim())
        .filter((id) => id !== '')
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id));

    await db.query(
        'DELETE FROM project_categories WHERE project_id = $1',
        [projectId]
    );

    for (const categoryId of ids) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

const updateProject = async (id, title, description, location, date, organizationId) => {
    const query = `
        UPDATE service_projects
        SET title = $1,
            description = $2,
            location = $3,
            date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id
    `;

    const result = await db.query(query, [
        title,
        description,
        location,
        date,
        organizationId,
        id
    ]);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    return result.rows[0].project_id;
};

export { getUpcomingProjects, getProjectDetails,createProject, updateCategoryAssignments, updateProject };