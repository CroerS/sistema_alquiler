import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/services/error.service';
import { PagoService } from 'src/app/services/pago.service';
import { DeudaService} from 'src/app/services/deuda.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html'
})
export class ReporteComponent implements OnInit {
  id_reporte:number=0;
  fecha_inicio: Date=new Date();
  fecha_fin: Date=new Date();
  constructor(
    private PagoService: PagoService,
    private _errorService: ErrorService,
    private _deudaService: DeudaService
  ) { }

  ngOnInit(

  ): void {
  }

  Ejecutar(){
    this.PagosYDeudaMensuales()
  }

  PagosYDeudaMensuales(){
    if(this.id_reporte==0 || this.id_reporte==1){
      this.PagoService.ReporteDeudas(this.id_reporte).subscribe({
        next: (data: Blob) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          
          // Calcular las dimensiones de la ventana
          const width = 800; // Ancho de la ventana
          const height = 600; // Alto de la ventana
          const left = (window.screen.width - width) / 2; // Calcular la posición izquierda para centrar
          const top = (window.screen.height - height) / 2; // Calcular la posición superior para centrar
          
          // Abrir el PDF en una nueva ventana centrada horizontalmente
          const newWindow = window.open(url, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
          
          if (!newWindow) {
            // Controlar el caso en que el navegador bloquee la apertura de ventanas emergentes
            alert('Por favor, habilite las ventanas emergentes para ver el PDF.');
          }
        },
        error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
        }
      })
    }
    if(this.id_reporte==2){
      
    }
    if(this.id_reporte==3){

    }
    if(this.id_reporte==4){
      var fechas:  any={
        fecha_inicio: this.fecha_inicio,
        fecha_fin: this.fecha_fin
      }
      this._deudaService.RangoDeudaPDF(fechas).subscribe({
        next: (data: Blob) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          
          // Calcular las dimensiones de la ventana
          const width = 800; // Ancho de la ventana
          const height = 600; // Alto de la ventana
          const left = (window.screen.width - width) / 2; // Calcular la posición izquierda para centrar
          const top = (window.screen.height - height) / 2; // Calcular la posición superior para centrar
          
          // Abrir el PDF en una nueva ventana centrada horizontalmente
          const newWindow = window.open(url, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
          
          if (!newWindow) {
            // Controlar el caso en que el navegador bloquee la apertura de ventanas emergentes
            alert('Por favor, habilite las ventanas emergentes para ver el PDF.');
          }
        },
        error: (e: HttpErrorResponse) => {
          this._errorService.msjError(e);
        }
      })
      
    }
  }
}
