ALTER TABLE itv_tasks ADD CONSTRAINT ItvTasksUniqueConstraint UNIQUE(tag_ref, created);