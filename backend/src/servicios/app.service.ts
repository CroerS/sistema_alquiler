import { join } from 'path';
const PDFDocument = require('pdfkit-table')
// var sf = require('pdfkit')
const fs = require("fs");
export class AppService {

  async generatePDF(lista:any,id_tipoReporte:string):Promise<Buffer>{
    const pdfBuffer:Buffer = await new Promise(resolve =>{
        //Creacion del document
        const doc= new PDFDocument({
            size:"LETTER",
            bufferPages:true,
            autoFirstPage: false,//para que no cree automaticamente una pagina
            margins: {
              top: 50, // Ajusta el margen superior
              bottom: 50, // Ajusta el margen inferior
              left: 50, // Ajusta el margen izquierdo
              right: 50 // Ajusta el margen derecho
          }
        })
    
        // Aquí el contenido del PDF
        let pageNumber = 0;
        doc.on('pageAdded', () => {
            pageNumber++;
            let bottom = doc.page.margins.bottom;

            if (pageNumber > 0) {
                // Dibujar el logo en la parte superior derecha
                doc.image(join(process.cwd(), "assets/img/logo.png"), doc.page.width - 100, 18, { fit: [55, 55], align: 'center' });
                
                // Dibujar la línea en la parte superior
                doc.moveTo(50, 55)
                    .lineTo(doc.page.width - 50, 55)
                    .stroke();

                // Dibujar la línea en el pie de página
                doc.moveTo(50, doc.page.height - 60)
                    .lineTo(doc.page.width - 50, doc.page.height - 60)
                    .stroke();
                
                // Dibujar el título en el pie de página, centrado y por encima de la línea
                doc.fontSize(16)
                    .text(`Reporte de ${(id_tipoReporte==="0")?'Deudas':'Pagos'}`, {
                        width: doc.page.width - 100,
                        align: 'center',
                        baseline: 'bottom',
                        y: doc.page.height - 25 // Ajustar la posición del texto para que esté justo encima de la línea
                    });
            }
        });


        doc.addPage();
        doc.fontSize(10);
        doc.font('Times-BoldItalic').text(`RENTHUB`, {
          width: doc.page.width - 100,
          align: 'left'
        });
        // Mover hacia arriba para evitar salto de línea
        doc.moveUp();
        doc.font('Helvetica').fontSize(9).text('Fecha: ' + new Date().toLocaleDateString(), {
          width: doc.page.width - 100,
          align: 'right'
        });

        doc.moveDown(1);

        const table2 = {
          headers: [
            // { label:"Cod. Contrato", property: 'id_contrato',headerColor:"#000000",backgroundColor:'red',align:"center",width: 60, renderer: null },
            { label:"Cod. Contrato", property: 'id_contrato', headerColor:"#1c5e8a",headerOpacity:1,columnColor:'#FFFFFF',align:"center",width: 60, renderer: null },
            { label:"Nombre", property: 'nombre',headerAlign:'center',headerColor:"#1c5e8a",headerOpacity:1, width: 135 , renderer: null }, 
            { label:"Nro. cuarto", property: 'numero',headerColor:"#1c5e8a",headerOpacity:1,align:"center", width: 60, renderer: null }, 
            { label:"Descripcion", property: 'descripcion',headerAlign:'center',headerColor:"#1c5e8a",headerOpacity:1, width: 90, renderer: null }, 
            { label:"Estado", property: 'estado', align:"center",headerColor:"#1c5e8a",headerOpacity:1, width: 50, renderer: null }, 
            { label:"Cant. Meses", property: 'CantidadMeses',headerAlign:'center',headerColor:"#1c5e8a",headerOpacity:1, align:"center",width: 55, renderer: null },
            { label:"Subtotal", property: 'MontoTotal',headerAlign:'center',headerColor:"#1c5e8a",headerOpacity:1,align:"right", width: 62, renderer: (value:any, indexColumn:any, indexRow:any, row:any) => { return `Bs ${Number(value).toFixed(2)}` } },
          ],
          datas: lista 
        };
        
        doc.table(table2, {
          prepareHeader: () => {
            doc.font("Helvetica-Bold").fontSize(8);
            // doc.rect(doc.page.margins.left, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, doc.currentLineHeight())
            //     .fill('#000000'); // Color blanco para el fondo del encabezado
            doc.fillColor('#FFFFFF'); // Color blanco para el texto del encabezado
        },
          prepareRow: (row:any, indexColumn:any, indexRow:any, rectRow:any) => {
          doc.font("Helvetica").fontSize(8);
          doc.fillColor('#333'); // Cambiar color de texto de las filas
          indexColumn === 0 && doc.addBackground(rectRow, 'white', 0.15);
        },
        });
  
        // Usando reduce para sumar MontoTotal
        let totalMonto = lista.reduce((total:number, item:any) => {
          return total + parseFloat(item.MontoTotal);
        }, 0);

        doc.font("Helvetica-Bold").text(`Total: Bs. ${totalMonto.toFixed(2)}`, {
            width: doc.page.width - 100,
            align: 'right'
        });

        //finalizacion del document
        const buffer: Uint8Array[] = []; // Declarar explícitamente el tipo
        doc.on('data', buffer.push.bind(buffer))
        doc.on('end', () => {
            const data = Buffer.concat(buffer)
            resolve(data)
        })

        doc.end()
    })
    return pdfBuffer;
}


// inicio de pdf
    async PDFcontrato(contrato:any): Promise<Buffer> {
      const pdfBuffer: Buffer = await new Promise(resolve => {
          // Creación del documento
          const doc = new PDFDocument({
              size: "LETTER",
              bufferPages: true,
              autoFirstPage: false, // Para que no cree automáticamente una página
          });


          // Aquí el contenido del PDF
          let pageNumber = 0;
          doc.on('pageAdded', () => {
              pageNumber++
              let bottom = doc.page.margins.bottom;
  
              if (pageNumber > 0) {
                  doc.image(join(process.cwd(), "assets/img/logo.png"), doc.page.width - 100, 18, { fit: [55, 55], align: 'center' })
                  doc.moveTo(50, 55)
                      .lineTo(doc.page.width - 50, 55)
                      .stroke();
              }
         
          })
          // Inicia la página
          doc.addPage();
          doc.text('', 50, 70);
          doc.font("Helvetica-Bold").fontSize(20);
          doc.text("CONTRATO DE ALQUILER DE CUARTO", {
              width: doc.page.width - 100,
              align: 'center'
          });
          doc.moveDown();
          // Contenido del contrato
          doc.font("Helvetica").fontSize(12);
          doc.font('Times-BoldItalic').fontSize(12).text('Fecha: ' + new Date().toLocaleDateString());
          doc.font("Helvetica").fontSize(12);
          doc.moveDown();
          doc.text(`Se ha celebrado el presente contrato de alquiler de cuarto entre la empresa RENTHUB y el/la Sr./Sra: ${contrato.inquilino?.nombre} ${contrato.inquilino?.apellido}, llamado en adelante como 'el Inquilino'.`);
          doc.moveDown();
          // doc.text("1. Partes Involucradas:", {bold: true}); 
          doc.font('Helvetica-Bold').fontSize(12).text('1. Partes Involucradas:');
          doc.font("Helvetica").fontSize(12);

          doc.text("   - Arrendador: RENTHUB",);
          doc.text(`   - Arrendatario: ${contrato.inquilino?.nombre} ${contrato.inquilino?.apellido}`);
          doc.moveDown();
          // doc.text("2. Periodo del Contrato:",);
          doc.font('Helvetica-Bold').fontSize(12).text('2. Periodo del Contrato:');
          doc.font("Helvetica").fontSize(12);

          doc.text(`  El presente contrato tiene validez desde el: ${contrato.fecha_inicio.toISOString().split('T')[0]} hasta el ${contrato.fecha_fin.toISOString().split('T')[0]} `);
          doc.moveDown();
          // doc.text("3. Descripción del Cuarto:");
          doc.font('Helvetica-Bold').fontSize(12).text('3. Descripción del Cuarto:');
          doc.font("Helvetica").fontSize(12);

          doc.text(`   - Número del Cuarto: ${contrato.cuarto?.numero}`,);
          doc.text(`   - Descripción:  ${contrato.cuarto?.descripcion}`);
          doc.text(`   - Dimensiones: ${contrato.cuarto?.dimension}`);
          doc.moveDown();
          // doc.text("4. Pago:");
          doc.font('Helvetica-Bold').fontSize(12).text('4. Pago:');
          doc.font("Helvetica").fontSize(12);

          doc.text(`   El Inquilino se compromete a pagar mensualmente la cantidad de Bs ${contrato.cuarto?.costo} por concepto de alquiler del cuarto.`);
          doc.moveDown();
          // doc.text("5. Anticipo:");
          doc.font('Helvetica-Bold').fontSize(12).text('5. Anticipo:');
          doc.font("Helvetica").fontSize(12);

          doc.text(`   El inquilino ha realizado un anticipo de Bs ${contrato.pagoadelanto}, correspondiente a ${contrato.mesesadelanto} meses, como garantía del cumplimiento de las obligaciones estipuladas en el presente contrato.`);
          doc.moveDown();
          // Método de pago
          if (false) {
              // doc.text("6. Método de Pago:");
              doc.font('Helvetica-Bold').fontSize(12).text('6. Método de Pago:');
              doc.font("Helvetica").fontSize(12);

              doc.text("   El pago se realizará mediante 'método_pago.Pago'");
              doc.moveDown();
          }

          doc.moveDown(2);
          doc.moveDown(4);
          doc.moveDown(4);
          doc.text('_________________________               _________________________', { align: 'center' });
          doc.text('Arrendador                                             Arrendatario', { align: 'center' });
  
          // Finalización del documento
          const buffer: Uint8Array[] = []; // Declarar explícitamente el tipo
          doc.on('data', buffer.push.bind(buffer))
          doc.on('end', () => {
              const data = Buffer.concat(buffer)
              resolve(data)
          })
  
          doc.end()
      })
      return pdfBuffer;
  }


// INICIO DE PAGO PDF
async ExtractoPagoPDF(pago:any): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      
        // Crear documento PDF
        const doc = new PDFDocument({
            size: "LETTER",
            bufferPages: true,
            autoFirstPage: false,
        });

