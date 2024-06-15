import { join } from 'path';
const PDFDocument = require('pdfkit-table')
// var sf = require('pdfkit')
const fs = require("fs");
export class AppService {

    async generatePDF():Promise<Buffer>{
        const pdfBuffer:Buffer = await new Promise(resolve =>{
            //Creacion del document
            const doc= new PDFDocument({
                size:"LETTER",
                bufferPages:true,
                autoFirstPage: false,//para que no cree automaticamente una pagina
            })

            //Aqui el contenido del pdf
            let pageNumber = 0;
            doc.on('pageAdded', () => {
              pageNumber++
              let bottom = doc.page.margins.bottom;
      
              if (pageNumber > 1) {
                doc.image(join(process.cwd(), "assets/img/logo.png"), doc.page.width - 100, 5, { fit: [45, 45], align: 'center' })
                doc.moveTo(50, 55)
                  .lineTo(doc.page.width - 50, 55)
                  .stroke();
              }
      
              doc.page.margins.bottom = 0;
              doc.font("Helvetica").fontSize(14);
              doc.text(
                'Pág. ' + pageNumber,
                0.5 * (doc.page.width - 100),
                doc.page.height - 50,
                {
                  width: 100,
                  align: 'center',
                  lineBreak: false,
                })
              doc.page.margins.bottom = bottom;
            })
            doc.addPage()
            doc.image(join(process.cwd(), "assets/img/logo.png"), doc.page.width / 2 - 100, 150, { width: 200, })
            doc.text('', 0, 400)
            doc.font("Helvetica-Bold").fontSize(24);
            doc.text("DEV Latino", {
              width: doc.page.width,
              align: 'center'
            });
            doc.moveDown();
      
            doc.addPage();
            doc.text('', 50, 70);
            doc.font("Helvetica-Bold").fontSize(20);
            doc.text("PDF Generado en nuestro servidor");
            doc.moveDown();
            doc.font("Helvetica").fontSize(16);
            doc.text("Esto es un ejemplo de como generar un pdf en nuestro servidor nestjs");     
      
            doc.addPage();
            doc.text('', 50, 70)
            doc.fontSize(24);
            doc.moveDown();
            doc.font("Helvetica").fontSize(20);
            doc.text("Capitulo 2", {
              width: doc.page.width - 100,
              align: 'center'
            });
      
             const table1 = {
               title: "Tabla ejemplo",
               subtitle: "Esta es una tabla de ejemplo",
               headers: ["id", "nombre"],
               rows: [["1", "Dev latino"], ["2", "Programadores fumados"]]
             };
  
             doc.table(table1, {
               columnsSize: [150, 350],
             });
             
             doc.moveDown(1);
             const productos = [
              {
                name: 'CocaCola2L',
                descripcion: 'Sabor sin igual',
                precio: 23,
                cantidad: 2,
                monto: 56
              }
             ];
            const table2 = {
              headers: [
                { label:"Name", property: 'name', width: 60, renderer: null },
                { label:"descripcion", property: 'descripcion', width: 150, renderer: null }, 
                { label:"precio", property: 'precio', width: 100, renderer: null }, 
                { label:"cantidad", property: 'cantidad', width: 100, renderer: null }, 
                { label:"monto", property: 'monto', width: 63, renderer: (value:any, indexColumn:any, indexRow:any, row:any) => { return `U$ ${Number(value).toFixed(2)}` } },
              ],
              datas: productos 
                // { 
                //   name: 'Name 1', 
                //   descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ante in laoreet egestas. ', 
                //   precio: '$1', 
                //   cantidad: '$ 3', 
                //   monto: '$2', 
                // },
             
            };
            
            doc.table(table2, {
              prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
              prepareRow: (row:any, indexColumn:any, indexRow:any, rectRow:any) => {
              doc.font("Helvetica").fontSize(8);
              indexColumn === 0 && doc.addBackground(rectRow, (indexRow % 2 ? 'blue' : 'green'), 0.15);
            },
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

}

const appService = new AppService();
export { appService };