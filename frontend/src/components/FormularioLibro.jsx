import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getLibroPorId, crearLibro, actualizarLibro } from '../services/api';

const FormularioLibro = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [precio, setPrecio] = useState('');
  const [esEdicion, setEsEdicion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Cargar datos si es edición
  useEffect(() => {
    if (!id) return;

    const cargarDatos = async () => {
      setIsLoadingData(true);
      try {
        const libro = await getLibroPorId(id);
        setTitulo(libro.titulo);
        setAutor(libro.autor);
        setPrecio(libro.precio.toString());
        setEsEdicion(true);
      } catch (error) {
        toast.error('Error al cargar los datos del libro');
        navigate('/libros');
      } finally {
        setIsLoadingData(false);
      }
    };

    cargarDatos();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones según restricciones de la base de datos
    if (!titulo.trim()) {
      toast.error('El título es obligatorio');
      setIsLoading(false);
      return;
    }

    if (titulo.trim().length > 30) {
      toast.error('El título no puede exceder 30 caracteres');
      setIsLoading(false);
      return;
    }

    if (!autor.trim()) {
      toast.error('El autor es obligatorio');
      setIsLoading(false);
      return;
    }

    if (autor.trim().length > 30) {
      toast.error('El nombre del autor no puede exceder 30 caracteres');
      setIsLoading(false);
      return;
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum < 0) {
      toast.error('Ingresa un precio válido');
      setIsLoading(false);
      return;
    }

    if (precioNum > 9999.99) {
      toast.error('El precio no puede exceder $9999.99');
      setIsLoading(false);
      return;
    }

    const datos = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      precio: precioNum,
    };

    try {
      if (esEdicion) {
        await actualizarLibro(id, datos);
        toast.success('📘 Libro actualizado exitosamente');
      } else {
        await crearLibro(datos);
        toast.success('📘 Libro creado exitosamente');
      }
      navigate('/libros');
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

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          className="glass p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del libro...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        className="glass p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-5xl mb-4">
            {esEdicion ? '✏️' : '📘'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {esEdicion ? 'Editar Libro' : 'Nuevo Libro'}
          </h2>
          <p className="text-gray-600">
            {esEdicion ? 'Modifica los datos del libro' : 'Completa la información del nuevo libro'}
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Campo Título */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-gray-700 text-sm font-medium mb-2">
              📖 Título del Libro
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Cien años de soledad"
              className={`input-modern w-full ${titulo.length > 30 ? 'border-red-500 focus:border-red-500' : ''}`}
              maxLength={30}
              required
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs ${titulo.length > 30 ? 'text-red-500' : 'text-gray-500'}`}>
                {titulo.length}/30 caracteres
              </span>
              {titulo.length > 30 && (
                <span className="text-xs text-red-500">⚠️ Excede el límite</span>
              )}
            </div>
          </motion.div>

          {/* Campo Autor */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-gray-700 text-sm font-medium mb-2">
              ✍️ Autor
            </label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="Ej: Gabriel García Márquez"
              className={`input-modern w-full ${autor.length > 30 ? 'border-red-500 focus:border-red-500' : ''}`}
              maxLength={30}
              required
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs ${autor.length > 30 ? 'text-red-500' : 'text-gray-500'}`}>
                {autor.length}/30 caracteres
              </span>
              {autor.length > 30 && (
                <span className="text-xs text-red-500">⚠️ Excede el límite</span>
              )}
            </div>
          </motion.div>

          {/* Campo Precio */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-gray-700 text-sm font-medium mb-2">
              💰 Precio
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0.00"
                className="input-modern w-full pl-10"
                required
              />
            </div>
          </motion.div>

          {/* Botones */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              type="button"
              onClick={() => navigate('/libros')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Cancelar
            </motion.button>
            <motion.button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-gradient py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {esEdicion ? 'Actualizando...' : 'Creando...'}
                </div>
              ) : (
                <span>
                  {esEdicion ? '💾 Actualizar Libro' : '✨ Crear Libro'}
                </span>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default FormularioLibro;