import { DataTypes, Sequelize } from 'sequelize';
import { ReservationsStatic } from '../types/api-rest';

export function ReservationsFactory (sequelize: Sequelize): ReservationsStatic {
    return <ReservationsStatic>sequelize.define("reservations", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        location:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
}