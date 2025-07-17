import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getLibros, eliminarLibro, getLibroPorId } from '../services/api';
import LibroModal from './LibroModal';

const ListarLibros = () => {
  const [libros, setLibros] = useState([]);
  const [modalLibro, setModalLibro] = useState(null);
  const [libroAEliminar, setLibroAEliminar] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const cargarLibros = async () => {
    try {
      const datos = await getLibros();
      setLibros(datos);
    } catch (error) {
      toast.error('Error al cargar libros');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const user = localStorage.getItem('username');
    
    if (!token) {
      toast.error('🔒 Debes iniciar sesión');
      navigate('/');
      return;
    }
    
    setUserRole(role || 'usuario');
    setUsername(user || '');
    setTokenChecked(true);
    cargarLibros();
  }, [navigate]);

  // Funciones de control de permisos
  const puedeAñadir = () => {
    return userRole === 'admin' || userRole === 'moderador';
  };

  const puedeEditar = () => {
    return userRole === 'admin' || userRole === 'moderador';
  };

  const puedeEliminar = () => {
    return userRole === 'admin';
  };



  const solicitarEliminacion = (libro) => {
    setLibroAEliminar(libro);
  };

  const confirmarEliminacion = async () => {    try {
      await eliminarLibro(libroAEliminar.id);
      setLibros((prev) => prev.filter((l) => l.id !== libroAEliminar.id));
      toast.success('🗑️ Libro eliminado exitosamente');
    } catch {
      toast.error('Error al eliminar libro');
    } finally {
      setLibroAEliminar(null);
    }
  };

  const abrirModalEdicion = async (id) => {
    try {
      const libro = await getLibroPorId(id);
      setModalLibro(libro);
    } catch (error) {
      toast.error('Error al cargar libro');
    }
  };

  // Filtrar libros por búsqueda
  const librosFiltrados = libros.filter(libro =>
    libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    libro.autor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!tokenChecked) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          className="glass p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando libros...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">📚</div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800">Mi Biblioteca</h2>
              <p className="text-gray-600 text-lg">Gestiona tu colección de libros</p>
            </div>
          </div>
          <div className="glass px-4 py-2 rounded-lg">
            <span className="text-gray-700">
              👤 {username} - 
              {userRole === 'admin' && ' 👑 Administrador'}
              {userRole === 'moderador' && ' 🛡️ Moderador'}
              {userRole === 'usuario' && ' 👤 Usuario'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Barra de búsqueda */}
      <motion.div 
        className="glass p-6 mb-8 inline-block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xl">🔍</span>

          <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input-modern w-auto"
        style={{ width: `${Math.max(searchTerm.length * 9 + 50, 150)}px` }}
      />
        </div>
      </motion.div>

      {/* Grid de libros */}
      {librosFiltrados.length === 0 ? (
        <motion.div 
          className="glass p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            {searchTerm ? 'No se encontraron libros' : 'No hay libros disponibles'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? `No hay libros que coincidan con "${searchTerm}"`
              : 'Comienza añadiendo tu primer libro a la biblioteca'
            }
          </p>
          {!searchTerm && puedeAñadir() && (
            <motion.button
              className="btn-gradient px-6 py-3 font-semibold"
              onClick={() => setModalLibro({})}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ➕ Añadir Primer Libro
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence>
            {librosFiltrados.map((libro, index) => (
              <motion.div
                key={libro.id}
                className="glass card-hover p-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                {/* Contenido del libro */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">📘</div>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      #{libro.id}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {libro.titulo}
                  </h3>
                  
                  <p className="text-gray-600 mb-3">
                    ✍️ {libro.autor}
                  </p>
                  
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    ${libro.precio}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  {puedeEditar() && (
                    <motion.button
                      onClick={() => abrirModalEdicion(libro.id)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg font-medium transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ✏️ Editar
                    </motion.button>
                  )}
                  {puedeEliminar() && (
                    <motion.button
                      onClick={() => solicitarEliminacion(libro)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg font-medium transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      🗑️ Eliminar
                    </motion.button>
                  )}
                  
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal de libro */}
      <AnimatePresence>
        {modalLibro && (
          <LibroModal
            libro={modalLibro}
            onClose={() => setModalLibro(null)}
            onSave={() => {
              setModalLibro(null);
              cargarLibros();
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal de confirmación de eliminación */}
      <AnimatePresence>
        {libroAEliminar && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass p-6 w-full max-w-md"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">¿Eliminar libro?</h2>
                <p className="text-gray-600">
                  ¿Estás seguro de que quieres eliminar <strong className="text-gray-800">"{libroAEliminar.titulo}"</strong>?
                </p>
                <p className="text-red-600 text-sm mt-2">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setLibroAEliminar(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={confirmarEliminacion}
                  className="flex-1 btn-danger px-4 py-3 rounded-xl font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🗑️ Eliminar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListarLibros;
