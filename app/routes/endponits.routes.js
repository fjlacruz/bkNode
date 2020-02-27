const { pathToRegexp, match, parse, compile } = require("path-to-regexp");
const regexp = pathToRegexp("/:foo/:bar?");

module.exports = app => {
  const usuarios = require("../controllers/usuarios.controller.js");

  //====================================================//
  //======== Rutas del Modulo de  Usuarios =============//
  //====================================================//

  //================= Login ============================//
  app.post("/login", usuarios.login);

  //======== Listado general de usuarios ===============//
  app.get("/usuarios", usuarios.findAll);

  //============= usuario por id =======================//
  app.get("/usuarios/:id_usuario", usuarios.usuarioById);

  // crear nuevo usuario
  app.post("/usuarios", usuarios.create);

  //============= Editar Usuario =======================//
  app.put("/usuarios/:id_usuario", usuarios.update);

  //============= Eliminar Usuario ======================//
  app.delete("/usuarios/:id_usuario", usuarios.delete);

  //======== Cerrar sesion de usuario ===================//
  app.get("/logout/:id_usuario", usuarios.logout);

  //======== Cambiar clave de usuario ===================//
  app.put("/cambiar-clave/:id_usuario", usuarios.cambiarClave);

  //======== Validar Existe rut =========================//
  app.get("/validar-rut/:rut", usuarios.ValidarRut);

  //================= Buscar Usuario ============================//
  app.get("/buscar-usuario/:usuario", usuarios.buscarUsuario);
};
