import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('usuario');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validaciones en tiempo real
  const validateForm = () => {
    const newErrors = {};

    // Validar username
    if (!username.trim()) {
      newErrors.username = 'El usuario es obligatorio';
    } else if (username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
    } else if (username.length > 20) {
      newErrors.username = 'El usuario no puede exceder 20 caracteres';
    }

    // Validar password
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    } else {
      // Validaciones específicas por rol
      if (rol === 'moderador' && !password.startsWith('mod_')) {
        newErrors.password = 'La contraseña de moderador debe comenzar con "mod_"';
      } else if (rol === 'admin' && !/[@#\$%^&+=]/.test(password)) {
        newErrors.password = 'La contraseña de admin debe contener al menos un carácter especial (@#$%^&+=)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);

    try {
      const res = await login({ username, password, rol });
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userRole', res.data.rol);
        localStorage.setItem('username', res.data.username);
        toast.success('¡Bienvenido! 🎉');
        navigate('/libros');
      }
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Ocurrió un error inesperado');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass w-full max-w-md mx-auto p-6 sm:p-8"
      >
        {/* Logo/Título */}
        <motion.div 
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📚</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Gestor de Libros</h1>
          <p className="text-sm sm:text-base text-gray-600">Inicia sesión para continuar</p>
        </motion.div>

        <motion.form 
          onSubmit={handleLogin} 
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Campo Usuario */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-gray-700 text-sm font-medium mb-2">
              👤 Usuario
            </label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-modern w-full text-sm sm:text-base"
              required
            />
          </motion.div>

          {/* Campo Contraseña */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-gray-700 text-sm font-medium mb-2">
              🔒 Contraseña
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-modern w-full text-sm sm:text-base"
              required
            />
          </motion.div>

          {/* Selector de Rol */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-gray-700 text-sm font-medium mb-2">
              🎭 Rol
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="input-modern w-full text-sm sm:text-base"
            >
              <option value="admin">👑 Administrador</option>
              <option value="moderador">🛡️ Moderador</option>
              <option value="usuario">👤 Usuario</option>
            </select>
          </motion.div>

          {/* Botón de Login */}
          <motion.button 
            type="submit" 
            disabled={isLoading}
            className="btn-gradient w-full text-base sm:text-lg font-semibold py-3 sm:py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-sm sm:text-base">Iniciando sesión...</span>
              </div>
            ) : (
              '🚀 Iniciar Sesión'
            )}
          </motion.button>
        </motion.form>

        {/* Footer */}
        <motion.div 
          className="text-center mt-6 sm:mt-8 text-gray-500 text-xs sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Sistema de Gestión de Libros v2.0
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
