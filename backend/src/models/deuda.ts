import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import { ContratoAlquiler } from './contratoalquiler';

// const Inquilino = require('./Inquilino');
export const Deuda = sequelize.define('Deuda', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    monto_deuda: {
        type: DataTypes.DECIMAL(10, 2)
    },
    mes:{
        type: DataTypes.STRING(20)
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
ContratoAlquiler.hasMany(Deuda, { foreignKey: 'id_contrato' });
Deuda.belongsTo(ContratoAlquiler, { foreignKey: 'id_contrato' });
