import { Request, Response } from 'express';
import { TiempoAnticipo} from '../models/tiempoanticipo';
import { appService } from '../servicios/app.service';

//listar Registros
export const getTiempoAnticipo = async (req: Request, res: Response) => {
    const listDeuda = await TiempoAnticipo.findAll({  order: [['id_contrato', 'ASC'],['fecha', 'ASC']]});
    res.json(listDeuda)
}

//Buscar Registro
export const GetTiempoAnticipo = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Actualizamos contratoalquiler en la base de datos
        const SetTiempoAnticipo = await TiempoAnticipo.findOne({ where: { id } });
        
        if (SetTiempoAnticipo) {
            res.status(200).json(SetTiempoAnticipo);
        } else {
            res.status(404).json({
                msg: 'descripcion no encontrado',
            });
        }

    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}

//Guardar Registro
export const NewTiempoAnticipo = async (req: Request, res: Response) => {
    const{ mes, gestion, id_contrato }= req.body;
    try {
        // Guardarmos RegistroDeudas en la base de datos
        await TiempoAnticipo.create({
            mes: mes,
            gestion: gestion,
            id_contrato: id_contrato
        })
    
        res.json({
            msg: `TiempoAnticipo  ${mes} creado exitosamente!`
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}

//Modificar Registro
export const UpdateTiempoAnticipo = async (req: Request, res: Response) => {
    var { id } = req.params;
    var{ mes, gestion, id_contrato }= req.body;

    try {
           // Buscar el cuartos actual en la base de datos
           var existingTiempoAnticipo = await TiempoAnticipo.findOne({ where: { id } });
        
           if (!existingTiempoAnticipo) {
               return res.status(404).json({
                   msg: 'Registro no encontrado',
               });
           }
           
           // Actualizamos el cuartos en la base de datos
           const [updated] = await TiempoAnticipo.update({
                mes: mes,
                gestion: gestion,
                id_contrato: id_contrato
           }, { where: { id } });
   
           if (updated) {
               const updatedProduct = await TiempoAnticipo.findOne({ where: { id } });
               res.status(200).json({
                   msg: `Registro ${mes} actualizado exitosamente!`,
                   product: updatedProduct
               });
           } else {
               res.status(200).json({
                msg: 'No hay cambios para actualizar',
               });
           }

    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}

//Eliminar Registro
export const DeleteDTiempoAnticipo = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Eliminar registrodeuda en la base de datos
        const deleted = await TiempoAnticipo.destroy({
            where: { id }
        });
    
        if (deleted) {
            res.status(200).json({
                msg: `Registro con ID ${id} eliminado exitosamente!`
            });
        } else {
            res.status(404).json({
                msg: 'Dato no encontrado',
            });
        }

    } catch (error) {
        res.status(400).json({
            msg: 'Upps, ocurrió un error',
            error
        })
    }
}