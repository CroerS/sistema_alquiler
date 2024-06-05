import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import { ContratoAlquiler } from './contratoalquiler';

// const Inquilino = require('./Inquilino');
export const NotificacionPago = sequelize.define('NotificacionPago', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mensaje: {
        type: DataTypes.STRING(200)
    },
    estado: {
        type: DataTypes.TINYINT
    },
    fecha: {
        type: DataTypes.DATE
    },
    id_contrato: {
        type: DataTypes.INTEGER,
        // references: {
        //   model: ContratoAlquiler,
        //   key: 'id'
        // }
      }
    // Otros campos como monto del alquiler, frecuencia de pago, etc.
},
{
    timestamps: false,
});


// Define the association
NotificacionPago.belongsTo(ContratoAlquiler, { foreignKey: 'id_contrato' });
ContratoAlquiler.hasMany(NotificacionPago, { foreignKey: 'id_contrato' });