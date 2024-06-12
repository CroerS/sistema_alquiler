import { Router } from 'express';
import { getDeudas,GetDeuda,NewDeuda,UpdateDeuda,DeleteDeuda,OptenerPDF } from '../controllers/deuda';
import validateToken from './validate-token';

const router = Router();

router.get('/',validateToken, getDeudas) //Ruta para listar Registros
router.get('/:id',validateToken, GetDeuda) //Ruta para Buscar Registro
router.get('/pdf/:id',validateToken, OptenerPDF) //VerPDF
router.post('/',validateToken, NewDeuda) //Ruta para Guardar Registro
router.put('/:id',validateToken, UpdateDeuda) //Ruta para Modificar Registro
router.delete('/:id',validateToken, DeleteDeuda) //Ruta para Eliminar Registro

export default router;