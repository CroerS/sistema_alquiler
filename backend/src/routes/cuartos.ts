import { Router } from 'express';
import { getCuartos,GetCuarto,NewCuarto,UpdateCuarto,DeleteCuarto } from '../controllers/cuarto';
import validateToken from './validate-token';

const router = Router();

router.get('/',validateToken, getCuartos) //Ruta para listar Registros
router.get('/:id',validateToken, GetCuarto) //Ruta para Buscar Registro
router.post('/',validateToken, NewCuarto) //Ruta para Guardar Registro
router.put('/:id',validateToken, UpdateCuarto) //Ruta para Modificar Registro
router.delete('/:id',validateToken, DeleteCuarto) //Ruta para Eliminar Registro
export default router;