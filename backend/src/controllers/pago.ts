import { Request, Response } from 'express';
import { Pago} from '../models/pago';
import { appService } from '../servicios/app.service';
import { Deuda } from '../models/deuda';
import { User } from '../models/user';
import  sequelize from '../db/connection'
//listar Registros
export const getPagos = async (req: Request, res: Response) => {
    const listPago = await Pago.findAll({
        include: [
            { model: User }
        ]
    });

    res.json(listPago)
}

//Buscar Registro
export const GetPago = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Actualizamos pago en la base de datos
        // const SetPago = await Pago.findOne({ where: { id } });
        
        const SetPago = await Pago.findOne({
            include: [
                { model: Deuda},  {model: User}
            ],
            where: { id: id }
            });

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
    const{ monto_pagado, metodo_pago, fecha,adelanto, mes, id_deuda, id_user }= req.body;
    try {
        // Guardarmos cuartos en la base de datos
        await Pago.create({
            monto_pagado,
            metodo_pago: metodo_pago,
            fecha: fecha,
            adelanto: adelanto,
            mes: mes,
            id_deuda: id_deuda,
            id_user: id_user
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
    var{ monto_pagado, metodo_pago, fecha, adelanto, mes, id_deuda, id_user }= req.body;

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
               adelanto: adelanto,
               mes: mes,
               id_deuda: id_deuda,
               id_user: id_user
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


export var VerExtractoPago = async (req: Request, res: Response):Promise<void> => {
    var { id } = req.params;
    try {
        //aqui ocupar el servicio de para generar pdf
        const OPago = await Pago.findOne({
                include: [
                    { model: Deuda},  {model: User}
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

//listar Registros
export const GetRpt = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const resultados: any = await sequelize.query(`
            SELECT d.id_contrato, CONCAT(i.nombre,' ',i.apellido) nombre,c.numero,c.descripcion,IF(d.estado=0,'Pendiente','Pagado') estado,COUNT(d.id_contrato) CantidadMeses,SUM(d.monto_deuda) MontoTotal
            FROM deudas d
            JOIN contratoalquilers ca ON (d.id_contrato=ca.id)
            JOIN cuartos c ON (ca.id_cuarto=c.id)
            JOIN inquilinos i ON (ca.id_inquilino=i.id)
            WHERE d.estado=false
            GROUP BY  d.id_contrato,i.nombre,i.apellido,c.numero,c.descripcion,d.estado
          `);

       if (resultados[0].length > 0) {
        var buffer = await appService.generatePDF(resultados[0]);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=example.pdf',
            'Content-Length': buffer.length,
          })
        res.status(200).send(buffer);
        } else {
            res.status(404).json({
                msg: 'descripcion no asas',
            });
        }

    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}
