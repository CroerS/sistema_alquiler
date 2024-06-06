import { Request, Response } from 'express';
import { Deuda} from '../models/deuda';

//listar Registros
export const getDeudas = async (req: Request, res: Response) => {
    const listDeuda = await Deuda.findAll();

    res.json(listDeuda)
}

//Buscar Registro
export const GetDeuda = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Actualizamos contratoalquiler en la base de datos
        const SetDeuda = await Deuda.findOne({ where: { id } });
        
        if (SetDeuda) {
            res.status(200).json(SetDeuda);
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
export const NewDeuda = async (req: Request, res: Response) => {
    const{ monto_deuda, mes, estado, id_contrato }= req.body;
    try {
        // Guardarmos RegistroDeudas en la base de datos
        await Deuda.create({
            monto_deuda: monto_deuda,
            mes: mes,
            estado: estado,
            id_contrato: id_contrato
        })
    
        res.json({
            msg: `Deuda  ${monto_deuda} creado exitosamente!`
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}

//Modificar Registro
export const UpdateDeuda = async (req: Request, res: Response) => {
    var { id } = req.params;
    var{ monto_deuda, mes, estado, id_contrato }= req.body;

    try {
           // Buscar el cuartos actual en la base de datos
           var existingRegistroDeuda = await Deuda.findOne({ where: { id } });
        
           if (!existingRegistroDeuda) {
               return res.status(404).json({
                   msg: 'Registro no encontrado',
               });
           }
           
           // Actualizamos el cuartos en la base de datos
           const [updated] = await Deuda.update({
               monto_deuda: monto_deuda,
               mes: mes,
               estado: estado,
               id_contrato: id_contrato
           }, { where: { id } });
   
           if (updated) {
               const updatedProduct = await Deuda.findOne({ where: { id } });
               res.status(200).json({
                   msg: `Registro ${monto_deuda} actualizado exitosamente!`,
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
export const DeleteDeuda = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Eliminar registrodeuda en la base de datos
        const deleted = await Deuda.destroy({
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