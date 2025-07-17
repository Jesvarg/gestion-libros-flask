import re

class Usuario:
    def __init__(self, username, password):
        self.username = username
        self._password = password
    
    def autenticar(self, pwd):
        return self._password == pwd

class Moderador(Usuario):
    def autenticar(self, pwd):
        if pwd.startswith("mod_"):
            return super().autenticar(pwd)
        return False

class Admin(Usuario):
    def autenticar(self, pwd):
        if re.search(r"[@#\$%^&+=]", pwd):
            return super().autenticar(pwd)
        return False

