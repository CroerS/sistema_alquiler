import { Router } from 'express';
import { getInquilinos,GetInquilino,NewInquilino,UpdateInquilino,DeleteInquilino } from '../controllers/inquilino';
import validateToken from './validate-token';

const router = Router();

router.get('/',validateToken, getInquilinos) //Ruta para listar Registros
router.get('/:id',validateToken, GetInquilino) //Ruta para Buscar Registro
router.post('/',validateToken, NewInquilino) //Ruta para Guardar Registro
router.put('/:id',validateToken, UpdateInquilino) //Ruta para Modificar Registro
router.delete('/:id',validateToken, DeleteInquilino) //Ruta para Eliminar Registro
export default router;