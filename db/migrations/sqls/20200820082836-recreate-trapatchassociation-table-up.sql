/* Replace with your SQL commands */
CREATE TABLE TRAPatchAssociation(
    Id SERIAL PRIMARY KEY NOT NULL,
	TRAId INTEGER NOT NULL,
	PatchCRMId TEXT NOT NULL
)