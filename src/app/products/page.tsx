"use client";

import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
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

    const filtered = products.filter((product) =>
      product.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Intentando agregar id_producto:", product.id_producto);
    console.log("IDs en el carrito:", cart.map((item: { id_producto: any; }) => item.id_producto));
    // Usa product.id_producto para buscar si el producto ya existe
    const existingProductIndex = cart.findIndex((item: any) => item.id_producto === product.id_producto);
  
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].cantidad += 1;
    } else {
      // Asegúrate de que el objeto en el carrito también use id_producto como identificador
      cart.push({ ...product, cantidad: 1 });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    enqueueSnackbar(`Producto "${product.nombre}" agregado al carrito.`, { variant: "success" });
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
              <a href={product.href}>
                <img
                  src={product.foto_url}
                  alt={product.nombre}
                  className="h-56 w-full rounded-lg object-cover transition group-hover:opacity-80"
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-blue-800">{product.nombre}</h3>
                  <p className="text-sm text-gray-700">{product.descripcion}</p>
                  <p className="text-sm font-semibold text-gray-700">{"cantidad/stock " + product.stock}</p>
                  <p className="mt-2 text-base font-bold text-gray-700">
                    {"$" + product.precio_venta + " vl/unt"}
                  </p>
                </div>
              </a>

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
