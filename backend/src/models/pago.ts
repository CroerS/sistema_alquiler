import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import { Deuda } from './deuda';

// const Inquilino = require('./Inquilino');
export const Pago = sequelize.define('Pago', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    monto_pagado: {
        type: DataTypes.DECIMAL(10, 2)
    },
    metodo_pago: {
        type: DataTypes.STRING(50)
    },
    fecha: {
        type: DataTypes.DATE
    },
    id_deuda: {
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
Deuda.hasMany(Pago, { foreignKey: 'id_deuda' });
Pago.belongsTo(Deuda, { foreignKey: 'id_deuda' });
