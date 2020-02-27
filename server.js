const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// analizar las solicitudes de content-type - application/json
app.use(bodyParser.json());

// analizar las solicitudes de content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(body_parser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
});

// Ruta de Inicio
app.get("/", (req, res) => {
  res.json({
    message: "API Node Js.",
    Author: "Javier La Cruz",
    Node_Version: "v12.15.0"
  });
});

require("./app/routes/endponits.routes.js")(app);

// establecer puerto, escuchar solicitudes
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}.`);
});
