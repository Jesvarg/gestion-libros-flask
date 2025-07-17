from flask import Blueprint, jsonify, request
from models.libro import db, LibroModelo


libros_bp = Blueprint('libros_bp', __name__, url_prefix='/libros')

@libros_bp.route('/', methods=['GET'])
def obtener_libros():
    libros =  LibroModelo.query.all()
    resultado = [
        {
            "id": libro.id,
            "titulo": libro.titulo,
            "autor": libro.autor,
            "precio": libro.precio
        }
        for libro in libros
    ]
    return jsonify(resultado)

@libros_bp.route('/nuevo', methods=['POST'])
def agregar_libro():
    data = request.get_json()
    titulo = data.get('titulo')
    autor = data.get('autor')
    precio = data.get('precio')

    # Validaciones
    if not titulo or not isinstance(titulo, str) or not titulo.strip():
        return jsonify({"error": "El título es obligatorio"}), 400
    
    if len(titulo.strip()) > 30:
        return jsonify({"error": "El título no puede exceder 30 caracteres"}), 400
    
    if not autor or not isinstance(autor, str) or not autor.strip():
        return jsonify({"error": "El autor es obligatorio"}), 400
    
    if len(autor.strip()) > 30:
        return jsonify({"error": "El autor no puede exceder 30 caracteres"}), 400
    
    if precio is None or not isinstance(precio, (int, float)) or precio < 0:
        return jsonify({"error": "Ingresa un precio válido (debe ser mayor o igual a 0)"}), 400
    
    if precio > 999999.99:
        return jsonify({"error": "El precio no puede exceder $999,999.99"}), 400
    
    try:
        nuevo_libro = LibroModelo(titulo=titulo.strip(), autor=autor.strip(), precio=precio)
        db.session.add(nuevo_libro)
        db.session.commit()
        return jsonify({"mensaje": "Libro añadido"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear el libro"}), 500

@libros_bp.route('/<int:id>', methods=['GET'])
def obtener_libro(id):
    libro = LibroModelo.query.get_or_404(id)

    return jsonify({
            "id": libro.id,
            "titulo": libro.titulo,
            "autor": libro.autor,
            "precio": libro.precio
        })

@libros_bp.route('/<int:id>', methods=['PUT'])
def actualizar_libro(id):
    libro = LibroModelo.query.get_or_404(id)
    data = request.get_json()

    # Extrae campos con valores por defecto (los actuales)
    nuevo_titulo = data.get('titulo', libro.titulo)
    nuevo_autor = data.get('autor', libro.autor)
    nuevo_precio = data.get('precio', libro.precio)

    # Validaciones
    if not nuevo_titulo or not isinstance(nuevo_titulo, str) or not nuevo_titulo.strip():
        return jsonify({"error": "El título es obligatorio"}), 400
    
    if len(nuevo_titulo.strip()) > 30:
        return jsonify({"error": "El título no puede exceder 30 caracteres"}), 400

    if not nuevo_autor or not isinstance(nuevo_autor, str) or not nuevo_autor.strip():
        return jsonify({"error": "El autor es obligatorio"}), 400
    
    if len(nuevo_autor.strip()) > 30:
        return jsonify({"error": "El autor no puede exceder 30 caracteres"}), 400

    if nuevo_precio is None or not isinstance(nuevo_precio, (int, float)) or nuevo_precio < 0:
        return jsonify({"error": "Ingresa un precio válido (debe ser mayor o igual a 0)"}), 400

    if nuevo_precio > 999999.99:
        return jsonify({"error": "El precio no puede exceder $999,999.99"}), 400

    try:
        # Asigna valores actualizados
        libro.titulo = nuevo_titulo.strip()
        libro.autor = nuevo_autor.strip()
        libro.precio = nuevo_precio

        db.session.commit()
        return jsonify({"mensaje": "Libro actualizado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar el libro"}), 500

@libros_bp.route('/eliminar/<int:id>', methods=['DELETE'])
def eliminar_libro(id):
    libro = LibroModelo.query.get_or_404(id)
    db.session.delete(libro)
    db.session.commit()

    return jsonify({"mensaje": "Libro eliminado"}), 200