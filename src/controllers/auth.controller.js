import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

// Expresión regular: Mínimo 8 caracteres, al menos 1 mayúscula, 1 número y 1 carácter especial
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!\%*?&]{8,}$/;

export const register = async (req, res, next) => {
  try {
    const { name, email, password, store } = req.body;

    if (!name || !email || !password || !store) {
      return res.status(400).json({
        message: 'Nombre, correo, contraseña y tienda son obligatorios'
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial (@$!%*?&)'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'El correo electrónico ya está registrado'
      });
    }

    // Todo registro público comienza como Empleado de Ventas.
    // Los roles administrativos se asignan posteriormente por un administrador.
    const user = await User.create({
      name,
      email,
      password,
      store,
      role: 'Empleado de Ventas'
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente. Debe iniciar sesión para completar la autenticación MFA.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        store: user.store
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 1. Verificar si la cuenta está bloqueada por intentos fallidos
    if (user.isLocked) {
      return res.status(423).json({
        message: 'Cuenta bloqueada temporalmente por superar los 5 intentos fallidos. Intente más tarde.',
      });
    }

    // 2. Validar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Bloqueo por 15 minutos
      }
      await user.save();
      return res.status(401).json({
        message: `Credenciales inválidas. Intentos restantes: ${Math.max(0, 5 - user.loginAttempts)}`,
      });
    }

    // Reiniciar contadores tras éxito
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    // 3. Flujo MFA: Generar código de 6 dígitos (válido por 5 minutos)
    const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.mfaCode = mfaCode;
    user.mfaExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.mfaAttempts = 0;
    await user.save();

    // Simulación de envío por Email (Muestra en consola del servidor)
    console.log(`\n==========================================`);
    console.log(`CÓDIGO MFA GENERADO PARA [${user.email}]: ${mfaCode}`);
    console.log(`==========================================\n`);

    res.json({
      message: 'Credenciales correctas. Ingrese el código MFA enviado a su correo.',
      mfaRequired: true,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// Endpoint para validar el código MFA y entregar el JWT final
export const verifyMFA = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.mfaCode) {
      return res.status(400).json({ message: 'Solicitud MFA inválida o no encontrada' });
    }

    if (user.mfaExpires < new Date()) {
      return res.status(400).json({ message: 'El código MFA ha expirado. Inicie sesión nuevamente.' });
    }

    if (user.mfaAttempts >= 3) {
      return res.status(429).json({ message: 'Superó el límite de 3 intentos para el código MFA. Inicie sesión de nuevo.' });
    }

    if (user.mfaCode !== code) {
      user.mfaAttempts += 1;
      await user.save();
      return res.status(401).json({
        message: `Código MFA incorrecto. Intentos restantes: ${3 - user.mfaAttempts}`,
      });
    }

    // Limpiar MFA y entregar JWT
    user.mfaCode = undefined;
    user.mfaExpires = undefined;
    user.mfaAttempts = 0;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Autenticación MFA exitosa. Acceso concedido.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, store: user.store },
    });
  } catch (error) {
    next(error);
  }
};

export const socialCallback = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Error al autenticar usuario social'
    });
  }

  const token = generateToken(req.user._id, req.user.role);

  const frontendUrl = process.env.FRONTEND_URL ||
    'https://5173-cs-99ec16a6-7375-4cef-bfcb-fdb59f802bc9.cs-us-east1-dogs.cloudshell.dev';

  const user = encodeURIComponent(JSON.stringify({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    store: req.user.store,
    avatar: req.user.avatar
  }));

  return res.redirect(
    `${frontendUrl}/#social_token=${encodeURIComponent(token)}&social_user=${user}`
  );
};