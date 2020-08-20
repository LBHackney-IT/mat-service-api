/*All housing areas*/
INSERT INTO HousingArea(AreaId, Name) VALUES (1, 'Central');
INSERT INTO HousingArea(AreaId, Name) VALUES (2, 'Clapton');
INSERT INTO HousingArea(AreaId, Name) VALUES (3, 'Homerton 1');
INSERT INTO HousingArea(AreaId, Name) VALUES (4, 'Homerton 2');
INSERT INTO HousingArea(AreaId, Name) VALUES (5, 'Shoreditch');
INSERT INTO HousingArea(AreaId, Name) VALUES (6, 'Stamford Hill');
INSERT INTO HousingArea(AreaId, Name) VALUES (7, 'Stoke Newington');

/*Sample TRAs for area 1 (traid is fk to pk in HousingArea table, not the actual given area id)*/
INSERT INTO TRA(traid, name, areaid, email) VALUES(1, 'Alden and Broadway TRA', 2, 'sample1@sample.com');
INSERT INTO TRA(traid, name, areaid, email) VALUES(2, 'Blackstone Estate TRA', 2, 'sample2@sample.com');
INSERT INTO TRA(traid, name, areaid, email) VALUES(3, 'De Beauvoir TRA', 2, 'sample3@sample.com');
INSERT INTO TRA(traid, name, areaid, email) VALUES(4, 'Lockner Estate TRA', 2, 'sample4@sample.com');
INSERT INTO TRA(traid, name, areaid, email) VALUES(7, 'Regent Estate TRA', 2, 'sample5@sample.com');


/*Sample patch associations (traid is fk to pk in traid table, not the given tra id)*/
INSERT INTO trapatchassociation(traid, patchcrmid) VALUES(4, '700aa678-df4d-e811-8122-70106faa1531');
INSERT INTO trapatchassociation(traid, patchcrmid) VALUES(5, '46a2d989-df4d-e811-8122-70106faa1531');
INSERT INTO trapatchassociation(traid, patchcrmid) VALUES(6, '083d7292-df4d-e811-8122-70106faa1531');
INSERT INTO trapatchassociation(traid, patchcrmid) VALUES(7, '700aa678-df4d-e811-8122-70106faa1531');