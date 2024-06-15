import { Contrato } from "./contrato";
export interface Deuda {
    id: number,
    monto_deuda: number,
    mes: number,
    fecha: Date,
    estado: boolean,
    id_contrato: number,
    ContratoAlquiler?: Contrato // Relación con Inquilino
}