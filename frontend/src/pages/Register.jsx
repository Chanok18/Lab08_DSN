import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Store, User, Mail, Lock, Building2, AlertCircle, CheckCircle2, ArrowLeft, Check, X } from 'lucide-react';

export default function Register({ onSwitchToLogin }) {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [store, setStore] = useState('Tienda Central');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password validation checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!hasMinLength || !hasUppercase || !hasNumber || !hasSpecial) {
      setError('La contraseña no cumple con los requisitos de seguridad');
      return;
    }

    setLoading(true);

    try {
      const res = await register({ name, email, password, store });
      setSuccess(res.message || 'Registro exitoso. Redirigiendo al login...');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 text-white relative">
          <button
            onClick={onSwitchToLogin}
            className="absolute top-4 left-4 text-indigo-200 hover:text-white flex items-center space-x-1 text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          <div className="text-center mt-2">
            <div className="bg-white/20 p-3 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center mb-3 backdrop-blur-md shadow-inner">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Crear Cuenta</h2>
            <p className="text-indigo-200 text-xs mt-1">TechStore - Nuevo Registro de Empleado</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-700 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@techstore.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Tienda Asignada
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <select
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="Tienda Central">Tienda Central</option>
                  <option value="Tienda Norte">Tienda Norte</option>
                  <option value="Tienda Sur">Tienda Sur</option>
                  <option value="Tienda Este">Tienda Este</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {/* Password criteria helper */}
              <div className="mt-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5 text-xs">
                <p className="font-semibold text-gray-600 mb-1">La contraseña debe cumplir:</p>
                <div className={`flex items-center space-x-2 ${hasMinLength ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {hasMinLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Mínimo 8 caracteres</span>
                </div>
                <div className={`flex items-center space-x-2 ${hasUppercase ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {hasUppercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Al menos una letra mayúscula</span>
                </div>
                <div className={`flex items-center space-x-2 ${hasNumber ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {hasNumber ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Al menos un número</span>
                </div>
                <div className={`flex items-center space-x-2 ${hasSpecial ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {hasSpecial ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Un carácter especial (@$!%*?&)</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <p className="text-[11px] text-gray-500 italic">
              * El rol se asigna automáticamente como <span className="font-semibold text-gray-700">Empleado de Ventas</span>. Los roles gerenciales o administrativos se configuran por un administrador.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer text-sm mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Registrar Cuenta</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
