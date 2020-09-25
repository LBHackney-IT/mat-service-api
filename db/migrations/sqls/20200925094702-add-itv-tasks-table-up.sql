CREATE TABLE ITVTasks(
  Id SERIAL PRIMARY KEY NOT NULL,
	TagRef   VARCHAR(16) NOT NULL,
	DateCreated    DATE NOT NULL DEFAULT NOW()
);

CREATE INDEX TenancyTasksDateCreatedIdx ON ITVTasks(DateCreated);