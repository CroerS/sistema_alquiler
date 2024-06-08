import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html'
})
export class PagoComponent implements OnInit {


  dates: Date[] = [
    new Date('2024-01-01'),
    new Date('2024-02-14'),
    new Date('2024-03-17'),
    // Agrega más fechas según sea necesario
  ];

  constructor() { }

  ngOnInit(): void {
  }

  Calcular(){
    console.log(this.dates);
  }

}
