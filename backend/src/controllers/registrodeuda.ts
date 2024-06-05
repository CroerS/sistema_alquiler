import { Request, Response } from 'express';
import { RegistroDeuda} from '../models/registrodeuda';

//listar Registros
export const getRegistroDeudas = async (req: Request, res: Response) => {
    const listRegistroDeuda = await RegistroDeuda.findAll();

    res.json(listRegistroDeuda)
}

//Buscar Registro
export const GetRegistroDeuda = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Actualizamos contratoalquiler en la base de datos
        const SetRegistroDeuda = await RegistroDeuda.findOne({ where: { id } });
        
        if (SetRegistroDeuda) {
            res.status(200).json(SetRegistroDeuda);
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
export const NewRegistroDeuda = async (req: Request, res: Response) => {
    const{ monto, estado, fecha, id_contrato }= req.body;
    try {
        // Guardarmos RegistroDeudas en la base de datos
        await RegistroDeuda.create({
            monto: monto,
            estado: estado,
            fecha: fecha,
            id_contrato: id_contrato
        })
    
        res.json({
            msg: `RegistroDeuda  ${monto} creado exitosamente!`
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}

//Modificar Registro
export const UpdateRegistroDeuda = async (req: Request, res: Response) => {
    var { id } = req.params;
    var{ monto, estado, fecha, id_contrato}= req.body;

    try {
           // Buscar el cuartos actual en la base de datos
           var existingRegistroDeuda = await RegistroDeuda.findOne({ where: { id } });
        
           if (!existingRegistroDeuda) {
               return res.status(404).json({
                   msg: 'Registro no encontrado',
               });
           }
           
           // Actualizamos el cuartos en la base de datos
           const [updated] = await RegistroDeuda.update({
               monto: monto,
               estado: estado,
               fecha: fecha,
               id_contrato: id_contrato
           }, { where: { id } });
   
           if (updated) {
               const updatedProduct = await RegistroDeuda.findOne({ where: { id } });
               res.status(200).json({
                   msg: `Registro ${monto} actualizado exitosamente!`,
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
export const DeleteRegistroDeuda = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Eliminar registrodeuda en la base de datos
        const deleted = await RegistroDeuda.destroy({
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