import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html'
})
export class PagoComponent implements OnInit {

fecha_inicio:Date= new Date(2024, 0, 29);
fecha_fin:Date= new Date(2025, 10, 10);

  dates: Date[] = [
    // new Date(2024, 0, 1),  // 2024-01-01
    // new Date(2024, 1, 14), // 2024-02-14
    // new Date(2024, 2, 17), // 2024-03-17
    // Agrega más fechas según sea necesario
  ];

   // Función para formatear las fechas en el formato "dd-MM-yyyy"
   formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month < 10 ? '0' + month : month}-${year}`;
  }

  constructor() { }

  ngOnInit(): void {
  }

  Calcular() {
    // Reiniciar el arreglo de fechas
    this.dates = [];
  
    // Obtener el día de la fecha de inicio
    const diaInicio = this.fecha_inicio.getDate();
  
    // Obtener el día de la fecha final del contrato
    const diaFin = this.fecha_fin.getDate();
  
    // Obtener el mes de la fecha de inicio
    const mesInicio = this.fecha_inicio.getMonth();
  
    // Obtener el mes de la fecha final del contrato
    const mesFin = this.fecha_fin.getMonth();
  
    // Generar las fechas hasta el día de la fecha final del contrato si el día de la fecha de inicio coincide con el día de la fecha final del contrato
    let currentDate = new Date(this.fecha_inicio);
    const endDate = new Date(this.fecha_fin);
  
    // Agregar la fecha de inicio si corresponde al día especificado
    if (currentDate.getDate() === diaInicio && currentDate <= endDate) {
      this.dates.push(new Date(this.fecha_inicio));
    }
  
    // Avanzar al siguiente mes si el mes de inicio es anterior al mes de la fecha final y el día de inicio coincide con el día de la fecha final
    if (mesInicio < mesFin && currentDate.getDate() === diaFin) {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  
    // Generar las fechas de pago hasta el mes de la fecha final del contrato si el día de la fecha de inicio coincide con el día de la fecha final del contrato
    while (currentDate <= endDate) {
      // Obtener el último día del mes para la fecha actual
      const ultimoDiaMes = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  
      // Obtener el día de la nueva fecha (usando el día máximo del mes que corresponda si es mayor que el último día del mes)
      let dia = diaInicio;
  
      // Si el día de inicio excede el último día del mes, usamos el último día del mes y puede recorrer los días que sean necesarios, no solo un día
      if (diaInicio > ultimoDiaMes) {
        dia = ultimoDiaMes;
      }
  
      // Crear una nueva fecha con el día calculado
      const nuevaFecha = new Date(currentDate.getFullYear(), currentDate.getMonth(), dia);
  
      // Agregar la nueva fecha al arreglo solo si es anterior o igual a la fecha final del contrato y no existe en el arreglo
      if (nuevaFecha <= endDate && !this.dates.find(date => date.getTime() === nuevaFecha.getTime())) {
        this.dates.push(nuevaFecha);
      }
  
      // Detener el ciclo si llegamos al mes de la fecha final del contrato y el día actual es mayor al día de la fecha final
      if (currentDate.getMonth() === mesFin && dia > diaFin) {
        break;
      }
  
      // Avanzar al siguiente mes
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  
    // Ahora puedes hacer lo que quieras con el arreglo de fechas, como formatearlo para mostrarlo en la consola o en la vista.
    const formattedDates = this.dates.map(date => this.formatDate(date));
    console.log(formattedDates);
  }



}