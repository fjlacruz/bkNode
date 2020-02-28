const Usuarios = require("../models/usuarios.model.js");
var md5 = require("md5");
var nodemailer = require("nodemailer");

//================================= Login ==========================================//
exports.login = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "El contenido no puede ser vacio..!"
    });
  }
  console.log(req.body);
  Usuarios.login(new Usuarios(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          response: "fail",
          status: "OK",
          message: "Credenciales invalidas",
          code: 404
        });
      } else {
        res.status(500).send({
          response: "fail",
          status: "OK",
          message: "Error al procesar peticion ",
          code: 500
        });
      }
    } else
      res.send({ response: "success", token: data, status: "OK", code: 200 });
  });
};
//================================= Logout ==========================================//
exports.logout = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "El contenido no puede ser vacio..!"
    });
  }
  console.log(req.body);
  Usuarios.logout(
    req.params.id_usuario,
    new Usuarios(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            response: "fail",
            status: "OK",
            code: 404
          });
        } else {
          res.status(500).send({
            response: "fail",
            status: "OK",
            code: 500
          });
        }
      } else res.send({ response: "success", status: "OK", code: 200 });
    }
  );
};
//==================== lista general de Usuarios ==============================//
exports.findAll = (req, res) => {
  Usuarios.getAll((err, data) => {
    if (err)
      res.status(500).send({
        response: "fail",
        message:
          "Ha ocurrido un error no se puede mostrar la lista de usuarios.",
        code: 500
      });
    else
      res.send({
        status: "OK",
        code: 200,
        message: "Listado de usuarios",
        response: data
      });
  });
};
//================================= Usuario por ID ===============================//
exports.usuarioById = (req, res) => {
  Usuarios.usId(req.params.id_usuario, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          response: "fail",
          message: `No se ha encontrado un usuario con el ID ${req.params.id_usuario}`,
          code: 404
        });
      } else {
        res.status(500).send({
          response: "fail",
          message: "Error al obtener unsuario con ID " + req.params.id_usuario,
          code: 500
        });
      }
    } else res.send({ response: data, status: "OK", code: 200 });
  });
};

//================================= Registrar usuario ==========================================//
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "El contenido no puede ser vacio..!"
    });
  }
  // creando el usuario
  const usuario = new Usuarios({
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    usuario: req.body.usuario,
    rut: req.body.rut,
    clave: md5(req.body.clave),
    rol: req.body.rol,
    email: req.body.email,
    telefono: req.body.telefono,
    token: req.body.token,
    estatus: 1
  });
  // guardando el usuario en la DB
  Usuarios.create(usuario, (err, data) => {
    if (err)
      res.status(500).send({ response: "fail", status: "OK", code: 500 });
    else res.send({ response: "success", status: "OK", code: 201, row: data });
  });
};

//================================= Actualizar usuario ==========================================//
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  //console.log(req.body.apellidos);
  Usuarios.updateById(
    req.params.id_usuario,
    new Usuarios(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No se ha encontrado un ususuario con el ID: ${req.params.id_usuario}.`
          });
        } else {
          res.status(500).send({
            message:
              "Error al actualizar el usuario con ID: " + req.params.id_usuario
          });
        }
      } else
        res.send({ response: "success", status: "OK", code: 200, row: data });
    }
  );
};
//================================= Eliminar usuario ==========================================//
exports.delete = (req, res) => {
  Usuarios.remove(req.params.id_usuario, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          response: "fail",
          status: "OK",
          message: `No se encontro el usario con ID ${req.params.id_usuario}.`,
          code: 404
        });
      } else {
        res.status(500).send({
          response: "fail",
          status: "OK",
          message:
            "No se oudo eliminar el usario con ID " + req.params.id_usuario,
          code: 500
        });
      }
    } else
      res.send({
        response: "success",
        status: "OK",
        message: `Usuario eliminado exitosamente`
      });
  });
};
//================================= Cambiar Clave ==========================================//
exports.cambiarClave = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "El contenido no puede ser vacio..!"
    });
  }
  console.log(req.body);
  Usuarios.cambiarClave(
    req.params.id_usuario,
    new Usuarios(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            response: "fail",
            status: "OK",
            code: 404
          });
        } else {
          res.status(500).send({
            response: "fail",
            status: "OK",
            code: 500
          });
        }
      } else res.send({ response: "success", status: "OK", code: 200 });
    }
  );
};
//============================== validar Rut ======================================//
exports.ValidarRut = (req, res) => {
  Usuarios.ValidarRut(req.params.rut, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          response: "fail",
          message: `No se ha encontrado un usuario con el Rut ${req.params.rut}`,
          code: 404
        });
      } else {
        res.status(500).send({
          response: "fail",
          message: "Error al obtener unsuario con Rut " + req.params.rut,
          code: 500
        });
      }
    } else
      res.send({ response: "success", status: "OK", code: 200, rut: data });
  });
};
//================================= Buscar Usuario ==========================================//
exports.buscarUsuario1 = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "El contenido no puede ser vacio..!"
    });
  }
  console.log(req.body);
  Usuarios.buscarUsuario1(new Usuarios(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          response: "fail",
          status: "OK",
          code: 404
        });
      } else {
        res.status(500).send({
          response: "fail",
          status: "OK",
          code: 500
        });
      }
    } else res.send({ response: data, status: "OK", code: 200 });
  });
};
exports.buscarUsuario = (req, res) => {
  Usuarios.buscarUsuario(req.params.usuario, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          response: "fail",
          message: `No se ha encontrado el usuario: ${req.params.usuario}`,
          code: 404
        });
      } else {
        res.status(500).send({
          response: "fail",
          message: "Error al obtener unsuario: " + req.params.usuario,
          code: 500
        });
      }
    } else res.send({ response: data, status: "OK", code: 200 });
  });
};

//================================= Email ==========================================//
exports.sendEmail = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "El contenido no puede ser vacio..!"
    });
  }
  console.log(req.body);
  Usuarios.sendEmail(new Usuarios(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          response: "fail",
          status: "OK",
          message: "Email invalido",
          code: 404
        });
      } else {
        res.status(500).send({
          response: "fail",
          status: "OK",
          message: "Error al procesar peticion ",
          code: 500
        });
      }
    } else
      res.send({
        message: "Email enviado",
        response: data,
        status: "OK",
        code: 200
      });
  });
};
