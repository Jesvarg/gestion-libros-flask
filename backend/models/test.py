from auth_usuario import Usuario, Moderador, Admin, login

# Pruebas de autenticación
print(login(Usuario("user1", "password123"), "password123"))  # ✅ Debería autenticar correctamente
print(login(Usuario("user2", "password123"), "wrongpass"))  # ❌ Debería fallar

print(login(Moderador("mod1", "mod_123"), "mod_123"))  # ✅ Debería autenticar correctamente
print(login(Moderador("mod2", "mod_abc"), "abc_mod"))  # ❌ Debería fallar por no iniciar con "mod_"

print(login(Admin("admin1", "admin@123"), "admin@123"))  # ✅ Debería autenticar correctamente
print(login(Admin("admin2", "admin123"), "admin123"))  # ❌ Debería fallar por no contener un carácter especial
