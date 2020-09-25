CREATE TABLE itv_tasks(
  id SERIAL PRIMARY KEY NOT NULL,
	tag_ref   VARCHAR(16) NOT NULL,
	created    TIMESTAMP NOT NULL,
	crm_id    VARCHAR(36) NOT NULL
);

CREATE INDEX TenancyTasksDateCreatedIdx ON itv_tasks(created);