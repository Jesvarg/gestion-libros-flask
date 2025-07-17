from models import db

class Libro:
    def __init__(self, titulo, autor, precio):
        self.titulo = titulo
        self.autor = autor
        self.precio = precio

@property
def titulo(self):
    return self._titulo
@titulo.setter
def titulo(self, nuevo_titulo):
    if not isinstance(nuevo_titulo, str):
        raise ValueError("Debes ingresar un título válido")
    self._titulo = nuevo_titulo

@property
def autor(self):
    return self._autor
@autor.setter
def autor(self, nuevo_autor):
    if not isinstance(nuevo_autor, str):
        raise ValueError("Debes ingresar un autor válido")
    self._autor = nuevo_autor

@property
def precio(self):
    return self._precio

@precio.setter
def precio(self, nuevo_precio):
    if not isinstance(nuevo_precio, (int, float)) or nuevo_precio < 0:
        raise ValueError("Ingresa un precio válido")
    self._precio = nuevo_precio

    
class LibroModelo(db.Model):
    __tablename__ = 'libros'

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(30), nullable=False)
    autor = db.Column(db.String(30), nullable=False)
    precio = db.Column(db.Float, nullable=False)