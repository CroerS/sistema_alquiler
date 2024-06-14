import { Router } from 'express';
import { getContraAlquilers,GetContratoAlquiler ,NewContratoAlquiler ,UpdateContratoAlquiler ,DeleteContratoAlquiler,actualizarEstado, VerPDFContrato  } from '../controllers/contrato';
import validateToken from './validate-token';

const router = Router();

router.get('/',validateToken, getContraAlquilers) //Ruta para listar Registros
router.get('/:id',validateToken, GetContratoAlquiler) //Ruta para Buscar Registro
router.post('/',validateToken, NewContratoAlquiler) //Ruta para Guardar Registro
router.put('/:id',validateToken, UpdateContratoAlquiler) //Ruta para Modificar Registro
router.put('/estado/:id',validateToken, actualizarEstado) //Ruta para actualizar estado
router.delete('/:id',validateToken, DeleteContratoAlquiler) //Ruta para Eliminar Registro
//endpoint para el pdf
router.get('/PDFcontrato/:id',validateToken, VerPDFContrato) //Ruta para Buscar Registro

export default router;