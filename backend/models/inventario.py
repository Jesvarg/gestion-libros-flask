class Inventario:
    def __init__(self):
        self._libros = []

    def agregar_libro(self, libro):
        self._libros.append(libro)
    
    def buscar_libro(self, titulo):
        for libro in self._libros:
            if libro.titulo == titulo:
                return libro
        return None
    
    def registrar_venta(self, titulo, cantidad):
        libro = self.buscar_libro(titulo)
        if libro:
            libro.registrar_venta(cantidad)
            print(f"Venta realizada: {cantidad} unidades de '{titulo}'. Stock restante: {libro.stock}")
        else:
            raise ValueError('Libro no encontrado')