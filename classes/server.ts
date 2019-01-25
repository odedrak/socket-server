import express from 'express';
import { SERVER_PORT } from '../global/enviroment';
import socketIO from 'socket.io';
import http from 'http';
import * as socket  from '../sockets/socket';



export default class Server {
    
    private static _instance: Server;

    public app: express.Application; 
    public port: number;
    public io: socketIO.Server;
    private httpServer: http.Server;

    // private -> implementamos patron singleton para asegurarnos de que solo exista una sola instancia de la clase server
    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        
        // Creamos el httpServer con la configuracion de express. Lo usaremos para la comunicacion con socketIO ya que express no puede comunicarse con express
        this.httpServer = new http.Server(this.app);

        this.io = socketIO(this.httpServer);
        this.escucharSockets();
    }

    // para patron singleton
    public static get instance() {
        return this._instance || (this._instance = new this());        
    }

    private escucharSockets() {
        console.log('Escuchando conexiones - sockets');

        // Escuchar evento conexion
        this.io.on('connection', cliente => {
            console.log('Cliente conectado');

            // Mensajes
            socket.mensaje(cliente, this.io);

            // Desconectar
            socket.desconectar(cliente);
        });
        
    }

    start(callback: Function) {
        this.httpServer.listen(this.port, callback);
    }

}