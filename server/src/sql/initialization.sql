-- Initialization on startup
-- This should only be used when the MySQL database is empty

-- Create new database SmartSwitch
create database SmartSwitch;
use SmartSwitch;

-- create all tables required
CREATE TABLE User (
    username varchar(20),
    password varchar(255),
	refreshToken varchar(255)
);

CREATE TABLE VehicleModel (
	id  int PRIMARY KEY,
	brand varchar(255),
	model varchar(255),
	chargeRate float,
	batteryCap float,
	consumptionCityCold float,
	consumptionCityMild float,
	consumptionHighwayCold float,
	consumptionHighwayMild float,
	consumptionCombCold float,
	consumptionCombMild float
);

CREATE TABLE UserVehicle (
	id  int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name varchar(255),
	modelID int,
	soc int,
	isDoneCharging tinyint,
	departure datetime,
	distance int,
	route varchar(255),
	CONSTRAINT UserVehicleModelReference FOREIGN KEY (modelID) REFERENCES VehicleModel(id) 
);

ALTER TABLE UserVehicle AUTO_INCREMENT=1;

CREATE TABLE Port (
	id  int PRIMARY KEY,
	ranking int,
	vehicleID int,
	isCharging tinyint,
	isConnected tinyint,
	CONSTRAINT PortUserVehicleReference FOREIGN KEY (vehicleID) REFERENCES UserVehicle(id) 
);

CREATE TABLE Location (
	id  int PRIMARY KEY,
	name varchar(255)
);

CREATE TABLE config (
	type varchar(255),
	value int,
	CONSTRAINT LocationConfigReference FOREIGN KEY (value) REFERENCES Location(id) 
);

-- INSERT the default values

-- VehicleModel
-- id, brand, model, chargeRate, batteryCap, CityCold, CityMild, HighwayCold, HighwayMild, CombCold, CombMild
INSERT INTO VehicleModel VALUES (1, 'Tesla', 'Model 3', 13, 53, 320, 505, 245, 325, 285, 400);
INSERT INTO VehicleModel VALUES (2, 'Tesla', 'Model S', 12, 95, 500, 755, 390, 505, 445, 615);
INSERT INTO VehicleModel VALUES (3, 'Nissan', 'LEAF', 12, 40, 220, 335, 160, 205, 190, 260);
INSERT INTO VehicleModel VALUES (4, 'Hyundai', 'IONIQ', 13, 40.4, 235, 365, 175, 230, 205, 290);

-- Port
INSERT INTO Port VALUES (0, NULL, NULL, 0, 0);
INSERT INTO Port VALUES (1, NULL, NULL, 0, 0);
INSERT INTO Port VALUES (2, NULL, NULL, 0, 0);
INSERT INTO Port VALUES (3, NULL, NULL, 0, 0);

INSERT INTO Location VALUES (0, "Waterloo");
INSERT INTO Location VALUES (1, "Toronto");

INSERT INTO config VALUES ("location", 0);
INSERT INTO config VALUES ("eco", 0);
