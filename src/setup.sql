CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization (organization_id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

SELECT * FROM organization

INSERT INTO service_projects (organization_id, title, description, location, date) VALUES
-- Organization 1
(1, 'Community Garden Build', 'Volunteers construct raised garden beds for a neighborhood food-access program.', 'Rexburg, ID', '2026-04-11'),
(1, 'Winter Coat Drive', 'Collect and distribute donated winter coats to families in need before the cold season.', 'Idaho Falls, ID', '2026-11-05'),
(1, 'Senior Center Tech Help', 'Volunteers help elderly residents learn to use tablets and smartphones for staying connected.', 'Rexburg, ID', '2026-02-20'),
(1, 'River Cleanup Day', 'Removing litter and debris along the Snake River walking trail.', 'Idaho Falls, ID', '2026-05-16'),
(1, 'Food Bank Sorting Event', 'Sorting and packaging donated food items for weekly distribution.', 'Rexburg, ID', '2026-03-08'),

-- Organization 2
(2, 'Youth Literacy Program', 'One-on-one reading support for elementary students below grade level.', 'Boise, ID', '2026-01-14'),
(2, 'Habitat Restoration Hike', 'Trail maintenance and native plant restoration in a local nature reserve.', 'Boise, ID', '2026-06-21'),
(2, 'School Supply Packing', 'Assembling backpacks with school supplies for low-income families.', 'Meridian, ID', '2026-08-02'),
(2, 'Community Meal Service', 'Preparing and serving meals at a local shelter.', 'Boise, ID', '2026-04-25'),
(2, 'Park Beautification Project', 'Planting flowers and repainting benches in a public park.', 'Meridian, ID', '2026-05-30'),

-- Organization 3
(3, 'Animal Shelter Volunteer Day', 'Walking dogs, cleaning kennels, and socializing shelter animals.', 'Pocatello, ID', '2026-03-19'),
(3, 'Home Repair for Elderly', 'Minor home repairs and yard work for elderly residents who cannot do it themselves.', 'Pocatello, ID', '2026-07-11'),
(3, 'Blood Drive Coordination', 'Organizing and staffing a community blood donation event.', 'Chubbuck, ID', '2026-09-09'),
(3, 'Clothing Swap Event', 'Hosting a free community clothing exchange to reduce textile waste.', 'Pocatello, ID', '2026-10-03'),
(3, 'Trail Building Weekend', 'Constructing a new section of accessible hiking trail.', 'Chubbuck, ID', '2026-06-06');

-- ======================
-- Categories
-- ======================

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Junction table (many-to-many)
CREATE TABLE project_categories (
    project_id INTEGER NOT NULL REFERENCES service_projects(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- Insert at least 3 categories
INSERT INTO categories (name) VALUES
('Community Development'),
('Education & Mentoring'),
('Environmental Stewardship'),
('Health & Wellness'),
('Animal Welfare');

-- Associate every project with at least one category
-- (Assumes your service_projects have project_id 1–15)
INSERT INTO project_categories (project_id, category_id) VALUES
-- Organization 1 projects
(1, 1), (1, 3),          -- Community Garden Build
(2, 1),                  -- Winter Coat Drive
(3, 2),                  -- Senior Center Tech Help
(4, 3),                  -- River Cleanup Day
(5, 1),                  -- Food Bank Sorting Event

-- Organization 2 projects
(6, 2),                  -- Youth Literacy Program
(7, 3),                  -- Habitat Restoration Hike
(8, 2),                  -- School Supply Packing
(9, 1), (9, 4),          -- Community Meal Service
(10, 1), (10, 3),        -- Park Beautification Project

-- Organization 3 projects
(11, 5),                 -- Animal Shelter Volunteer Day
(12, 1),                 -- Home Repair for Elderly
(13, 4),                 -- Blood Drive Coordination
(14, 1),                 -- Clothing Swap Event
(15, 3);                 -- Trail Building Weekend