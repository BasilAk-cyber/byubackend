import db from './db.js'

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

export { getAllProjects }  