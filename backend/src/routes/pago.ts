import { Router } from 'express';
import { getPagos,GetPago,GetRpt,NewPago,UpdatePago,DeletePago,VerExtractoPago } from '../controllers/pago';
import validateToken from './validate-token';

const router = Router();

router.get('/',validateToken, getPagos) //Ruta para listar Registros
router.get('/:id',validateToken, GetPago) //Ruta para Buscar Registro
router.get('/pagoPDF/:id',validateToken, VerExtractoPago) //Ruta para Buscar Registro
router.get('/pdf/:id',validateToken, GetRpt) //Ruta para listar Registros
router.post('/',validateToken, NewPago) //Ruta para Guardar Registro
router.put('/:id',validateToken, UpdatePago) //Ruta para Modificar Registro
router.delete('/:id',validateToken, DeletePago) //Ruta para Eliminar Registro

export default router;