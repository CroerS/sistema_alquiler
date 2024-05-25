import { Request, Response } from 'express';
import { Inquilino } from '../models/inquilino';

//listar Registros
export const getInquilinos = async (req: Request, res: Response) => {
    const listInquilino = await Inquilino.findAll();

    res.json(listInquilino)
}

//Buscar Registro
export const GetInquilino = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Actualizamos cuartos en la base de datos
        const SetInquilino = await Inquilino.findOne({ where: { id } });
        
        if (SetInquilino) {
            res.status(200).json(SetInquilino);
        } else {
            res.status(404).json({
                msg: 'Inquilino no encontrado',
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
export const NewInquilino = async (req: Request, res: Response) => {
    const{ nombre, apellido }= req.body;
    try {
        // Guardarmos cuartos en la base de datos
        await Inquilino.create({
            nombre: nombre,
            apellido: apellido
        })
    
        res.json({
            msg: `Inquilino  ${nombre} creado exitosamente!`
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}

//Modificar Registro
export const UpdateInquilino = async (req: Request, res: Response) => {
    var { id } = req.params;
    var{ nombre, apellido}= req.body;

    try {
           // Buscar inquilino actual en la base de datos
           var existingInquilino = await Inquilino.findOne({ where: { id } });
        
           if (!existingInquilino) {
               return res.status(404).json({
                   msg: 'Registro no encontrado',
               });
           }
           
           // Actualizamos el cuartos en la base de datos
           const [updated] = await Inquilino.update({
               nombre: nombre,
               apellido: apellido
           }, { where: { id } });
   
           if (updated) {
               const updatedProduct = await Inquilino.findOne({ where: { id } });
               res.status(200).json({
                   msg: `Registro ${nombre} actualizado exitosamente!`,
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
export const DeleteInquilino = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Eliminar inquilinos en la base de datos
        const deleted = await Inquilino.destroy({
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