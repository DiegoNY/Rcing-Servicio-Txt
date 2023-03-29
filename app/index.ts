import fs from 'fs';
import path from 'path';
import { carpeta, tiempo } from './config/config';

const archivosProcesados: any = {};
console.log("SERVICIO DE TXT INICIADO");


const ProcesarArchivo = (archivoPath: string) => {
    const data = fs.readFileSync(archivoPath, 'utf8');
    const lines = data.split('\n');
    const venta = {
        cliente: "",
        NroDocCliente: "",
        TipoDocCliente: "",
        DirCliente: "",
        TipoDoc: "",
        CodVenta: "",
        Serie: "",
        Correlativo: "",
        FechaEmision: "",
        HoraEmision: "",
        FechaVencimiento: "",
        items: [],
        cuotas: [],
        Moneda: "",
        FormaPago: "",
        Base: 0,
        Igv: 0,
        MontoExcento: 0,
        MontoGratuito: 0,
        Descuento: 0,
        TotalDocumento: 0,
        Porcentaje: 18,
        NGuia: 0,
        TipoCambio: 0,
        FechaReferencia: null,
        TipoReferencia: null,
        DocumentoReferencia: null,
        CodMotivo: null,
        Motivo: null,
        otros: "",
        Detraccion: 0,
        PorcDetraccion: 0,
        MontoDetraccion: 0,
        RegimenPercepcion: 0,
        TasaPercepcion: 0,
        MontoPercepcion: 0,
        ruc: "",
        idSucursal: 1,
        Estado: 1,
        leyenda: ""
    };

    for (let i = 0; i < lines.length; i++) {

        const fields = lines[i].split('|');

        switch (fields[0]) {
            case '01':
                venta.ruc = fields[1];
                venta.TipoDoc = fields[7];
                venta.CodVenta = `${fields[8]}-${fields[9]}`;
                venta.Serie = fields[8];
                venta.Correlativo = fields[9];
                venta.FechaEmision = fields[5];
                venta.HoraEmision = fields[6];
                venta.FechaVencimiento = fields[5];
                venta.TipoDocCliente = fields[12];
                venta.NroDocCliente = fields[13];
                venta.cliente = fields[14];
                venta.DirCliente = fields[15];
                venta.Moneda = fields[16];
                venta.Base = parseFloat(fields[17]);
                venta.Igv = parseFloat(fields[18]);
                venta.TotalDocumento = parseFloat(fields[20]);
                venta.MontoExcento = parseFloat(fields[21]);
                venta.MontoGratuito = parseFloat(fields[22]);
                venta.leyenda = fields[23];
                venta.Porcentaje = parseFloat(fields[24]);
                // venta.impuesto = parseFloat(fields[18]);
                // venta.totalDescuento = parseFloat(fields[19]);
                // venta.totalRecibo = parseFloat(fields[20]);
                // venta.totalExcento = parseFloat(fields[21]);
                // venta.totalGratuito = parseFloat(fields[22]);
                // venta.leyenda = fields[23];
                // venta.porcentajeImpuesto = parseFloat(fields[24]);
                break;
            case '02':
                // venta.vendedor = fields[1];
                // venta.formaPago = fields[2];
                break;
            case '03':
                const producto = {
                    codigo: fields[1],
                    nombre: fields[2],
                    cantidad: parseFloat(fields[3]),
                    unidad: fields[4],
                    baseItem: parseFloat(fields[5]),
                    impuestoItem: parseFloat(fields[6]),
                    precioConIgv: parseFloat(fields[7]),
                    precioSinIgv: parseFloat(fields[8]),
                    importeItem: parseFloat(fields[9]),
                    descuentoItem: parseFloat(fields[10]),
                    lote: fields[11],
                    fechaVct: fields[12],
                    laboratorio: fields[13]
                };
        }
    }
    console.log(venta);
    throw new Error("Error para parar tooo");

}


const LeyendoArchivos = (carpeta: string) => {

    fs.readdir(carpeta, (error, archivos) => {

        if (error) {
            console.error(`Error al leer la carpeta ${error}`);
            return;
        }

        archivos.forEach(archivo => {

            const archivoPath = path.join(carpeta, archivo);

            if (archivosProcesados[archivo]) {
                console.log(`El archivo ${archivo} ya ha sido procesado`);
                return;
            }

            console.log(`Procesando archivo ${archivo}`);
            ProcesarArchivo(archivoPath);
            // Registrar el archivo como procesado
            archivosProcesados[archivo] = true;
        })

    })

}

setInterval(() => {
    LeyendoArchivos(carpeta);
}, tiempo)



