import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const Cuarto = sequelize.define('cuarto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero: {
        type: DataTypes.INTEGER
    },
    descripcion: {
        type: DataTypes.STRING(200)
    },
    dimension: {
        type: DataTypes.STRING(20)
    },
    costo: {
        type: DataTypes.DECIMAL(10,2)
    }
    // Otros campos relevantes como tamaño, comodidades, etc.
},
{
    timestamps: false,
});