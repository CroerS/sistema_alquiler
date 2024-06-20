import express, { Application } from 'express';
import cors from 'cors';
import routesUser from '../routes/user';
import routesCuarto from '../routes/cuartos';
import routesInquilino from '../routes/inquilino';
import routesContrato from '../routes/contrato';
import routesPago from '../routes/pago';
import routesRegistroDeuda from '../routes/deuda';
import routesTiempoAnticipo from '../routes/tiempoanticipo';
import routesNotificacionPago from '../routes/notificacionpago';
import { User } from './user';
import { Cuarto } from './cuartos';
import { ContratoAlquiler } from './contratoalquiler';
import { Inquilino } from './inquilino';
import { Pago } from './pago';
import { Deuda } from './deuda';
import { TiempoAnticipo } from './tiempoanticipo';
import { NotificacionPago } from './notificacionpago';

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Aplicacion corriendo en el puerto ' + this.port);
        })
    }

    routes() {
        this.app.use('/api/users', routesUser);
        this.app.use('/api/cuartos', routesCuarto);
        this.app.use('/api/inquilinos', routesInquilino);
        this.app.use('/api/contratos', routesContrato);
        this.app.use('/api/pagos', routesPago);
        this.app.use('/api/deudas', routesRegistroDeuda);
        this.app.use('/api/tiempoanticipos', routesTiempoAnticipo)
        this.app.use('/api/notificacionpagos', routesNotificacionPago);
    }

    midlewares() {
        // Parseo body
        this.app.use(express.json());

        // Cors
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            await Inquilino.sync()
            await Cuarto.sync()
            await ContratoAlquiler.sync()
            await Deuda.sync()
            await TiempoAnticipo.sync()
            await NotificacionPago.sync()
            await User.sync()
            await Pago.sync()
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
 }

export default Server;