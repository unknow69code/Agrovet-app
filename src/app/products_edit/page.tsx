"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, FileText, FileSpreadsheet } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import Swal from "sweetalert2";

type ProductType = {
  id_producto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio_venta: number;
  precio_compra: number;
  foto_url: string;
  quantity: number; // This seems to be for cart logic, not direct product data
};

export default function ProductList() {
  // State for the "Update Stock/Price" modal
  const [showUpdateStockPriceModal, setShowUpdateStockPriceModal] = useState(false);
  // State for the "Edit Product Details" modal
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        const withQuantity = data.map((p: any) => ({ ...p, quantity: 1 }));
        setProducts(withQuantity);
        setFilteredProducts(withQuantity);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = products.filter((product) =>
      product.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Function to open the "Update Stock/Price" modal
  const openUpdateStockPriceModal = (product: ProductType) => {
    setSelectedProduct(product);
    setNewPrice(product.precio_compra.toString()); // Initialize with current purchase price
    setNewStock(product.stock.toString()); // Initialize with current stock
    setShowUpdateStockPriceModal(true);
  };

  // Function to open the "Edit Product Details" modal
  const openEditDetailsModal = (product: ProductType) => {
    setSelectedProduct(product);
    setShowEditDetailsModal(true);
  };

  // Function to close any modal and reset selected product
  const closeAllModals = () => {
    setShowUpdateStockPriceModal(false);
    setShowEditDetailsModal(false);
    setSelectedProduct(null); // Clear selected product when closing any modal
    setNewPrice(""); // Also clear these inputs
    setNewStock("");
  };

  const handleDeleteProduct = async (id_producto: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/products/${id_producto}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const errorData = await res.json();
          enqueueSnackbar(`Error: ${errorData.error}`, { variant: "error" });
        } else {
          enqueueSnackbar("Producto eliminado correctamente", {
            variant: "success",
          });

          // Actualiza la lista
          const updatedProducts = await fetch("/api/products").then((res) =>
            res.json()
          );
          const withQuantity = updatedProducts.map((p: any) => ({
            ...p,
            quantity: 1,
          }));
          setProducts(withQuantity);
          setFilteredProducts(withQuantity);
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error al eliminar el producto", { variant: "error" });
      }
    }
  };

  const handleSaveChanges = async () => {
    // This function is for the "Edit Product Details" modal
    if (!selectedProduct) return;

    try {
      const res = await fetch(`/api/products/${selectedProduct.id_producto}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedProduct),
      });

      if (!res.ok) {
        const errorData = await res.json();
        enqueueSnackbar(`Error: ${errorData.error}`, { variant: "error" });
      } else {
        enqueueSnackbar("Producto actualizado correctamente", {
          variant: "success",
        });
        const updatedProducts = await fetch("/api/products").then((res) =>
          res.json()
        );
        const withQuantity = updatedProducts.map((p: any) => ({
          ...p,
          quantity: 1,
        }));
        setProducts(withQuantity);
        setFilteredProducts(withQuantity);
        closeAllModals(); // Close the modal after saving
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Error al guardar cambios", { variant: "error" });
    }
  };

  const handleUpdateProduct = async () => {
    // This function is for the "Update Stock/Price" modal
    if (!selectedProduct) return;

    try {
      const res = await fetch(
        `/api/products/name/${encodeURIComponent(
          selectedProduct.nombre
        )}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nuevoPrecio: parseFloat(newPrice),
            nuevoStock: parseInt(newStock),
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        enqueueSnackbar(`Error: ${errorData.error}`, { variant: "error" });
      } else {
        enqueueSnackbar("Producto actualizado correctamente", {
          variant: "success",
        });
        // Refresca la lista
        const updatedProducts = await fetch("/api/products").then((res) =>
          res.json()
        );
        const withQuantity = updatedProducts.map((p: any) => ({
          ...p,
          quantity: 1,
        }));
        setProducts(withQuantity);
        setFilteredProducts(withQuantity);
        closeAllModals(); // Close the modal after updating
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Error al actualizar el producto", { variant: "error" });
    }
  };

  if (loading) return <div className="p-6">Cargando productos...</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold items-center gap-2">
          📦 Lista de productos
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <Input
          placeholder="Buscar por nombre"
          className="w-64"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-blue-700">
              <TableRow>
                <TableHead className="text-center text-white">Código</TableHead>
                <TableHead className="text-white">Nombre</TableHead>
                <TableHead className="text-white">Descripción</TableHead>
                <TableHead className="text-white">Precio Venta</TableHead>
                <TableHead className="text-white">Precio Compra</TableHead>
                <TableHead className="text-white">Stock</TableHead>
                <TableHead className="text-white">Foto</TableHead>
                <TableHead className="text-white">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p.id_producto}>
                  <TableCell className="text-center">{p.id_producto}</TableCell>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.descripcion}</TableCell>
                  <TableCell>S/. {p.precio_venta}</TableCell>
                  <TableCell>S/. {p.precio_compra}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>
                    <img
                      src={p.foto_url}
                      alt="foto"
                      width={50}
                      height={50}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="link"
                          className="text-green-600 border border-green-600"
                          onClick={() => openUpdateStockPriceModal(p)} // Changed to open specific modal
                        >
                          <Plus className="w-4 h-4" />
                          Stock
                        </Button>
                        <Button
                          size="sm"
                          variant="link"
                          className="text-blue-600 border border-blue-600"
                          onClick={() => openEditDetailsModal(p)} // Changed to open specific modal
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="link"
                        className="text-red-600 border border-red-600"
                        onClick={() => handleDeleteProduct(p.id_producto)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal for "Actualizar stock y precio" */}
      {showUpdateStockPriceModal && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-bold text-center">
              Actualizar producto
            </h2>
            <h4> {selectedProduct.nombre} </h4>
            <p className="text-sm text-gray-600 text-center">
              Para actualizar stock y precio debe ingresar la cantidad comprada
              y el precio de compra.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Precio de compra (S/.)
                </label>
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <Input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={closeAllModals}> {/* Changed to closeAllModals */}
                Cancelar
              </Button>
              <Button
                onClick={handleUpdateProduct}
                className="bg-blue-600 text-white"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for "Editar producto" (general details) */}
      {showEditDetailsModal && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center">Editar producto</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <Input
                  value={selectedProduct.nombre}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, nombre: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <Input
                  value={selectedProduct.descripcion}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      descripcion: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio Venta (S/.)</label>
                  <Input
                    type="number"
                    value={selectedProduct.precio_venta}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        precio_venta: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Precio Compra (S/.)</label>
                  <Input
                    type="number"
                    value={selectedProduct.precio_compra}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        precio_compra: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Foto (URL)</label>
                <Input
                  value={selectedProduct.foto_url}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      foto_url: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={closeAllModals}> {/* Changed to closeAllModals */}
                Cancelar
              </Button>
              <Button className="bg-blue-600 text-white" onClick={handleSaveChanges}>
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}