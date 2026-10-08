import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Building2, 
  DollarSign, 
  Layers, 
  Tag, 
  ShieldAlert 
} from 'lucide-react';

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Selected product for edit/delete
  const [currentProduct, setCurrentProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
    store: user?.store || 'Tienda Central'
  });

  const canCreate = user?.role === 'Administrador del Sistema' || user?.role === 'Gerente de Tienda';
  const canEdit = user?.role !== 'Auditor';
  const canDelete = user?.role === 'Administrador del Sistema' || user?.role === 'Gerente de Tienda';
  const isEmployee = user?.role === 'Empleado de Ventas';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/api/products');
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Error al obtener productos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        })
      });
      setSuccess('Producto creado exitosamente');
      setIsCreateOpen(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        imageUrl: '',
        store: user?.store || 'Tienda Central'
      });
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Error al crear producto');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let bodyData = {};
      if (isEmployee) {
        bodyData = { stock: Number(formData.stock) };
      } else {
        bodyData = {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stock: Number(formData.stock),
          category: formData.category,
          imageUrl: formData.imageUrl
        };
      }

      await apiRequest(`/api/products/${currentProduct._id}`, {
        method: 'PUT',
        body: JSON.stringify(bodyData)
      });

      setSuccess(isEmployee ? 'Stock actualizado exitosamente' : 'Producto actualizado exitosamente');
      setIsEditOpen(false);
      setCurrentProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Error al actualizar producto');
    }
  };

  const handleDeleteConfirm = async () => {
    setError('');
    setSuccess('');

    try {
      await apiRequest(`/api/products/${currentProduct._id}`, {
        method: 'DELETE'
      });
      setSuccess('Producto eliminado exitosamente');
      setIsDeleteOpen(false);
      setCurrentProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Error al eliminar producto');
    }
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      store: product.store
    });
    setIsEditOpen(true);
  };

  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteOpen(true);
  };

  // Filtered products
  const categories = ['ALL', ...new Set(products.map(p => p.category).filter(Boolean))];
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
            <Package className="w-7 h-7 text-indigo-600" />
            <span>Gestión de Productos</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Consulta y administración de inventario según permisos de rol (<span className="font-semibold text-gray-800">{user?.role}</span>).
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Producto</span>
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-700 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o descripción..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="sm:w-64 flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="ALL">Todas las categorías</option>
            {categories.filter(c => c !== 'ALL').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Cargando catálogo de productos...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No se encontraron productos registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-4 px-6">Producto</th>
                  <th className="py-4 px-6">Categoría</th>
                  <th className="py-4 px-6">Precio</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Tienda</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{p.name}</div>
                      {p.description && <div className="text-xs text-gray-500 truncate max-w-xs">{p.description}</div>}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                        {p.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">
                      ${p.price?.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        p.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock} un.
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">
                        <Building2 className="w-3 h-3" />
                        {p.store}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {canEdit && (
                        <button
                          onClick={() => openEditModal(p)}
                          title={isEmployee ? 'Actualizar Stock' : 'Editar Producto'}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => openDeleteModal(p)}
                          title="Eliminar Producto"
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {!canEdit && !canDelete && (
                        <span className="text-xs text-gray-400 italic">Solo lectura</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Crear Nuevo Producto</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Laptop Lenovo"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción del producto..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2500"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="10"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Categoría</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Computadoras"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Tienda</label>
                  <select
                    value={formData.store}
                    disabled={user?.role === 'Gerente de Tienda'}
                    onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                  >
                    <option value="Tienda Central">Tienda Central</option>
                    <option value="Tienda Norte">Tienda Norte</option>
                    <option value="Tienda Sur">Tienda Sur</option>
                    <option value="Tienda Este">Tienda Este</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30"
                >
                  Crear Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && currentProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {isEmployee ? 'Actualizar Stock de Producto' : 'Editar Producto'}
                </h3>
                <p className="text-xs text-gray-500">{currentProduct.name} ({currentProduct.store})</p>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isEmployee && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-amber-800 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Como Empleado de Ventas, solo puede actualizar el stock de este producto.</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {!isEmployee && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Descripción</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Precio ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Categoría</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {isEmployee ? 'Nuevo Stock' : 'Stock'}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30"
                >
                  {isEmployee ? 'Actualizar Stock' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteOpen && currentProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-scaleUp text-center">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Eliminar Producto</h3>
            <p className="text-sm text-gray-500 mb-6">
              ¿Está seguro de eliminar <span className="font-semibold text-gray-800">"{currentProduct.name}"</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="w-1/2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-red-600/30"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
