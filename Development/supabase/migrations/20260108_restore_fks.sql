-- Restore FKs

-- Re-add user_id FK (UUID -> UUID)
ALTER TABLE active_projects
ADD CONSTRAINT active_projects_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id);

-- Re-add project_id FKs (TEXT -> TEXT)
-- Note: referenced table active_projects must have unique constraint on id? It is PK, so yes.
ALTER TABLE appointments
ADD CONSTRAINT appointments_project_id_fkey
FOREIGN KEY (project_id) REFERENCES active_projects(id);

ALTER TABLE invoices
ADD CONSTRAINT invoices_project_id_fkey
FOREIGN KEY (project_id) REFERENCES active_projects(id);
