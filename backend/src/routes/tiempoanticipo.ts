import { Router } from 'express';
import { getTiempoAnticipos,GetTiempoAnticipo,NewTiempoAnticipo,UpdateTiempoAnticipo,DeleteDTiempoAnticipo } from '../controllers/tiempoanticipo';
import validateToken from './validate-token';

const router = Router();

router.get('/',validateToken, getTiempoAnticipos) //Ruta para listar Registros
router.get('/:id',validateToken, GetTiempoAnticipo) //Ruta para Buscar Registro
router.post('/',validateToken, NewTiempoAnticipo) //Ruta para Guardar Registro
router.put('/:id',validateToken, UpdateTiempoAnticipo) //Ruta para Modificar Registro
router.delete('/:id',validateToken, DeleteDTiempoAnticipo) //Ruta para Eliminar Registro

export default router;