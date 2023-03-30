import fs from 'fs';

export const MoverDocumento = (archivoPath: string, archivo: string) => {
    fs.rename(archivoPath, `${__dirname}/sent/${archivo}`, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('El archivo ha sido movido exitosamente!');
    });
}