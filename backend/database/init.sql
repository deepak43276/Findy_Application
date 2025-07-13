-- Create the database
CREATE DATABASE findy_db;

-- Connect to the database
\c findy_db;

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    job_title VARCHAR(255),
    experience_level VARCHAR(100),
    about TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_skills table
CREATE TABLE user_skills (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    skill VARCHAR(255),
    PRIMARY KEY (user_id, skill)
);

-- Create jobs table
CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    salary VARCHAR(100),
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    featured BOOLEAN DEFAULT FALSE,
    urgent BOOLEAN DEFAULT FALSE,
    remote BOOLEAN DEFAULT FALSE,
    application_email VARCHAR(255),
    application_deadline TIMESTAMP,
    accept_applications BOOLEAN DEFAULT TRUE
);

-- Create job_skills table
CREATE TABLE job_skills (
    job_id BIGINT REFERENCES jobs(id) ON DELETE CASCADE,
    skill VARCHAR(255),
    PRIMARY KEY (job_id, skill)
);

-- Insert sample data
INSERT INTO users (first_name, last_name, email, password, phone, location, job_title, experience_level, about) VALUES
('John', 'Doe', 'john.doe@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 (555) 123-4567', 'New York, NY', 'Senior Frontend Developer', 'Senior Level', 'Passionate frontend developer with 5+ years of experience building scalable web applications.'),
('Sarah', 'Johnson', 'sarah.johnson@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 (555) 234-5678', 'San Francisco, CA', 'UX Designer', 'Senior Level', 'Creative UX designer with expertise in user-centered design.'),
('Michael', 'Chen', 'michael.chen@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 (555) 345-6789', 'Austin, TX', 'Full Stack Developer', 'Senior Level', 'Full stack developer specializing in modern web applications.');

-- Insert sample user skills
INSERT INTO user_skills (user_id, skill) VALUES
(1, 'React'), (1, 'TypeScript'), (1, 'Node.js'), (1, 'Python'), (1, 'AWS'), (1, 'MongoDB'),
(2, 'Figma'), (2, 'Adobe XD'), (2, 'User Research'), (2, 'Prototyping'),
(3, 'React'), (3, 'Node.js'), (3, 'Python'), (3, 'AWS');

-- Insert sample jobs
INSERT INTO jobs (title, company, location, type, salary, description, requirements, benefits, featured, urgent, remote) VALUES
('Senior Frontend Developer', 'TechCorp Inc.', 'New York, NY', 'Full-time', '$120k - $160k', 'We''re looking for an experienced frontend developer to join our team and help build scalable web applications.', '5+ years of experience with React, TypeScript, and modern JavaScript frameworks.', 'Competitive salary, health insurance, 401k, flexible work hours, remote work options.', true, false, true),
('UX/UI Designer', 'Design Studio', 'San Francisco, CA', 'Full-time', '$100k - $140k', 'Join our creative team to design beautiful user experiences that delight our users.', '3+ years of experience with Figma, Adobe XD, and user research methodologies.', 'Competitive salary, health insurance, creative environment, professional development.', true, false, false),
('Backend Developer', 'StartupXYZ', 'Austin, TX', 'Contract', '$90k - $120k', 'Looking for a backend developer to build scalable systems and APIs.', '3+ years of experience with Node.js, PostgreSQL, and cloud platforms.', 'Competitive hourly rate, flexible schedule, remote work options.', false, true, true),
('Data Scientist', 'Analytics Co', 'Remote', 'Full-time', '$130k - $170k', 'Analyze complex datasets to drive business insights and improve decision making.', '5+ years of experience with Python, machine learning, and SQL.', 'Competitive salary, health insurance, 401k, remote work, professional development.', false, false, true);

-- Insert sample job skills
INSERT INTO job_skills (job_id, skill) VALUES
(1, 'React'), (1, 'TypeScript'), (1, 'Next.js'),
(2, 'Figma'), (2, 'Adobe XD'), (2, 'Prototyping'),
(3, 'Node.js'), (3, 'PostgreSQL'), (3, 'AWS'),
(4, 'Python'), (4, 'Machine Learning'), (4, 'SQL');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_jobs_featured ON jobs(featured);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at); 