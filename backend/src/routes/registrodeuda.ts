import { Router } from 'express';
import { getRegistroDeudas,GetRegistroDeuda,NewRegistroDeuda,UpdateRegistroDeuda,DeleteRegistroDeuda } from '../controllers/registrodeuda';
import validateToken from './validate-token';

const router = Router();

router.get('/',validateToken, getRegistroDeudas) //Ruta para listar Registros
router.get('/:id',validateToken, GetRegistroDeuda) //Ruta para Buscar Registro
router.post('/',validateToken, NewRegistroDeuda) //Ruta para Guardar Registro
router.put('/:id',validateToken, UpdateRegistroDeuda) //Ruta para Modificar Registro
router.delete('/:id',validateToken, DeleteRegistroDeuda) //Ruta para Eliminar Registro
export default router;