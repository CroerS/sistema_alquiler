import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import { Cuarto } from './cuartos';
import { Inquilino } from './inquilino';

// const Inquilino = require('./Inquilino');
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
    estado: {
        type: DataTypes.BOOLEAN
    },
    mesesadelanto: {
        type: DataTypes.INTEGER,
        defaultValue:0
    },
    pagoadelanto: {
        type: DataTypes.DECIMAL(10,2)
    },
    id_inquilino: {
        type: DataTypes.INTEGER,
        // references: {
        //     model: Inquilino, // Asegúrate de que coincida con el nombre del modelo
        //     key: 'id'
        // }
    },
    id_cuarto: {
        type: DataTypes.INTEGER,
        // references: {
        //   model: Cuarto,
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
Inquilino.hasOne(ContratoAlquiler, { foreignKey: 'id_inquilino' });
ContratoAlquiler.belongsTo(Inquilino, { foreignKey: 'id_inquilino' });

Cuarto.hasOne(ContratoAlquiler, { foreignKey: 'id_cuarto' });
ContratoAlquiler.belongsTo(Cuarto, { foreignKey: 'id_cuarto' });

