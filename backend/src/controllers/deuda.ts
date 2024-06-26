import { Request, Response } from 'express';
import { Deuda} from '../models/deuda';
import { appService } from '../servicios/app.service';
import { Pago } from '../models/pago';
import { ContratoAlquiler } from '../models/contratoalquiler';
import { Inquilino } from '../models/inquilino';
import { Cuarto } from '../models/cuartos';
import { User } from '../models/user';
import sequelize from '../db/connection';

//listar Registros
export const getDeudas = async (req: Request, res: Response) => {
    const listDeuda = await Deuda.findAll({ 
            include: [{
                model: ContratoAlquiler,
                include: [
                    { model: Inquilino },
                    { model: Cuarto }
                    ]
                }],
             order: [['id_contrato', 'ASC'],['fecha', 'ASC']]
            });
    res.json(listDeuda)
}
//listar Registros por contratos
export const getDeudasporContratos = async (req: Request, res: Response) => {
    const { id } = req.params;
    const listDeuda = await Deuda.findAll({ 
            include: [{
                model: ContratoAlquiler,
                include: [
                    { model: Inquilino },
                    { model: Cuarto }
                    ]
                }],
             order: [['id_contrato', 'ASC'],['fecha', 'ASC']],
             where: {id_contrato:id}
            }
            );
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
    const{ monto_deuda, fecha, mes, estado, id_contrato }= req.body;
    try {
        // Guardarmos RegistroDeudas en la base de datos
        await Deuda.create({
            monto_deuda: monto_deuda,
            fecha:fecha,
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
    var{ monto_deuda,fecha, mes, estado, id_contrato }= req.body;

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
               fecha:fecha,
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
//actualizar estado de cuarto
export const actualizarEstado = async (req: Request, res: Response) => {
    var { id } = req.params;
    var{estado}= req.body;
    try {
           // Buscar el cuartos actual en la base de datos
           var existing = await Deuda.findOne({ where: { id } });
        
           if (!existing) {
               return res.status(404).json({
                   msg: 'Registro no encontrado',
               });
           }
           // Actualizamos el cuartos en la base de datos
           const [updated] = await Deuda.update({
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
export var OptenerPDF = async (req: Request, res: Response):Promise<void> => {
    var { id } = req.params;
    try {
        //aqui ocupar el servicio de para generar pdf
     
        const OPago = await Pago.findOne({
        include: [
            {
            model: Deuda,
            include: [
                {
                model: ContratoAlquiler,
                include: [
                    { model: Inquilino },
                    { model: Cuarto }
                ]
                }
            ]
            },
            {model:User}
        ],
        where: { id_deuda: id }
        });
   
        if (OPago) {
            var buffer = await appService.ExtractoPagoPDF(OPago);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=example.pdf',
                'Content-Length': buffer.length,
              })
              res.send(buffer);
        }
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}


export var RangoDeudaPDF = async (req: Request, res: Response):Promise<void> => {
    var{ fecha_inicio, fecha_fin }= req.body;
    try{
        // res.status(200).json({
        //     msg: fecha_inicio,
        //    });
        //    return  ;
        const resultados: any = await sequelize.query(`
            SELECT
                cuartos.numero AS numero_cuarto,
                CONCAT(inquilinos.nombre, ' ', inquilinos.apellido) AS nombre_inquilino,
                deudas.mes AS mes_deuda,
                YEAR(deudas.fecha) as gestion,
                deudas.monto_deuda AS monto_deuda,
                CASE
                    WHEN deudas.estado = false THEN 'Pendiente'
                    WHEN deudas.estado = true THEN 'Pagada'
                    ELSE 'Desconocido'
                END AS estado_deuda
            FROM
                deudas
            JOIN contratoalquilers ON deudas.id_contrato = contratoalquilers.id
            JOIN cuartos ON contratoalquilers.id_cuarto = cuartos.id
            JOIN inquilinos ON contratoalquilers.id_inquilino = inquilinos.id
            LEFT JOIN pagos ON deudas.id  = pagos.id_deuda
            WHERE
                DATE(deudas.fecha) BETWEEN DATE('${fecha_inicio}') AND DATE('${fecha_fin}')
                ORDER BY
                cuartos.numero ASC;
                    `);

       if (resultados[0].length > 0) {
        var buffer = await appService.RangoDeudaPDF(resultados[0]);
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
