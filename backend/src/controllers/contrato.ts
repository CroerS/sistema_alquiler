import { Request, Response } from 'express';
import { ContratoAlquiler} from '../models/contratoalquiler';
import { Inquilino} from '../models/inquilino';
import { Cuarto} from '../models/cuartos';
import { appService } from '../servicios/app.service';
//listar Registros
export const getContraAlquilers = async (req: Request, res: Response) => {
    const listContratoAlquiler = await ContratoAlquiler.findAll({
        include: [
            { model: Inquilino },
            { model: Cuarto }
        ]
    });
    res.json(listContratoAlquiler)
}

//Buscar Registro
export const GetContratoAlquiler = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Actualizamos contratoalquiler en la base de datos
        const SetContratoAlquiler = await ContratoAlquiler.findOne({ where: { id } });
        
        if (SetContratoAlquiler) {
            res.status(200).json(SetContratoAlquiler);
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
export const NewContratoAlquiler = async (req: Request, res: Response) => {
    const{ fecha_inicio, fecha_fin, estado,mesesadelanto, pagoadelanto, id_inquilino, id_cuarto }= req.body;
    try {
        const id = id_cuarto;
        // Guardarmos cuartos en la base de datos
        const creado =  await ContratoAlquiler.create({
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            estado: estado,
            mesesadelanto: mesesadelanto,
            pagoadelanto: pagoadelanto,
            id_inquilino: id_inquilino,
            id_cuarto: id_cuarto,
        })
        if(creado){
             // Actualizamos el estado del cuarto
            await Cuarto.update({ estado: false}, { where: { id } });
        }
    
        res.json({
            msg: `Contrato de Alquiler creado exitosamente!`
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}

//Modificar Registro
export const UpdateContratoAlquiler = async (req: Request, res: Response) => {
    var { id } = req.params;
    var{ fecha_inicio, fecha_fin,estado,mesesadelanto, pagoadelanto, id_inquilino, id_cuarto}= req.body;

    try {
           // Buscar el cuartos actual en la base de datos
           var existingContratoAlquiler = await ContratoAlquiler.findOne({ where: { id } });

           if (!existingContratoAlquiler) {
               return res.status(404).json({
                   msg: 'Registro no encontrado',
               });
           }
           
           // Actualizamos el cuartos en la base de datos
           const [updated] = await ContratoAlquiler.update({
               fecha_inicio: fecha_inicio,
               fecha_fin: fecha_fin,
               estado: estado,
               mesesadelanto:mesesadelanto,
               pagoadelanto:pagoadelanto,
               id_inquilino: id_inquilino,
               id_cuarto: id_cuarto
           }, { where: { id } });
   
           if (updated) {
                const obtejo= await ContratoAlquiler.findOne({ where: { id } });
                // Actualizamos el estado del cuarto

               res.status(200).json({
                   msg: `Registro ${fecha_inicio} actualizado exitosamente!`,
                   contrato: obtejo
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
export const DeleteContratoAlquiler = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleted = await ContratoAlquiler.destroy({
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

//actualizar estado de cuarto
export const actualizarEstado = async (req: Request, res: Response) => {
    var { id } = req.params;
    var{estado}= req.body;
    try {
           // Buscar el cuartos actual en la base de datos
           var existingCuarto = await ContratoAlquiler.findOne({ where: { id } });
        
           if (!existingCuarto) {
               return res.status(404).json({
                   msg: 'Registro no encontrado',
               });
           }
           // Actualizamos el cuartos en la base de datos
           const [updated] = await ContratoAlquiler.update({
               estado: estado
           }, { where: { id } });
   
           if (updated) {
               res.status(200).json({
                   msg: `Registro actualizado exitosamente!`,
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

export var VerPDFContrato = async (req: Request, res: Response):Promise<void> => {
    var { id } = req.params;
    try {
        const SetContratoAlquiler = await ContratoAlquiler.findOne({  
            include: [
                { model: Inquilino },
                { model: Cuarto }
            ],
             where: { id }
        });
        
        if (SetContratoAlquiler) {
                 //aqui ocupar el servicio de para generar pdf
            var buffer = await appService.PDFcontrato(SetContratoAlquiler);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=example.pdf',
                'Content-Length': buffer.length,
            })

            res.send(buffer);

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
