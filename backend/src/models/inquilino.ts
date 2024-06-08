import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const Inquilino = sequelize.define('inquilino', {
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
    },
    telefono: {
        type: DataTypes.STRING(15)
    }
    // Otros campos relevantes como dirección, teléfono, etc.
},
{
    timestamps: false,
});
