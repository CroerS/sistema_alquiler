import { Router } from 'express';
import { getPagos,GetPago,NewPago,UpdatePago,DeletePago } from '../controllers/pago';
import validateToken from './validate-token';

const router = Router();

router.get('/',validateToken, getPagos) //Ruta para listar Registros
router.get('/:id',validateToken, GetPago) //Ruta para Buscar Registro
router.post('/',validateToken, NewPago) //Ruta para Guardar Registro
router.put('/:id',validateToken, UpdatePago) //Ruta para Modificar Registro
router.delete('/:id',validateToken, DeletePago) //Ruta para Eliminar Registro
export default router;