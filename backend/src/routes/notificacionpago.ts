import { Router } from 'express';
import { getNotificacionPagos,GetNotificacionPago,NewNotificacionPago,UpdateNotificacionPago,DeleteNotificacionPago } from '../controllers/notificacionpago';
import validateToken from './validate-token';

const router = Router();

router.get('/',validateToken, getNotificacionPagos) //Ruta para listar Registros
router.get('/:id',validateToken, GetNotificacionPago) //Ruta para Buscar Registro
router.post('/',validateToken, NewNotificacionPago) //Ruta para Guardar Registro
router.put('/:id',validateToken, UpdateNotificacionPago) //Ruta para Modificar Registro
router.delete('/:id',validateToken, DeleteNotificacionPago) //Ruta para Eliminar Registro
export default router;