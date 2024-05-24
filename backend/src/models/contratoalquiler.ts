import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const ContratoAlquiler = sequelize.define('ContratoAlquiler', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_inicio: {
        type: DataTypes.DATE
    },
    fecha_fin: {
        type: DataTypes.DATE
    },
    inquilinoId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Inquilino',
            key: 'id'
        }
    },
    cuartoId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Cuarto',
            key: 'id'
        }
    }
    // Otros campos como monto del alquiler, frecuencia de pago, etc.
});