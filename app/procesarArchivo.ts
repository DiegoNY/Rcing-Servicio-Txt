import fs from 'fs';
import { idSucursal, ruc } from './config/config';
import { Documento } from './types';

const validarInformacionEnvio = (data: string) => {
    
}

export const ProcesarArchivo = (archivoPath: string) => {
    const data = fs.readFileSync(archivoPath, 'utf8');
    const lines = data.split('\n');

    const venta: Documento = {
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
        idSucursal: idSucursal,
        Estado: 1,
        leyenda: "",
        Vendedor: "",
        CORRELATIV: "",
    };

    for (let i = 0; i < lines.length; i++) {

        const fields = lines[i].split('|');

        switch (fields[0]) {
            case '01':
                venta.ruc = ruc;
                venta.TipoDoc = fields[7];
                venta.CORRELATIV = `${fields[8]}-${fields[9]}`;
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
                break;
            case '02':
                venta.Vendedor = fields[1];
                venta.FormaPago = fields[2];
                break;
            case '03':
                const items = {
                    CodigoItem: fields[1],
                    Descripcion: fields[2],
                    Cantidad: parseFloat(fields[3]),
                    Unidad: fields[4],
                    // baseItem: parseFloat(fields[5]),
                    Igv: parseFloat(fields[6]),
                    Precio: parseFloat(fields[7]),
                    SubTotal: parseFloat(fields[8]),
                    Total: parseFloat(fields[9]),
                    Descuento: parseFloat(fields[10]),
                    Lote: fields[11],
                    FechaVcto: fields[12],
                    Labora: fields[13],
                    Pastilla: null,
                    Palote: null
                };

                venta.items.push(items);
                break;
            case '04':
                const cuotas = {
                    MontoCuota: fields[3],
                    FechaCuota: fields[2],
                    NroCuota: fields[1],
                }
                venta.cuotas.push(cuotas);

        }
    }
    // console.log(venta);
    return venta;
    // throw new Error("Error para parar tooo");
}
