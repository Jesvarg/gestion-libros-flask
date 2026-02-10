import { createContext, useState, useCallback } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalLibro, setModalLibro] = useState(null);

  const abrirModalNuevo = useCallback(() => {
    setModalLibro({});
  }, []);

  const abrirModalEdicion = useCallback((libro) => {
    setModalLibro(libro);
  }, []);

  const cerrarModal = useCallback(() => {
    setModalLibro(null);
  }, []);

  return (
    <ModalContext.Provider value={{
      modalLibro,
      setModalLibro,
      abrirModalNuevo,
      abrirModalEdicion,
      cerrarModal,
    }}>
      {children}
    </ModalContext.Provider>
  );
};
