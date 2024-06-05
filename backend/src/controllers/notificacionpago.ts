import { Request, Response } from 'express';
import { NotificacionPago} from '../models/notificacionpago';

//listar Registros
export const getNotificacionPagos = async (req: Request, res: Response) => {
    const listNotificacionPago = await NotificacionPago.findAll();

    res.json(listNotificacionPago)
}

//Buscar Registro
export const GetNotificacionPago = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Actualizamos contratoalquiler en la base de datos
        const SetNotificacionPago = await NotificacionPago.findOne({ where: { id } });
        
        if (SetNotificacionPago) {
            res.status(200).json(SetNotificacionPago);
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
export const NewNotificacionPago = async (req: Request, res: Response) => {
    const{ mensaje, estado, fecha, id_contrato }= req.body;
    try {
        // Guardarmos NotificacionPago la base de datos
        await NotificacionPago.create({
            mensaje: mensaje,
            estado: estado,
            fecha: fecha,
            id_contrato: id_contrato
        })
    
        res.json({
            msg: `NotificacionPago  ${mensaje} creado exitosamente!`
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}

//Modificar Registro
export const UpdateNotificacionPago = async (req: Request, res: Response) => {
    var { id } = req.params;
    var{ mensaje, estado, fecha, id_contrato }= req.body;

    try {
           // Buscar el cuartos actual en la base de datos
           var existingRegistroDeuda = await NotificacionPago.findOne({ where: { id } });
        
           if (!existingRegistroDeuda) {
               return res.status(404).json({
                   msg: 'Registro no encontrado',
               });
           }
           
           // Actualizamos el cuartos en la base de datos
           const [updated] = await NotificacionPago.update({
               mensaje: mensaje,
               estado: estado,
               fecha: fecha,
               id_contrato: id_contrato
           }, { where: { id } });
   
           if (updated) {
               const updatedProduct = await NotificacionPago.findOne({ where: { id } });
               res.status(200).json({
                   msg: `Registro ${mensaje} actualizado exitosamente!`,
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
export const DeleteNotificacionPago = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Eliminar registrodeuda en la base de datos
        const deleted = await NotificacionPago.destroy({
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