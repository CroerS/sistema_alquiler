import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import { ContratoAlquiler } from './contratoalquiler';

// const Inquilino = require('./Inquilino');
export const Pago = sequelize.define('Pago', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2)
    },
    metodopago: {
        type: DataTypes.STRING(50)
    },
    fecha: {
        type: DataTypes.DATE
    },
    id_contrato: {
        type: DataTypes.INTEGER,
        references: {
          model: ContratoAlquiler,
          key: 'id'
        }
      }
    // Otros campos como monto del alquiler, frecuencia de pago, etc.
});


// Define the association
Pago.belongsTo(ContratoAlquiler, { foreignKey: 'id_contrato' });
ContratoAlquiler.hasMany(Pago, { foreignKey: 'id_contrato' });