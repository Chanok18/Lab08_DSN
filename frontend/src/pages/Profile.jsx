import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Shield, Building2, Mail, KeyRound, CheckCircle2, Lock } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Administrador del Sistema': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Gerente de Tienda': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Empleado de Ventas': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Auditor': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-700 text-2xl font-bold">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{user?.name}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
            <Mail className="w-4 h-4 text-gray-400" />
            {user?.email}
          </p>
          <div className="mt-2">
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${getRoleBadgeColor(user?.role)}`}>
              {user?.role || 'Empleado de Ventas'}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <UserCircle className="w-5 h-5 text-indigo-600" />
            <span>Información de Sesión</span>
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">ID de Usuario:</span>
              <span className="font-mono text-gray-800 text-xs">{user?.id || user?._id || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Tienda Asignada:</span>
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <Building2 className="w-4 h-4 text-indigo-600" />
                {user?.store || 'Tienda Central'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Estado de Autenticación:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Activo (JWT)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span>Seguridad y Protección</span>
          </h3>

          <div className="space-y-3 text-sm">
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-start space-x-3">
              <KeyRound className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-indigo-900 text-xs uppercase">Autenticación Multi-Factor (MFA)</p>
                <p className="text-xs text-indigo-700 mt-0.5">Verificado con código de 6 dígitos durante el inicio de sesión.</p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start space-x-3">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900 text-xs uppercase">Control de Acceso Basado en Roles</p>
                <p className="text-xs text-emerald-700 mt-0.5">Permisos estrictamente validados en backend y aplicados en interfaz.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
