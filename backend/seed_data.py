from flask import Flask
from models import db
from models.libro import LibroModelo

def seed_data():
    """Función para sembrar datos de ejemplo en la base de datos"""
    
    # Verificar si ya hay libros en la base de datos
    if LibroModelo.query.count() > 0:
        print("La base de datos ya contiene libros. No se sembrarán datos.")
        return
    
    # Datos de ejemplo
    libros_ejemplo = [
        {
            "titulo": "Cien años de soledad",
            "autor": "Gabriel García Márquez",
            "precio": 25.99
        },
        {
            "titulo": "Don Quijote de la Mancha",
            "autor": "Miguel de Cervantes",
            "precio": 18.50
        },
        {
            "titulo": "El amor en los tiempos",
            "autor": "Gabriel García Márquez",
            "precio": 22.75
        },
        {
            "titulo": "La casa de los espíritus",
            "autor": "Isabel Allende",
            "precio": 19.99
        },
        {
            "titulo": "Rayuela",
            "autor": "Julio Cortázar",
            "precio": 21.30
        },
        {
            "titulo": "Pedro Páramo",
            "autor": "Juan Rulfo",
            "precio": 16.80
        }
    ]
    
    # Crear y guardar los libros
    for libro_data in libros_ejemplo:
        libro = LibroModelo(
            titulo=libro_data["titulo"],
            autor=libro_data["autor"],
            precio=libro_data["precio"]
        )
        db.session.add(libro)
    
    # Confirmar los cambios
    db.session.commit()
    print(f"Se han sembrado {len(libros_ejemplo)} libros de ejemplo en la base de datos.")

if __name__ == '__main__':
    from app import app
    
    with app.app_context():
        db.create_all()
        seed_data()