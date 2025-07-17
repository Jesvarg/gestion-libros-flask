import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(!!token);
    setUserRole(role || 'usuario');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    navigate('/');
  };

  // Control de permisos para navegación
  const puedeAñadir = () => {
    return userRole === 'admin' || userRole === 'moderador';
  };

  const getNavItems = () => {
    const items = [
      { icon: '📚', label: 'Libros', path: '/libros' },
    ];
    
    if (puedeAñadir()) {
      items.push({ icon: '➕', label: 'Añadir', path: '/libros/nuevo' });
    }
    
    return items;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header con glassmorphism */}
      <motion.header 
        className="glass sticky top-0 z-50 backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/libros')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl">📚</div>
              <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
                Gestor de Libros
              </h1>
            </motion.div>

            {/* Navegación Desktop */}
            {isLoggedIn && (
              <nav className="hidden md:flex items-center gap-2">
                {getNavItems().map((item, index) => (
                  <motion.button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
                
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-white hover:bg-red-500 transition-all duration-200 ml-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-lg">🚪</span>
                  <span className="font-medium">Salir</span>
                </motion.button>
              </nav>
            )}

            {/* Botón menú móvil */}
            {isLoggedIn && (
              <button
                className="md:hidden text-gray-700 p-2"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${showMobileMenu ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                  <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${showMobileMenu ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${showMobileMenu ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {showMobileMenu && isLoggedIn && (
            <motion.div
              className="md:hidden glass border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-3 space-y-2">
                {getNavItems().map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Contenido principal */}
      <main className="flex-grow">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer minimalista */}
      <motion.footer 
        className="glass border-t border-gray-200 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Gestor de Libros - Diseñado con ❤️
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Layout;