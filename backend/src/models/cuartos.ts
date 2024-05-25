import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const Cuarto = sequelize.define('cuarto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero: {
        type: DataTypes.STRING(50)
    },
    ubicacion: {
        type: DataTypes.STRING(200)
    }
    // Otros campos relevantes como tamaño, comodidades, etc.
},
{
    timestamps: false,
});