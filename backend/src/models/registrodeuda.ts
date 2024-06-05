import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import { ContratoAlquiler } from './contratoalquiler';

// const Inquilino = require('./Inquilino');
export const RegistroDeuda = sequelize.define('RegistroDeuda', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2)
    },
    fecha: {
        type: DataTypes.DATE
    },
    motivo: {
        type: DataTypes.STRING(200)
    },
    estado: {
        type: DataTypes.TINYINT
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
}
);


// Define the association
RegistroDeuda.belongsTo(ContratoAlquiler, { foreignKey: 'id_contrato' });
ContratoAlquiler.hasMany(RegistroDeuda, { foreignKey: 'id_contrato' });