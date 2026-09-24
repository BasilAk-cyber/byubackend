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

export { getAllProjects, getUpcomingProjects, getProjectDetails };