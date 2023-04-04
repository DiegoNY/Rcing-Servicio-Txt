import express from 'express';
import { carpeta, puerto, tiempo, tiempo_limpiar } from './config/config';
import { Declarar } from './declarar';
import { LeyendoArchivos } from './leerArchivos';
import { MoverDocumento } from './moverDocumento';
import { Documento, RespuestaServicio } from './types';

const app = express();
let mock: Documento[] = []
let mockDocumentosErrores: Documento[] = [];

const LimpiarErrores = () => {
    mockDocumentosErrores = [];
}

const ValidarInformacion = (data: Documento[]) => {
    mockDocumentosErrores.map(docError => {
        const docIndex = data.findIndex(docData => docData?.CodVenta == docError?.CodVenta)
        data.splice(docIndex, 1);
    })
    return data
}

setInterval(() => {
    LeyendoArchivos(carpeta)
        .then((data: Documento[]) => {
            const dataEnvio = ValidarInformacion(data);
            mock = dataEnvio;

            if (dataEnvio.length != 0) {
                console.log("Ejecutando")
                Declarar(dataEnvio)
                    .then((rta: any) => {
                        const { data } = rta;
                        console.log(data);

                        data.map((documento: RespuestaServicio) => {

                            const indexDoc = dataEnvio.findIndex(documentoMock => `${documentoMock.CodVenta}-${documentoMock.TipoDoc}` == documento.documento)

                            if (documento.estatus != 1) {
                                console.log(documento);
                            }

                            if (documento.estatus == 1) {
                                console.log(`El documento ${documento.documento} sera movido procesado exitosamente`)
                                const documentoMover = dataEnvio[indexDoc];

                                MoverDocumento(documentoMover.archivoPath, documentoMover.archivo);
                            } else {
                                console.log(`El documento ${documento.documento} contiene errores`)
                                mockDocumentosErrores.push(dataEnvio[indexDoc])
                            }

                        })
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }

        })
        .catch((error: Error) => {
            console.log(error);
        });

}, tiempo)

setInterval(LimpiarErrores, tiempo_limpiar)

/**Route */
app.listen(puerto, () => {
    console.log("SERVICIO DE TXT INICIADO");
    console.log("Server iniciado");

    app.get('/procesados', (req, res) => {
        LeyendoArchivos(`${__dirname}/sent`)
            .then(rta => {
                res.send({
                    info: "documentos leidos",
                    data: rta
                })
            })
            .catch(erro => {
                res.send({
                    error: true,
                    message: erro
                })
            })
    })

    app.get('/procesando', (req, res) => {
        res.send({ data: mock });
    })

    app.get('/errores', (req, res) => {
        res.send({
            info: 'Documentos con errores',
            data: mockDocumentosErrores
        })
    })
})