        // Stream para escribir en un archivo PDF (opcional)
        const stream = fs.createWriteStream('recibo_pago.pdf');

        // Manejar errores
        doc.on('error', (error: any) => {
            reject(error);
        });

        // Escribir contenido del recibo de pago
        doc.addPage();
        doc.image(join(process.cwd(), "assets/img/logo.png"), doc.page.width - 100, 18, { fit: [55, 55], align: 'center' })
                  doc.moveTo(50, 55)
                      .lineTo(doc.page.width - 50, 55)
                      .stroke();
        doc.text('RECIBO DE PAGO', { align: 'center' });
        doc.moveDown();
        doc.font("Helvetica").fontSize(12);
        doc.font('Times-BoldItalic').fontSize(12).text('Fecha: ' + new Date().toLocaleDateString());
        doc.font("Helvetica").fontSize(12);
        doc.moveDown();
        doc.text(`Numero de recibo: ${pago.id}`)
        doc.text(`Inquilino: ${pago.Deuda?.ContratoAlquiler?.inquilino?.nombre} ${pago.Deuda?.ContratoAlquiler?.inquilino?.apellido} `);
        doc.text(`Cuarto Número: ${pago.Deuda?.ContratoAlquiler?.cuarto?.numero}`);
        doc.text(`Periodo Cubierto: ${pago.mes}-${new Date(pago.fecha).getFullYear()}`);
        doc.text(`Monto pagado: Bs ${pago.Deuda?.ContratoAlquiler?.cuarto?.costo}`);
        doc.text(`Método de Pago: ${pago.metodo_pago}`);
        doc.text(`Recibido por: ${pago.user?.username}`);
        doc.moveDown(2);
        doc.text('_________________________               _________________________', { align: 'center' });
        doc.text('Arrendador                                             Arrendatario', { align: 'center' });
        
