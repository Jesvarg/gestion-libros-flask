import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import ListarLibros from './components/ListarLibros';
import Layout from './components/Layout';
import { ModalProvider } from './context/ModalContext';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <ModalProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route 
            path="/libros" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ListarLibros />
                </Layout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </ModalProvider>
    </div>
  );
}

export default App;