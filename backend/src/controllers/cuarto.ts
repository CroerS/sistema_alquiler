import { Request, Response } from 'express';
import { Cuarto } from '../models/cuartos';

//listar Registros
export const getCuartos = async (req: Request, res: Response) => {
    const listCuartos = await Cuarto.findAll();

    res.json(listCuartos)
}

//Buscar Registro
export const GetCuarto = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Actualizamos cuartos en la base de datos
        const SetCuarto = await Cuarto.findOne({ where: { id } });
        
        if (SetCuarto) {
            res.status(200).json(SetCuarto);
        } else {
            res.status(404).json({
                msg: 'Cuarto no encontrado',
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
export const NewCuarto = async (req: Request, res: Response) => {
    const{ numero, descripcion, dimension, costo }= req.body;
    try {
        // Guardarmos cuartos en la base de datos
        await Cuarto.create({
            numero: numero,
            descripcion: descripcion,
            dimension: dimension,
            costo: costo
        })
    
        res.json({
            msg: `Cuarto  ${numero} creado exitosamente!`
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}

//Modificar Registro
export const UpdateCuarto = async (req: Request, res: Response) => {
    var { id } = req.params;
    var{ numero, descripcion,  dimension, costo}= req.body;

    try {
           // Buscar el cuartos actual en la base de datos
           var existingCuarto = await Cuarto.findOne({ where: { id } });
        
           if (!existingCuarto) {
               return res.status(404).json({
                   msg: 'Registro no encontrado',
               });
           }
           
           // Actualizamos el cuartos en la base de datos
           const [updated] = await Cuarto.update({
               numero: numero,
               descripcion: descripcion,
               dimension: dimension,
               costo: costo
           }, { where: { id } });
   
           if (updated) {
               const updatedProduct = await Cuarto.findOne({ where: { id } });
               res.status(200).json({
                   msg: `Registro ${numero} actualizado exitosamente!`,
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
export const DeleteCuarto = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Eliminar cuartos en la base de datos
        const deleted = await Cuarto.destroy({
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