        // Finalizar documento y resolver promesa con el buffer
        const buffers: Uint8Array[] = [];
        doc.on('data', (chunk: Uint8Array) => buffers.push(chunk));
        doc.on('end', () => {
            const buffer = Buffer.concat(buffers);
            resolve(buffer);
        });

        // Pipe para escribir en el stream (opcional)
        if (stream) {
            doc.pipe(stream);
            doc.end();
        } else {
            doc.end();
        }
    });

    return pdfBuffer;
}
// FIN DE PAGO PDF

async  RangoDeudaPDF(lista:any):Promise<Buffer>{
    const pdfBuffer:Buffer = await new Promise(resolve =>{
        //Creacion del document
        const doc= new PDFDocument({
            size:"LETTER",
            bufferPages:true,
            autoFirstPage: false,//para que no cree automaticamente una pagina
            margins: {
              top: 50, // Ajusta el margen superior
              bottom: 50, // Ajusta el margen inferior
              left: 50, // Ajusta el margen izquierdo
              right: 50 // Ajusta el margen derecho
          }
        })
    
        // Aquí el contenido del PDF
        let pageNumber = 0;
        doc.on('pageAdded', () => {
            pageNumber++;
            let bottom = doc.page.margins.bottom;

            if (pageNumber > 0) {
                // Dibujar el logo en la parte superior derecha
                doc.image(join(process.cwd(), "assets/img/logo.png"), doc.page.width - 100, 18, { fit: [55, 55], align: 'center' });
                
                // Dibujar la línea en la parte superior
                doc.moveTo(50, 55)
                    .lineTo(doc.page.width - 50, 55)
                    .stroke();

                // Dibujar la línea en el pie de página
                doc.moveTo(50, doc.page.height - 60)
                    .lineTo(doc.page.width - 50, doc.page.height - 60)
                    .stroke();
                
                // Dibujar el título en el pie de página, centrado y por encima de la línea
                doc.fontSize(16)
                    .text(`Reporte de Deuda segun rango de fecha`, {
                        width: doc.page.width - 100,
                        align: 'center',
                        baseline: 'bottom',
                        y: doc.page.height - 25 // Ajustar la posición del texto para que esté justo encima de la línea
                    });
            }
        });


        doc.addPage();
        doc.fontSize(10);
        doc.font('Times-BoldItalic').text(`RENTHUB`, {
          width: doc.page.width - 100,
          align: 'left'
        });
        // Mover hacia arriba para evitar salto de línea
        doc.moveUp();
        doc.font('Helvetica').fontSize(9).text('Fecha: ' + new Date().toLocaleDateString(), {
          width: doc.page.width - 100,
          align: 'right'
        });

        doc.moveDown(1);

        const table2 = {
          headers: [
            // { label:"Cod. Contrato", property: 'id_contrato',headerColor:"#000000",backgroundColor:'red',align:"center",width: 60, renderer: null },
            { label:"Nro. Cuarto", property: 'numero_cuarto', headerColor:"#1c5e8a",headerOpacity:1,columnColor:'#FFFFFF',align:"center",width: 60, renderer: null },
            { label:"Nombre de Inquilino", property: 'nombre_inquilino',headerAlign:'center',headerColor:"#1c5e8a",headerOpacity:1, width: 135 , renderer: null }, 
            { label:"Mes de la Deuda", property: 'mes_deuda',headerColor:"#1c5e8a",headerOpacity:1,align:"center", width: 90, renderer: null }, 
            { label:"Gestion", property: 'gestion',headerColor:"#1c5e8a",headerOpacity:1,align:"center", width: 60, renderer: null }, 
            { label:"Estado de Deuda", property: 'estado_deuda', align:"center",headerColor:"#1c5e8a",headerOpacity:1, width: 90, renderer: null }, 
            { label:"Monto de la Deuda", property: 'monto_deuda',headerAlign:'center',headerColor:"#1c5e8a",headerOpacity:1,align:"right", width: 80, renderer: (value:any, indexColumn:any, indexRow:any, row:any) => { return `Bs ${Number(value).toFixed(2)}` } },
           ],
          datas: lista 
        };
        
        doc.table(table2, {
          prepareHeader: () => {
            doc.font("Helvetica-Bold").fontSize(8);
            // doc.rect(doc.page.margins.left, doc.y, doc.page.width - doc.page.margins.left - doc.page.margins.right, doc.currentLineHeight())
            //     .fill('#000000'); // Color blanco para el fondo del encabezado
            doc.fillColor('#FFFFFF'); // Color blanco para el texto del encabezado
        },
          prepareRow: (row:any, indexColumn:any, indexRow:any, rectRow:any) => {
          doc.font("Helvetica").fontSize(8);
          doc.fillColor('#333'); // Cambiar color de texto de las filas
          indexColumn === 0 && doc.addBackground(rectRow, 'white', 0.15);
        },
        });
  
        // Usando reduce para sumar MontoTotal
        let totalMonto = lista.reduce((total:number, item:any) => {
          return total + parseFloat(item.monto_deuda);
        }, 0);

        doc.font("Helvetica-Bold").text(`Total: Bs. ${totalMonto.toFixed(2)}`, {
            width: doc.page.width - 100,
            align: 'right'
        });

        //finalizacion del document
        const buffer: Uint8Array[] = []; // Declarar explícitamente el tipo
        doc.on('data', buffer.push.bind(buffer))
        doc.on('end', () => {
            const data = Buffer.concat(buffer)
            resolve(data)
        })
+
        doc.end()
    })
    return pdfBuffer;
}




}

const appService = new AppService();
export { appService };