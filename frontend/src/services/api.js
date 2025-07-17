import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5000/',
  headers: {
    "Content-Type": "application/json",
  },
});

// Añadir token automáticamente si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getLibros = () => api.get("/libros/").then(res => res.data);
export const crearLibro = (data) => api.post("/libros/nuevo", data);
export const getLibroPorId = (id) => api.get(`/libros/${id}`).then(res => res.data);
export const actualizarLibro = (id, data) => api.put(`/libros/${id}`, data);
export const eliminarLibro = (id) => api.delete(`/libros/eliminar/${id}`);
export const login = (creds) => api.post("/login", creds);

