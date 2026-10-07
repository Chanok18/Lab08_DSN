import { Router } from 'express';

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

import {
  verifyToken,
  authorizeRoles
} from '../middlewares/auth.middleware.js';

const router = Router();

const allRoles = [
  'Administrador del Sistema',
  'Gerente de Tienda',
  'Empleado de Ventas',
  'Auditor'
];

// Consultar
router.get(
  '/',
  verifyToken,
  authorizeRoles(...allRoles),
  getProducts
);

// Crear
router.post(
  '/',
  verifyToken,
  authorizeRoles(
    'Administrador del Sistema',
    'Gerente de Tienda'
  ),
  createProduct
);

// Actualizar
router.put(
  '/:id',
  verifyToken,
  authorizeRoles(
    'Administrador del Sistema',
    'Gerente de Tienda',
    'Empleado de Ventas'
  ),
  updateProduct
);

// Eliminar
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles(
    'Administrador del Sistema',
    'Gerente de Tienda'
  ),
  deleteProduct
);

export default router;
