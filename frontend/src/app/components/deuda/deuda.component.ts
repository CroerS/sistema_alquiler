import { Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error.service';
import { ContratoService } from 'src/app/services/contrato.service';
import { Contrato } from 'src/app/interfaces/contrato';
import { Deuda } from 'src/app/interfaces/deuda';
import { DeudaService } from 'src/app/services/deuda.service';

declare var $: any; // Declara la variable global jQuery
@Component({
  selector: 'app-deuda',
  templateUrl: './deuda.component.html',
  styleUrls: ['./deuda.component.css']
})
export class DeudaComponent implements OnInit {

  @ViewChild('myModal') myModal!: ElementRef;

  listaDeuda: Deuda[] = [];
  listaContrato: Contrato[]| undefined = [];

  accion = 'Agregar';
  loading: boolean = false;
  id: number | undefined;

  //Datos Deuda
  id_dueda: number = 0;
  monto_deuda: number = 0;
  fecha: string = '';
  mes: number = 0;
  estado: boolean = false;
  id_contrato: number = 0;

  // parametro
  actualizarAFecha: string= ''; // Formato YYYY-MM-DD

  constructor(
    private _contratoService: ContratoService,
    private _deudaService: DeudaService,
    private toastr: ToastrService,
    private _errorService: ErrorService
  ) { }

  //funcion que se ejecuta al entrar al programa
  ngOnInit(): void {
    this.getListaDeudas();
    const today = new Date();
    today.setDate(today.getDate());
    this.actualizarAFecha = today.toISOString().split('T')[0]; // formatea a 'yyyy-MM-dd'
  }

  async actualizarDeudas() {
    try {
      this.listaContrato= await this._contratoService.getList().toPromise(); // Obtener la lista de contratos de manera síncrona
      
      // Iterar sobre cada contrato y registrar las deudas mensuales
      for (var contrato of this.listaContrato!) {
        await this.registrarDeudasMensuales(contrato); // Esperar a que se registren todas las deudas del contrato
      }
  
      // Después de completar el registro de deudas, obtener la lista de deudas
      this.getListaDeudas();
    } catch (error) {
      console.error('Error al obtener la lista de contratos:', error);
    }
  }
  
  getListaDeudas(): void {
    this._deudaService.getList().subscribe(data => {
      this.listaDeuda = data;
      console.log('Lista de deudas:', this.listaDeuda);
    });
  }
  
  async registrarDeudasMensuales(contrato: Contrato) {
    try {
      let fechaInicio = new Date(contrato.fecha_inicio);
      fechaInicio.setDate(fechaInicio.getDate() + 1); // Ajustar inicio al día siguiente para evitar duplicados
      let fechaFin = new Date(contrato.fecha_fin);
      const fechasDeCobro = await this.calcularFechasDeCobro(fechaInicio, fechaFin);
  
      for (const fecha of fechasDeCobro) {
        if (fecha <= new Date(this.actualizarAFecha)) {
          let mes = fecha.getMonth() + 1; // Mes en base 1
          let deuda: Deuda = {
            id: 0, // El id será generado por la base de datos
            monto_deuda: this.calcularMontoDeuda(contrato),
            mes: mes,
            fecha: fecha.toDateString(),
            estado: false, // Asumiendo que la deuda es pendiente
            id_contrato: contrato.id
          };
  
          await this._deudaService.save(deuda).toPromise(); // Esperar a que se guarde la deuda
          console.log('Deuda registrada:', deuda);
        }
      }
    } catch (error) {
      console.error('Error al registrar las deudas mensuales:', error);
    }
  }


  calcularMontoDeuda(contrato: Contrato): number {
   
    if (contrato.cuarto && contrato.cuarto.costo) {
      return contrato.cuarto.costo;
    } else {
      return 0; // Manejo del caso en que no haya información del cuarto
    }
  }

  calcularFechasDeCobro(fechaInicio: Date, fechaFin: Date): Date[] {
    // Reiniciar el arreglo de fechas
    let fechasDeCobro: Date[] = [];

    // Crear una copia de la fecha de inicio para no modificar la original
    let fechaActual = new Date(fechaInicio);

    // Iterar hasta que la fecha actual llegue al mes de la fecha de fin
    while (fechaActual <= fechaFin) {
        // Agregar la fecha actual al arreglo
        fechasDeCobro.push(new Date(fechaActual));

        // Avanzar al siguiente mes
        fechaActual.setMonth(fechaActual.getMonth() + 1);

        // Si estamos en el mes de fin, salimos del bucle
        if (fechaActual.getMonth() === fechaFin.getMonth()) {
            break;
        }
    }

    return fechasDeCobro;
}
  

  Delete(id: number){
    this.loading = true;
    this._deudaService.delete(id).subscribe({
      next: (v) => {
        this.toastr.success(`El Deuda con ID ${this.id} fue elimado con exito`, 'Deuda Eliminado');
        this.getListaDeudas();
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msjError(e);
      }
    })
  }


  VerPDF(id:number):void{
    this._deudaService.VerPdf(id).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        // Crear un objeto URL para el blob y abrirlo en una nueva ventana/tab
        const url = window.URL.createObjectURL(blob);
        // window.open(url);

        // Alternativamente, puedes descargar el PDF automáticamente
        const a = document.createElement('a');
         a.href = url;
         a.download = 'deuda.pdf';
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msjError(e);
      }
    })
  }
}
