import express from 'express';
import { carpeta, tiempo } from './config/config';
import { Declarar } from './declarar';
import { LeyendoArchivos } from './leerArchivos';
import { MoverDocumento } from './moverDocumento';
import { Documento } from './types';

const app = express();
let mock: Documento[] = []


setInterval(() => {
    LeyendoArchivos(carpeta)
        .then((data: Documento[]) => {
            mock = data;
            // Declarar(data)
            //     .then((rta: any) => {
            //         console.log(rta);
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     });
        })
        .catch((error: Error) => {
            console.log(error);
        });

}, tiempo)


/**Route */
app.listen(3009, () => {
    console.log("SERVICIO DE TXT INICIADO");
    console.log("Server iniciado");

    app.get('/', (req, res) => {
        res.send({ data: mock });
    })
})
