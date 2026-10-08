import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { Package, Building2, Shield, Users, ArrowUpRight, CheckCircle, AlertTriangle, Layers } from 'lucide-react';

export default function Dashboard({ setCurrentView }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiRequest('/api/products');
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock || 0), 0);
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-100 mb-4 border border-white/10">
            <Shield className="w-3.5 h-3.5" />
            <span>Sistema Seguro TechStore Active</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">¡Bienvenido, {user?.name}!</h1>
          <p className="text-indigo-200 mt-2 text-sm max-w-xl">
            Panel de control principal. Su rol actual es <span className="font-bold text-white underline">{user?.role}</span> en la tienda <span className="font-bold text-white underline">{user?.store}</span>.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentView('products')}
              className="bg-white text-indigo-700 font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-indigo-50 transition-all flex items-center space-x-2 text-sm cursor-pointer"
            >
              <span>Ver Productos</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className="bg-indigo-500/30 backdrop-blur-md border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-500/40 transition-all text-sm cursor-pointer"
            >
              Consultar Permisos
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Productos</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{loading ? '...' : products.length}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Sincronizado
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Stock Acumulado</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{loading ? '...' : totalStock} un.</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">En inventario actual</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Valor Inventario</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
              {loading ? '...' : `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1">Estimación total</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Stock Bajo (≤ 5)</p>
            <h3 className={`text-2xl font-extrabold mt-1 ${lowStockCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
              {loading ? '...' : lowStockCount}
            </h3>
            <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
              {lowStockCount > 0 ? <AlertTriangle className="w-3.5 h-3.5" /> : null} Requiere atención
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Role & Store Information Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span>Resumen de Capacidades y Permisos</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase">Rol Actual</p>
              <p className="text-base font-bold text-indigo-600 mt-1">{user?.role}</p>
              <p className="text-xs text-gray-600 mt-1">
                {user?.role === 'Administrador del Sistema' && 'Control total sobre todos los productos, tiendas y operaciones.'}
                {user?.role === 'Gerente de Tienda' && `Gestión de productos y eliminación solo en su tienda (${user?.store}).`}
                {user?.role === 'Empleado de Ventas' && `Consulta de productos en su tienda (${user?.store}) y actualización exclusiva de stock.`}
                {user?.role === 'Auditor' && 'Acceso de solo lectura global al catálogo de productos.'}
                {!user?.role && 'Acceso estándar.'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase">Tienda Asignada</p>
              <p className="text-base font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                {user?.store || 'Tienda Central'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                El backend filtra automáticamente los productos según su tienda asignada.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Products Preview */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Productos Recientes</h3>
            {loading ? (
              <p className="text-sm text-gray-400">Cargando...</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-gray-400">No hay productos registrados.</p>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 4).map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="truncate pr-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">${p.price} • Stock: {p.stock}</p>
                    </div>
                    <span className="text-[11px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md shrink-0">
                      {p.store}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setCurrentView('products')}
            className="mt-4 w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-2 border-t border-gray-100 cursor-pointer"
          >
            Ver todos los productos →
          </button>
        </div>
      </div>
    </div>
  );
}
