"use client";

import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

// Extend your product type to include quantity for local state management
type ProductType = {
  id_producto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio_venta: number;
  foto_url: string;
  // Add a quantity property for the input value in the UI
  quantity: number;
};

function Products() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        // Initialize each product with a default quantity of 1
        const productsWithQuantity = data.map((p: any) => ({ ...p, quantity: 1 }));
        setProducts(productsWithQuantity);
        setFilteredProducts(productsWithQuantity);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter based on the original products array
    const filtered = products.filter((product) =>
      product.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // New handler to update the quantity for a specific product
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    // Ensure quantity is at least 1 and not more than stock
    const validatedQuantity = Math.max(1, Math.min(newQuantity, products.find(p => p.id_producto === productId)?.stock || 1));

    setFilteredProducts((prevFilteredProducts) =>
      prevFilteredProducts.map((product) =>
        product.id_producto === productId
          ? { ...product, quantity: validatedQuantity }
          : product
      )
    );
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id_producto === productId
          ? { ...product, quantity: validatedQuantity }
          : product
      )
    );
  };

  const handleAddToCart = (productToAdd: ProductType) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const quantityToAdd = productToAdd.quantity || 1; // Use the quantity from the input, default to 1

    if (quantityToAdd <= 0) {
      enqueueSnackbar(`La cantidad debe ser al menos 1 para "${productToAdd.nombre}".`, { variant: "warning" });
      return;
    }
    if (quantityToAdd > productToAdd.stock) {
        enqueueSnackbar(`No hay suficiente stock para "${productToAdd.nombre}". Stock disponible: ${productToAdd.stock}`, { variant: "warning" });
        return;
    }


    const existingProductIndex = cart.findIndex((item: any) => item.id_producto === productToAdd.id_producto);

    if (existingProductIndex !== -1) {
      const currentCartQuantity = cart[existingProductIndex].cantidad;
      const newTotalQuantity = currentCartQuantity + quantityToAdd;

      if (newTotalQuantity > productToAdd.stock) {
        enqueueSnackbar(`No puedes agregar ${quantityToAdd} más de "${productToAdd.nombre}". Solo quedan ${productToAdd.stock - currentCartQuantity} en stock.`, { variant: "warning" });
        return;
      }
      cart[existingProductIndex].cantidad = newTotalQuantity;
    } else {
      cart.push({ ...productToAdd, cantidad: quantityToAdd });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    enqueueSnackbar(`Agregado ${quantityToAdd} de "${productToAdd.nombre}" al carrito.`, { variant: "success" });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-10 text-center">
          Nuestros Productos
        </h2>

        <div className="mb-8 flex justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar producto..."
            className="px-4 py-2 border border-gray-300 rounded-lg w-1/2"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id_producto}
              className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <a href={`/product/${product.id_producto}`}>
                <img
                  src={product.foto_url}
                  alt={product.nombre}
                  className="h-56 w-full rounded-lg object-cover transition group-hover:opacity-80"
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-blue-800">{product.nombre}</h3>
                  <p className="text-sm text-gray-700">{product.descripcion}</p>
                  <p className="text-sm font-semibold text-gray-700">{"Cantidad/Stock: " + product.stock}</p>
                  <p className="mt-2 text-base font-bold text-gray-700">
                    {"$" + product.precio_venta + " vl/unt"}
                  </p>
                </div>
              </a>

              {/* Quantity Input */}
              <div className="mt-3 flex items-center justify-between">
                <label htmlFor={`quantity-${product.id_producto}`} className="text-sm font-medium text-gray-700 mr-2">
                  Cantidad:
                </label>
                <input
                  type="number"
                  id={`quantity-${product.id_producto}`}
                  min="1"
                  max={product.stock} // Limit to available stock
                  value={product.quantity}
                  onChange={(e) => handleQuantityChange(product.id_producto, parseInt(e.target.value))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-center text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition"
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;