from flask import Blueprint, jsonify, request
import re
from models.auth_usuario import Usuario, Moderador, Admin

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')
    rol = data.get('rol', 'usuario')  # Por defecto, el rol es 'usuario'

    # Validaciones básicas
    if not username or not password:
        return jsonify({"error": "Ingresa datos válidos"}), 400
    
    # Validaciones de formato
    if not isinstance(username, str) or not username.strip():
        return jsonify({"error": "El usuario debe ser un texto válido"}), 400
    
    if len(username.strip()) < 3:
        return jsonify({"error": "El usuario debe tener al menos 3 caracteres"}), 400
    
    if len(username.strip()) > 20:
        return jsonify({"error": "El usuario no puede exceder 20 caracteres"}), 400
    
    if not isinstance(password, str) or not password.strip():
        return jsonify({"error": "La contraseña debe ser un texto válido"}), 400
    
    if len(password) < 4:
        return jsonify({"error": "La contraseña debe tener al menos 4 caracteres"}), 400
    
    # Validaciones específicas por rol
    if rol == 'moderador' and not password.startswith('mod_'):
        return jsonify({"error": "Las contraseñas de moderador deben comenzar con 'mod_'"}), 400
    
    if rol == 'admin':
        if not re.search(r"[@#\$%^&+=]", password):
            return jsonify({"error": "Las contraseñas de admin deben contener al menos un carácter especial (@#$%^&+=)"}), 400
    
    username = username.strip()
    
    if rol == 'admin':
        usuario = Admin(username, password)
    elif rol == 'moderador':
        usuario = Moderador(username, password)
    else:
        usuario = Usuario(username, password)
    
    if usuario.autenticar(password):
        return jsonify({
            "token": "fake-jwt-token",
            "rol": rol,
            "username": username
        }), 200
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401