import { Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Contrato } from 'src/app/interfaces/contrato';
import { ContratoService } from 'src/app/services/contrato.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error.service';
import { Cuarto } from 'src/app/interfaces/cuarto';
import { Inquilino } from 'src/app/interfaces/inquilino';
import { CuartoService } from 'src/app/services/cuarto.service';
import { InquilinoService } from 'src/app/services/inquilino.service';
declare var $: any; // Declara la variable global jQuery

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css']
})
export class ContratoComponent implements OnInit {
  @ViewChild('myModal') myModal!: ElementRef;

  lista: Contrato[] = []
  listCuarto: Cuarto[] = []
  listInquilino: Inquilino[] = []
  accion = 'Agregar';
  loading: boolean = false;
  id: number | undefined;

  fecha_inicio: string = '';
  fecha_fin: string = '';
  estado: boolean= true;
  pagoadelanto: number=0;
  id_inquilino:number = 0;
  id_cuarto: number= 0;

  constructor(
    private _contratoService: ContratoService,
    private _cuartoService: CuartoService,
    private _inquilinoService: InquilinoService,
    private toastr: ToastrService,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.CargarFechas();

    this.getLista();
    this.getCuartos();
    this.getInquilinos();
  }


  CargarFechas(){
    const today = new Date();
    this.fecha_inicio = today.toISOString().split('T')[0]; // formatea a 'yyyy-MM-dd'
    this.fecha_fin = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]; // formatea a 'yyyy-MM-dd'
  }

  getLista() {
    this._contratoService.getList().subscribe(data => {
      this.lista = data;
    })
  }
  getCuartos(){
    this._cuartoService.getCuartos().subscribe(data => {
      this.listCuarto = data;
    })
  }

  getInquilinos(){
    this._inquilinoService.getList().subscribe(data => {
      this.listInquilino = data;
    })
  }

  AbrirModal(){
    this.accion = 'Agregar';
    this.resetForm();
    this.openModal();
  }

  Add(){
    // Validamos que el Contrato ingrese valores
    if (this.fecha_fin == null || this.fecha_fin == null || this.pagoadelanto == null || 
        this.id_inquilino == 0 || this.id_cuarto == 0
    ) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }
    
    // Creamos el objeto
    var contrato:  Contrato = {
      id: (this.id== undefined)?0:this.id,
      fecha_inicio: this.fecha_inicio,
      fecha_fin: this.fecha_fin,
      estado: this.estado,
      pagoadelanto: this.pagoadelanto,
      id_cuarto: this.id_cuarto,
      id_inquilino: this.id_inquilino
    }

    this.loading = true;
    if(this.id == undefined){
      this._contratoService.save(contrato).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success(`El Contrato fue registrado con exito`, 'Contrato registrado');
          this.resetForm();
          this.closeModal();
          this.getLista();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this._errorService.msjError(e);
        }
      })
    }else{
     
      this._contratoService.update(this.id,contrato).subscribe({
        next: (v) => {
          this.loading = false;
          this.accion = 'Agregar';
          this.toastr.success(`El Contrato con ID ${this.id} fue Actualizado con exito`, 'Contrato Actualizado');
          this.resetForm();
          this.closeModal();
          this.getLista();
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this._errorService.msjError(e);
        }
      })


    }

  }

  Update(contrato: Contrato){
    this.accion = 'Actualizar';
    this.id = contrato.id;
    this.fecha_inicio = contrato.fecha_inicio.split('T')[0],
    this.fecha_fin = contrato.fecha_fin.split('T')[0],
    this.estado = contrato.estado,
    this.pagoadelanto = contrato.pagoadelanto,
    this.id_cuarto = contrato.id_cuarto,
    this.id_inquilino = contrato.id_inquilino
    this.openModal();
   }

   Delete(item: any){
    this.loading = true;
    
    this._contratoService.delete(item.id).subscribe({
      next: (v) => {
        this.toastr.success(`El Contrato con ID ${item.id} fue elimado con exito`, 'Contrato Eliminado');
        var contrato: any = { estado: true }
          this._cuartoService.updateEstado(item.id_cuarto, contrato).subscribe({
            next: (res) => {
              this.toastr.success('El estado del cuarto se actualizó correctamente', 'Estado Actualizado');
            },
            error: (e: HttpErrorResponse) => {
              this.toastr.error('Hubo un error al actualizar el estado del cuarto', 'Error');
              this.loading = false;
            }
          });
        this.getLista();
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorService.msjError(e);
      }
    })

  }

   private resetForm() {
    this.id = undefined;
    this.id_cuarto = 0;
    this.id_inquilino = 0;
    this.CargarFechas();
  }

  // Método para abrir el modal
  openModal() {
    $('#myModal').modal('show');
  }

  // Método para cerrar el modal
  closeModal() {
    $('#myModal').modal('hide');
  }

}
