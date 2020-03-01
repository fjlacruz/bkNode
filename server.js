const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//const pdf = require("pdf").pdf;
//const fs = require("fs");

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

//====================== Configuracion para crear PDF ====================================//
// var doc = new pdf();

// doc.setFontSize(22);

// let titulo = "Pagina de Inicio";
// doc.text(20, 20, `${titulo}`);
// doc.text(20, 40, "Pagina de inicio 2 PDF");
// doc.addPage();
// doc.text(20, 20, "Pagina Siguiente de inicio PDF");

// doc.setProperties({
//   title: "A sample document created by pdf.js",
//   subject: "PDFs are kinda cool, i guess",
//   author: "Marak Squires",
//   keywords: "pdf.js, javascript, Marak, Marak Squires",
//   creator: "pdf.js"
// });

// var fileName = "testFile" + ".pdf";

// fs.writeFile(fileName, doc.output("pdf"), function(err, data) {
//   console.log(" PDF creado con exito...!!!!");
// });
//====================== Fin configuracion para crear PDF =================================//
// establecer puerto, escuchar solicitudes
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}.`);
});
