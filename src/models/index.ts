import * as sequelize from 'sequelize';
import {ReservationsFactory} from "./reservation-model";

export const dbConfig = new sequelize.Sequelize(
    (process.env.DB_NAME = "reservations"),
    (process.env.DB_USER = "root"),
    (process.env.DB_PASSWORD = "Brilliant8!"),  
    {
        port: Number(process.env.DB_PORT) || 3306,
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000,
        },
    }
);

// THESE ONES ARE THE ONES YOU NEED TO USE ON YOUR CONTROLLERS
export const Reservations = ReservationsFactory(dbConfig)
