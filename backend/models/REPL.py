from inventario import Inventario
from libro import Libro  # Asegúrate de importar tus clases correctamente

# Prueba 1: Crear un libro con precio válido
try:
    libro_valido = Libro("1984", "George Orwell", 20.99, 10)
    print(f"✅ Libro creado correctamente: {libro_valido.titulo} - {libro_valido.autor} - ${libro_valido.precio}")
except ValueError as e:
    print(f"❌ Error al crear libro: {e}")

# Prueba 2: Intentar crear un libro con precio negativo (debe fallar)
try:
    libro_invalido = Libro("Fahrenheit 451", "Ray Bradbury", -5, 5)
    print(f"❌ Error al añadir el libro: {libro_invalido.titulo}")
except ValueError as e:
    print(f"✅ Error esperado al crear libro con precio negativo: {e}")

# Prueba 3: Agregar libros al inventario
inventario = Inventario()
inventario.agregar_libro(libro_valido)
libro_extra = Libro("Brave New World", "Aldous Huxley", 15.50, 8)
inventario.agregar_libro(libro_extra)
print("✅ Libros agregados al inventario.")

# Prueba 4: Buscar libros por título exacto
titulo_buscado = "1984"
libro_encontrado = inventario.buscar_libro(titulo_buscado)
if libro_encontrado:
    print(f"✅ Libro encontrado: {libro_encontrado.titulo} - {libro_encontrado.autor} - ${libro_encontrado.precio}")
else:
    print(f"❌ No se encontró el libro '{titulo_buscado}'.")

titulo_no_existente = "Crimen y Castigo"
libro_no_encontrado = inventario.buscar_libro(titulo_no_existente)
if libro_no_encontrado:
    print(f"❌ Esto no debería imprimirse: {libro_no_encontrado.titulo}")
else:
    print(f"✅ Error esperado, el libro '{titulo_no_existente}' no está en el inventario.")
