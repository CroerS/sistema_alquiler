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

  listaDeuda: Deuda[] = []
  listaContrato: Contrato[] = []

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
    this.getListaDuedas();
    const today = new Date();
    today.setDate(today.getDate() - 1);
    this.actualizarAFecha = today.toISOString().split('T')[0]; // formatea a 'yyyy-MM-dd'
  }

  getListaDuedas() {
    this._deudaService.getList().subscribe(data => {
      this.listaDeuda = data;
    })
  }

  getListaContrato() {
    this._contratoService.getList().subscribe(data => {
      this.listaContrato = data;
    })
  }

  Delete(id: number){
    this.loading = true;
    this._deudaService.delete(id).subscribe({
      next: (v) => {
        this.toastr.success(`El Deuda con ID ${this.id} fue elimado con exito`, 'Deuda Eliminado');
        this.getListaDuedas();
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msjError(e);
      }
    })
  }


  actualizarDeudas() {
    this._contratoService.getList().subscribe(data => {
      data.forEach(item => {
        this.registrarDeudasMensuales(item);
      });
      this.getListaDuedas();
    });
  }

  registrarDeudasMensuales(contrato: Contrato) {
    let fechaInicio = new Date(contrato.fecha_inicio);
    fechaInicio.setDate(fechaInicio.getDate() + 1);
    alert(fechaInicio)
    let fechaFin = new Date(contrato.fecha_fin);
    var fechasDeCobro = this.calcularFechasDeCobro(fechaInicio, fechaFin);
    console.log(fechasDeCobro);
    fechasDeCobro.forEach(fecha => {
      if (fecha <= new Date(this.actualizarAFecha) ) {
        let mes = fecha.getMonth() + 1; // Mes en base 1
        var deuda:  Deuda = {
          id: 0, // El id será generado por la base de datos
          monto_deuda: this.calcularMontoDeuda(contrato),
          mes: mes,
          fecha: fecha.toDateString(),
          estado: false, // Asumiendo que la deuda es pendiente
          id_contrato: contrato.id
        };
        this._deudaService.save(deuda).subscribe(response => {
          console.log('Deuda registrada:', response);
        });
      }
    });

  }

  calcularMontoDeuda(contrato: Contrato): number {
    if (contrato.cuarto && contrato.cuarto.costo) {
      return contrato.cuarto.costo;
    } else {
      return 0; // Manejo del caso en que no haya información del cuarto
    }
  }
  calcularFechasDeCobro(fechaInicio: Date, fechaFin: Date): Date[] {
    let fechasDeCobro: Date[] = [];
    let fecha = new Date(fechaInicio);
    
    while (fecha <= fechaFin) {
        // Ajusta la fecha al último día del mes si el día actual es mayor que el último día del mes
        let ultimoDiaDelMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
        let diaCobro = Math.min(fechaInicio.getDate(), ultimoDiaDelMes);
        fecha.setDate(diaCobro);

        fechasDeCobro.push(new Date(fecha));
        // Avanza al próximo mes
        fecha.setMonth(fecha.getMonth() + 1);
        console.log(fecha)
        // Ajustar al último día del mes nuevamente si es necesario
        let nuevoUltimoDiaDelMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
        if (fechaInicio.getDate() > nuevoUltimoDiaDelMes) {
            fecha.setDate(nuevoUltimoDiaDelMes);
        } else {
            fecha.setDate(fechaInicio.getDate()); // Restablecer el día del mes al original si es posible
        }
    }
    return fechasDeCobro;
  }

}
