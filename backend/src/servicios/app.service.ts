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

    
    //INICIO CREANDO EL PDF DE CONTRATO
    async PDFcontrato():Promise<Buffer>{
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
    
            if (pageNumber > 0) {
              doc.image(join(process.cwd(), "assets/img/logo.png"), doc.page.width - 100, 18, { fit: [55, 55], align: 'center' })
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
          //Aqui empieza la pagina
          doc.addPage();
          doc.text('', 50, 70);
          doc.font("Helvetica-Bold").fontSize(20);
          doc.text("Contrato de Alquiler de Cuartos",{ 
            width: doc.page.width - 100,
            align: 'center'
          });
          doc.moveDown();
          doc.font("Helvetica").fontSize(12);
          doc.text("Este documento es para el contrato");
          doc.moveDown();
          doc.text("hola mundo");

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
  //FIN DE PDF DE CONTRATO




    async ExtractoPagoPDF():Promise<Buffer>{
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


}

const appService = new AppService();
export { appService };