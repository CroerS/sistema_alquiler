import { Request, Response } from 'express';
import { Pago} from '../models/pago';

//listar Registros
export const getPagos = async (req: Request, res: Response) => {
    const listPago = await Pago.findAll();

    res.json(listPago)
}

//Buscar Registro
export const GetPago = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Actualizamos pago en la base de datos
        const SetPago = await Pago.findOne({ where: { id } });
        
        if (SetPago) {
            res.status(200).json(SetPago);
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
export const NewPago = async (req: Request, res: Response) => {
    const{ monto_pagado, metodo_pago, fecha, id_contrato }= req.body;
    try {
        // Guardarmos cuartos en la base de datos
        await Pago.create({
            monto_pagado,
            metodo_pago: metodo_pago,
            fecha: fecha,
            id_contrato: id_contrato
        })
    
        res.json({
            msg: `Pago  ${monto_pagado} creado exitosamente!`
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}

//Modificar Registro
export const UpdatePago = async (req: Request, res: Response) => {
    var { id } = req.params;
    var{ monto_pagado, metodo_pago, fecha, id_contrato }= req.body;

    try {
           // Buscar el pago actual en la base de datos
           var existingContratoAlquiler = await Pago.findOne({ where: { id } });
        
           if (!existingContratoAlquiler) {
               return res.status(404).json({
                   msg: 'Registro no encontrado',
               });
           }
           
           // Actualizamos el pagos en la base de datos
           const [updated] = await Pago.update({
               monto_pagado: monto_pagado,
               metodo_pago: metodo_pago,
               fecha: fecha,
               id_contrato: id_contrato
           }, { where: { id } });
   
           if (updated) {
               const updatedProduct = await Pago.findOne({ where: { id } });
               res.status(200).json({
                   msg: `Registro ${monto_pagado} actualizado exitosamente!`,
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
export const DeletePago = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Eliminar pagos en la base de datos
        const deleted = await Pago.destroy({
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