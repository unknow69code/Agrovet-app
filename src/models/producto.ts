// src/models/producto.ts

import { queryDatabase } from "../libs/db";

export async function createProduct(
    nombre: string,
    descripcion: string,
    precio_compra: number,
    precio: number,
    stock: number,
    fecha_vencimiento: string,
    lote: string,
    foto_url: string
) {
    // Validar los campos requeridos
    if (!nombre || !precio || stock < 0 || precio_compra < 0) {
        throw new Error("Campos requeridos (nombre, precio, stock, precio_compra) son obligatorios");
    }

    try {
        // Verificar si ya existe un producto con el mismo nombre y lote
        const existingProduct: any = await queryDatabase(
            "SELECT id_producto FROM productos WHERE nombre = ? AND lote = ?",
            [nombre, lote]
        );

        if (existingProduct && existingProduct.length > 0) {
            throw new Error(`Ya existe un producto con el nombre "${nombre}" y lote "${lote}".`);
        }

        // Insertar el producto en la base de datos
        const result: any = await queryDatabase(
            `INSERT INTO productos (
                nombre, descripcion, precio_compra, precio_venta , stock, fecha_vencimiento, 
                lote, foto_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                descripcion,
                precio_compra,
                precio,
                stock,
                fecha_vencimiento,
                lote,
                foto_url,
            ]
        );

        console.log("Producto insertado correctamente", result);
        return {
            id_producto: result.insertId,
            nombre,
            descripcion,
            precio_compra,
            precio,
            stock,
        };
    } catch (error: any) {
        console.error("Error al insertar el producto:", error.message);
        throw error;
    }
}

export async function getProducts() {
    const query = "SELECT * FROM productos ORDER BY id_producto ASC";
    try {
        console.log("Consulta a ejecutar:", query);
        const rows = await queryDatabase(query, []);
        return rows;
    } catch (error: any) {
        console.error("Error al obtener los productos:", error.message);
        throw new Error("Error al obtener los productos: " + error.message);
    }
}

export async function getNameProducts(nombre: any) {
    const query = "SELECT nombre FROM productos ORDER BY id_producto ASC";
    try {
        console.log("Consulta a ejecutar:", query);
        const rows = await queryDatabase(query, []);
        return rows;
    } catch (error: any) {
        console.error("Error al obtener los productos:", error.message);
        throw new Error("Error al obtener los productos: " + error.message);
    }
}

export async function updateStockAndPriceByName(nombre: string, stocksumando: number, nuevoPrecio: number) {
    try {
        const result = await queryDatabase(
            "UPDATE productos SET stock = ?, precio_compra = ? WHERE nombre = ?",
            [stocksumando, nuevoPrecio, nombre]
        );
        return result;
    } catch (error: any) {
        console.error(`Error al actualizar el stock del producto "${nombre}":`, error.message);
        throw new Error(`Error al actualizar el stock del producto: ${error.message}`);
    }
}

export async function countProducts() {
    const countProducts = "SELECT COUNT(*) AS total FROM productos";
    try {
        console.log("Consulta a ejecutar:", countProducts);
        const rows = await queryDatabase(countProducts, []);
        return rows;
    } catch (error: any) {
        console.error("Error al obtener los productos:", error.message);
        throw new Error("Error al obtener los productos: " + error.message);
    }
}

// Nueva función para actualizar el stock por ID
export async function actualizarStockProducto(idProducto: number, cantidadVendida: number): Promise<any> {
    try {
        const result = await queryDatabase(
            "UPDATE productos SET stock = stock - ? WHERE id_producto = ?",
            [cantidadVendida, idProducto]
        );
        return result;
    } catch (error: any) {
        console.error(`Error al actualizar el stock del producto con ID ${idProducto}:`, error.message);
        throw new Error(`Error al actualizar el stock del producto: ${error.message}`);
    }
}

