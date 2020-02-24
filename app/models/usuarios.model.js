const sql = require("./db.js");
var sha1 = require("sha1");
const random = require("random");
var md5 = require("md5");
var bodyParser = require("body-parser");

// constructor
const Usuarios = function(usuario) {
  this.nombres = usuario.nombres;
  this.apellidos = usuario.apellidos;
  this.usuario = usuario.usuario;
  this.rut = usuario.rut;
  this.clave = usuario.clave;
  this.rol = usuario.rol;
  this.email = usuario.email;
  this.telefono = usuario.telefono;
  this.token = usuario.token;
  this.estatus = usuario.estatus;
};

//================================= Login de usuario ==========================================//
Usuarios.login = (usuario, result) => {
  var nuevoToken = random.float((min = 0), (max = 1));
  var token = sha1(nuevoToken);
  sql.query(
    `UPDATE t_usuarios set token='${token}' where rut='${usuario.rut}' and clave = md5('${usuario.clave}')`,

    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // usuario no encontrado
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, token);
      return;
    }
  );
};
//======================================== Logout ====================================================//
Usuarios.logout = (id_usuario, usuario, result) => {
  sql.query(
    `UPDATE t_usuarios SET token = null WHERE id_usuario = ?`,
    [id_usuario],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // usuario no encontrado con el id_usuario especificado
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("Token  removido: ", {
        id_usuario: id_usuario,
        ...usuario
      });
      result(null, { id_usuario: id_usuario, ...usuario });
    }
  );
};
//================================= Listado general de usuarios ==========================================//
Usuarios.getAll = result => {
  let query = `SELECT u.id_usuario,u.nombres, u.apellidos, u.usuario, u.rut, u.clave, u.rol, u.email,u.telefono,
               u.token,u.estatus, DATE_FORMAT(u.fecha_registro,'%d-%m-%Y')as fecha_registro, r.descripcion_rol      
               FROM 
               t_usuarios u
               left join n_roles r on (r.id_rol= u.rol) `;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("usuarios: ", res);
    result(null, res);
  });
};

//================================= Usuario por ID ==========================================//
Usuarios.usId = (id_usuario, result) => {
  let query = `SELECT u.id_usuario,u.nombres, u.apellidos, u.usuario, u.rut, u.clave, u.rol, u.email,u.telefono,
                 u.token,u.estatus, u.fecha_registro, r.descripcion_rol      
                 FROM 
                 t_usuarios u
                 left join n_roles r on (r.id_rol= u.rol) 
                 WHERE u.id_usuario = ${id_usuario}`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.length) {
      console.log("usuario encontrado: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

//================================= Registrar usuario ==========================================//
Usuarios.create = (nuevoUsuario, result) => {
  sql.query("INSERT INTO t_usuarios SET ?", nuevoUsuario, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("usuario creado: ", {
      id_usuario: res.insertId,
      ...nuevoUsuario
    });
    result(null, { id_usuario: res.insertId, ...nuevoUsuario });
  });
};
//================================= Editar usuario ==========================================//
Usuarios.updateById = (id_usuario, usuario, result) => {
  sql.query(
    "UPDATE t_usuarios SET nombres = ?, apellidos = ?, rut=?,usuario=?, telefono=?,email=? WHERE id_usuario= ?",
    [
      usuario.nombres,
      usuario.apellidos,
      usuario.rut,
      usuario.usuario,
      usuario.telefono,
      id_usuario
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // No se encontro usuario
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("usuario actualizado: ", {
        id_usuario: id_usuario
      });
      result(null, { id_usuario: id_usuario, ...usuario });
    }
  );
};
//================================= Eliminar usuario ==========================================//
Usuarios.remove = (id_usuario, result) => {
  sql.query(
    "DELETE FROM t_usuarios WHERE id_usuario = ?",
    id_usuario,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // usuario no encontrado con el id_usuario especificado
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("Usuario eliminado con ID: ", id_usuario);
      result(null, res);
    }
  );
};

//======================================== Cambiar Clave ====================================================//
Usuarios.cambiarClave = (id_usuario, usuario, result) => {
  sql.query(
    `UPDATE t_usuarios SET clave=md5('${usuario.clave}') WHERE id_usuario='${id_usuario}' `,

    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // usuario no encontrado con el id_usuario especificado
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("Token  removido: ", {
        id_usuario: id_usuario,
        ...usuario
      });
      result(null, { id_usuario: id_usuario, ...usuario });
    }
  );
};
//================================= validar Rut ==========================================//
Usuarios.ValidarRut = (rut, result) => {
  let query = `SELECT rut FROM t_usuarios WHERE rut = '${rut}'`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.length) {
      console.log("usuario encontrado: ", res[0]);
      result(null, res[0].rut);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

//================================= Buscar usuario ==========================================//
Usuarios.buscarUsuario1 = (usuario, result) => {
  sql.query(
    `SELECT * FROM t_usuarios where usuario='${usuario.usuario}'`,

    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.length) {
        console.log("usuario encontrado: ", res[0]);
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    }
  );
};

Usuarios.buscarUsuario = (usuario, result) => {
  let query = `SELECT u.id_usuario,u.nombres, u.apellidos, u.usuario, u.rut, u.clave, u.rol, u.email,u.telefono,
                 u.token,u.estatus, u.fecha_registro, r.descripcion_rol      
                 FROM 
                 t_usuarios u
                 left join n_roles r on (r.id_rol= u.rol) 
                 WHERE u.usuario = '${usuario}'`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.length) {
      console.log("usuario encontrado: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

module.exports = Usuarios;
