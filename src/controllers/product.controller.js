import Product from '../models/Product.js';

// Consultar productos
export const getProducts = async (req, res) => {
  try {
    const filter = {};

    // Gerente y empleado trabajan con su tienda
    if (
      req.user.role === 'Gerente de Tienda' ||
      req.user.role === 'Empleado de Ventas'
    ) {
      filter.store = req.user.store;
    }

    const products = await Product.find(filter);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
      store
    } = req.body;

    // El gerente solamente puede crear en su propia tienda
    if (
      req.user.role === 'Gerente de Tienda' &&
      store !== req.user.store
    ) {
      return res.status(403).json({
        message: 'El gerente solo puede crear productos de su propia tienda'
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
      store: req.user.role === 'Gerente de Tienda'
        ? req.user.store
        : (store || req.user.store)
    });

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    // Auditor no puede modificar
    if (req.user.role === 'Auditor') {
      return res.status(403).json({
        message: 'El Auditor tiene permisos de solo lectura'
      });
    }

    // Gerente solo puede modificar su tienda
    if (
      req.user.role === 'Gerente de Tienda' &&
      product.store !== req.user.store
    ) {
      return res.status(403).json({
        message: 'No puede modificar productos de otra tienda'
      });
    }

    // Empleado solamente puede modificar stock
    if (req.user.role === 'Empleado de Ventas') {
      if (req.body.stock === undefined) {
        return res.status(403).json({
          message: 'El empleado solo puede actualizar el stock'
        });
      }

      product.stock = req.body.stock;
      await product.save();

      return res.json({
        message: 'Stock actualizado exitosamente',
        product
      });
    }

    // Administrador y Gerente pueden modificar los datos permitidos
    const allowedFields = [
      'name',
      'description',
      'price',
      'stock',
      'category',
      'imageUrl'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.json({
      message: 'Producto actualizado exitosamente',
      product
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    // Solo administrador puede eliminar cualquier producto
    if (req.user.role === 'Administrador del Sistema') {
      await Product.findByIdAndDelete(req.params.id);

      return res.json({
        message: 'Producto eliminado exitosamente'
      });
    }

    // Gerente solo puede eliminar productos de su tienda
    if (
      req.user.role === 'Gerente de Tienda' &&
      product.store === req.user.store
    ) {
      await Product.findByIdAndDelete(req.params.id);

      return res.json({
        message: 'Producto eliminado exitosamente'
      });
    }

    return res.status(403).json({
      message: 'No tienes permisos para eliminar este producto'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};
