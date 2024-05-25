import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const Inquilino = sequelize.define('Inquilino', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100)
    },
    apellido: {
        type: DataTypes.STRING(200)
    }
    // Otros campos relevantes como dirección, teléfono, etc.
},
{
    timestamps: false,
});
