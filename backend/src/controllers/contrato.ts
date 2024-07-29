import { Request, Response } from 'express';
import { ContratoAlquiler} from '../models/contratoalquiler';
import { Inquilino} from '../models/inquilino';
import { Cuarto} from '../models/cuartos';
import { appService } from '../servicios/app.service';
import sequelize from '../db/connection';
import { TiempoAnticipo } from '../models/tiempoanticipo';


// Function to handle anticipos
const handleAnticipos = async (fecha_inicio: string, fecha_fin: string, mesesadelanto: number, contratoId: number) => {
    var fechaInicio = new Date(fecha_inicio);
    fechaInicio.setDate(fechaInicio.getDate() + 1);
    let mesinicio = fechaInicio.getMonth() + 1; // getMonth() devuelve 0 para enero, así que sumamos 1
    let anioinicio = fechaInicio.getFullYear();
    let mesfin = new Date(fecha_fin).getMonth() + 1;
    let aniofin = new Date(fecha_fin).getFullYear();

    let count = 1;
    while (count <= mesesadelanto) {
        if (mesinicio > 12) {
            mesinicio = 1;
            anioinicio++;
        }
        if (anioinicio > aniofin || (anioinicio === aniofin && mesinicio > mesfin)) {
            break;
        }
        await TiempoAnticipo.create({
            mes: mesinicio,
            gestion: anioinicio,
            id_contrato: contratoId
        });
        count++;
        mesinicio++;
    }
};



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
        const SetContratoAlquiler = await ContratoAlquiler.findAll({
            include: [
                { model: Inquilino },
                { model: Cuarto }
            ], where: { id } });

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
        const creado : any = await ContratoAlquiler.create({
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

        const contratoId = creado.id; // Obtenemos el ID del contrato creado
    
       if (mesesadelanto > 0) {
        await handleAnticipos(fecha_inicio, fecha_fin, mesesadelanto, contratoId);
        }

        res.json({
            msg: `Contrato de Alquiler creado exitosamente!`,
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
                if(mesesadelanto>0){
                    const deleted = await TiempoAnticipo.destroy({
                        where: { id_contrato:id }
                    });
                    if(deleted){
                        await handleAnticipos(fecha_inicio, fecha_fin, mesesadelanto,  Number(id));
                    }
                }

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


export var ContratosPorVencer = async (req: Request, res: Response)=> {
    try{

        const resultados: any = await sequelize.query(`
           			SELECT contratoalquilers.id, DATE(contratoalquilers.fecha_inicio) fechainicio, DATE(contratoalquilers.fecha_fin) fechafin,
            		CASE
                    WHEN estado = false THEN 'Pendiente'
                    WHEN estado = true THEN 'Pagada'
                    ELSE 'Desconocido'
               		END AS estado,
                	contratoalquilers.mesesadelanto, contratoalquilers.pagoadelanto, CONCAT(inquilinos.nombre, ' ', 					inquilinos.apellido) AS nombre_inquilino, id_cuarto
                    FROM contratoalquilers,inquilinos
                    WHERE MONTH(fecha_fin) = MONTH(CURDATE())
                    AND YEAR(fecha_fin) = YEAR(CURDATE())
                    AND estado = 1
                    AND contratoalquilers.id_inquilino = inquilinos.id
                    ORDER BY fecha_fin;
                    `);
       if (resultados[0].length > 0) {
        var buffer = await appService.ContratoPorVencer(resultados[0]);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=example.pdf',
            'Content-Length': buffer.length,
          })
        res.status(200).send(buffer);
        } else {
            res.status(404).json({
                msg: 'error',
            });
        }

    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}


export var CuartosSolicitado = async (req: Request, res: Response):Promise<void> => {
    try{
        // res.status(200).json({
        //     msg: fecha_inicio,
        //    });
        //    return  ;
        const resultados: any = await sequelize.query(`
           SELECT id_cuarto, COUNT(*) AS cantidad_contratos
            FROM contratoalquilers
            GROUP BY id_cuarto
            ORDER BY cantidad_contratos DESC;
                    `);

       if (resultados[0].length > 0) {
        var buffer = await appService.CuartoSolicitado(resultados[0]);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=example.pdf',
            'Content-Length': buffer.length,
          })
        res.status(200).send(buffer);
        } else {
            res.status(404).json({
                msg: 'error',
            });
        }

    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}
