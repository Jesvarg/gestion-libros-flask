import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion as Motion } from 'framer-motion';
import { crearLibro, actualizarLibro } from '../services/api';
import { MdBook, MdEdit } from 'react-icons/md';

const LibroModal = ({ libro, onClose, onSave }) => {
  const [titulo, setTitulo] = useState(libro?.titulo || '');
  const [autor, setAutor] = useState(libro?.autor || '');
  const [precio, setPrecio] = useState(libro?.precio?.toString() || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones frontend
    if (!titulo.trim() || !autor.trim()) {
      toast.error('El título y el autor son obligatorios');
      return;
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum < 0) {
      toast.error('Ingresa un precio válido');
      return;
    }

    const datos = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      precio: precioNum,
    };

    try {
      if (libro?.id) {
        await actualizarLibro(libro.id, datos);
        toast.success('Libro actualizado');
      } else {
        await crearLibro(datos);
        toast.success('Libro creado');
      }
      onSave();
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Ocurrió un error inesperado');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <Motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-4"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          {libro?.id ? (
            <>
              <MdEdit className="text-blue-600" /> Editar Libro
            </>
          ) : (
            <>
              <MdBook className="text-blue-600" /> Nuevo Libro
            </>
          )}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título del libro"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Autor
            </label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="Nombre del autor"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="0.00"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {libro?.id ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
};

export default LibroModal;