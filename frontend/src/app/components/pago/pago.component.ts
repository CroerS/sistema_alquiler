import { Component, OnInit } from '@angular/core';
import { Pago } from 'src/app/interfaces/pago';
import { PagoService } from 'src/app/services/pago.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html'
})
export class PagoComponent implements OnInit {

  lista: Pago[] = []

  constructor(  private PagoService: PagoService,) {  
   }

  ngOnInit(): void {
    this.getLista();
  }

  getLista() {
    this.PagoService.getList().subscribe(data => {
      this.lista = data;
    })
  }


}