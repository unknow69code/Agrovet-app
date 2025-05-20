import { NextResponse } from "next/server";
import { guardarVenta } from "@/models/factura";
import { jsPDF } from "jspdf";
import fs from 'fs/promises';
import path from 'path';

// Información de la empresa
const nombreAplicacion = "AGROVET SISTEMA DE MANEJO DE VENTAS Y STOCK";
const nombreEmpresa = "Centro Pecuario el Campo S.A.S"; 
const rutaLogo = path.join(process.cwd(), 'public', 'veterinario.png'); // Ajusta la ruta a tu logo
import { actualizarStockProducto } from "@/models/producto"; // Asegúrate de crear este archivo y función

export async function POST(req: Request) {
    try {
        const { cliente, productos, total } = await req.json();

        if (!cliente || !cliente.id || !productos || productos.length === 0 || total === undefined) {
            return NextResponse.json({ error: "Datos de venta incompletos." }, { status: 400 });
        }

        const ventaData = {
            id_cliente: cliente.id,
            total: total,
            productos: productos.map((producto: any) => ({
                id_producto: producto.id,
                cantidad: producto.cantidad,
                precio_unitario: producto.precio_venta,
                nombre: producto.nombre,
            })),
        };

        const idVentaGenerada = await guardarVenta(ventaData);

        // Actualizar el stock de los productos vendidos
        try {
            await Promise.all(
                productos.map(async (producto: any) => {
                    await actualizarStockProducto(producto.id_producto, producto.cantidad);
                    console.log(`Stock del producto ${producto.nombre} actualizado a ${producto.stock - producto.cantidad}`);
                })
            );
            console.log("Stock de productos actualizado con éxito.");
        } catch (error) {
            console.error("Error al actualizar el stock de los productos:", error);
            // Considera cómo manejar este error: ¿revertir la venta?, ¿registrar el error?
        }

        // ------------------- GENERACIÓN DEL PDF CON jsPDF (ESTILO MEJORADO + LOGO) -------------------
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        let y = 20;
        const lineHeight = 7;
        const columnWidths = [pageWidth * 0.5, pageWidth * 0.15, pageWidth * 0.15, pageWidth * 0.2]; // Nombre, Cantidad, Precio, Total

        // Agregar logo
        try {
            const logoImage = await fs.readFile(rutaLogo, 'base64');
            pdf.addImage(logoImage, 'PNG', margin, y, 30, 30); // Ajusta las coordenadas y dimensiones
        } catch (error) {
            console.error("Error al cargar el logo:", error);
            // Si falla la carga del logo, continúa sin él
        }

        // Nombre de la aplicación/empresa
        pdf.setFontSize(16);
        pdf.text(nombreAplicacion, margin + 35, y + 10);
        pdf.setFontSize(10);
        pdf.text(nombreEmpresa, margin + 35, y + 20);
        y += 35;

        // Encabezado de la factura
        pdf.setFontSize(20);
        pdf.text('FACTURA DE VENTA', pageWidth / 2, y, { align: 'center' });
        y += lineHeight * 3;

        pdf.setFontSize(12);
        pdf.text(`Número: ${idVentaGenerada}`, margin, y);
        pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth - margin, y, { align: 'right' });
        y += lineHeight * 2;

        // Información del Comprador
        pdf.setFontSize(14);
        pdf.text('Información del Comprador', margin, y);
        y += lineHeight;
        pdf.setFontSize(12);
        pdf.text(`Nombre: ${cliente.nombre}`, margin, y);
        y += lineHeight;
        pdf.text(`Cédula: ${cliente.cedula}`, margin, y);
        y += lineHeight * 2;

        // Detalles de la Venta (Tabla)
        pdf.setFontSize(14);
        pdf.text('Detalles de la Venta', margin, y);
        y += lineHeight;

        // Encabezados de la tabla
        const headers = ['Producto', 'Cantidad', 'Precio', 'Total'];
        let x = margin;
        pdf.setFontSize(10);
        headers.forEach((header, i) => {
            pdf.text(header, x, y);
            x += columnWidths[i];
        });
        y += lineHeight;
        pdf.line(margin, y, pageWidth - margin, y);
        y += lineHeight;

        // Filas de la tabla de productos
        pdf.setFontSize(9);
        ventaData.productos.forEach((producto: { nombre: string | string[]; cantidad: number; precio_unitario: number; }) => {
            let x = margin;
            pdf.text(producto.nombre, x, y);
            x += columnWidths[0];
            pdf.text(producto.cantidad.toString(), x, y, { align: 'right' });
            x += columnWidths[1];
            pdf.text(`$${producto.precio_unitario.toFixed(2)}`, x, y, { align: 'right' });
            x += columnWidths[2];
            pdf.text(`$${(producto.cantidad * producto.precio_unitario).toFixed(2)}`, x, y, { align: 'right' });
            y += lineHeight;
        });
        pdf.line(margin, y, pageWidth - margin, y);
        y += lineHeight;

        // Total
        pdf.setFontSize(12);
        pdf.text('Total:', pageWidth - margin - columnWidths[3], y, { align: 'right' });
        pdf.setFontSize(14);
        pdf.text(`$${total.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });

        const pdfBuffer = pdf.output('arraybuffer');

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="factura_${idVentaGenerada}.pdf"`,
            },
        });

    } catch (error: any) {
        console.error("Error al procesar el registro de la venta:", error.message);
        return NextResponse.json({ error: "Error al registrar la venta." }, { status: 500 });
    }
}