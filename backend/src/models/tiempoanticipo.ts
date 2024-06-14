import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import { ContratoAlquiler } from './contratoalquiler';

// contruccion de la tabla TiempoAnticipo
export const TiempoAnticipo = sequelize.define('TiempoAnticipo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    mes:{
        type: DataTypes.STRING(20)
    },
    gestion:{
        type: DataTypes.STRING(20)
    },
   id_contrato: {
        type: DataTypes.INTEGER,
      }
},
{
    timestamps: false,
}
);

// Define the association
ContratoAlquiler.hasMany(TiempoAnticipo, { foreignKey: 'id_contrato' });
TiempoAnticipo.belongsTo(ContratoAlquiler, { foreignKey: 'id_contrato' });
