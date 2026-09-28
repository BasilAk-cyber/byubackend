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
    const sql = `
        INSERT INTO projects (title, description, location, date, organization_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
        title,
        description,
        location,
        date,
        organizationId
    ]);

    return result.insertId;
};

const assignCategoryToProject = async (projectId, categoryId) => {
    const sql = `
        INSERT INTO project_categories (project_id, category_id)
        VALUES (?, ?)
    `;
    await pool.query(sql, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    await pool.query(
        'DELETE FROM project_categories WHERE project_id = ?',
        [projectId]
    );

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

const updateProject = async (id, title, description, location, date, organizationId) => {
    const sql = `
        UPDATE projects
        SET title = ?,
            description = ?,
            location = ?,
            date = ?,
            organization_id = ?
        WHERE id = ?
    `;

    const [result] = await pool.query(sql, [
        title,
        description,
        location,
        date,
        organizationId,
        id
    ]);

    if (result.affectedRows === 0) {
        throw new Error('Project not found');
    }
};

export { getUpcomingProjects, getProjectDetails,createProject, updateCategoryAssignments, updateProject };