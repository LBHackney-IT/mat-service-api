/* Replace with your SQL commands */
CREATE TABLE Users(
  Id SERIAL PRIMARY KEY NOT NULL,
	EmailAddress TEXT NOT NULL,
	UserCRMId TEXT NOT NULL,
  GoogleId TEXT NOT NULL,
  UserName TEXT NOT NULL
)
