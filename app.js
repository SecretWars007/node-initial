const express = require("express");
const app = express();
const usuarios = require("./usuarios");
const authorizationToken = "Authorized 1234567"

app.use(express.json());
// Obtener todos los usuarios
app.get("/usuarios", (req, res) => {
  res.send(usuarios);
});

// Filtros por Nombre, Edad o ambos
app.get("/usuarios-filter", (req, res) => {
  const { nombre, edad } = req.query;

  //const filterNombre = usuarios.filter((u) => u.nombre.toLowerCase().includes(nombre.toLowerCase()));
  //const filterEdad = usuarios.filter((u) => u.edad.includes(edad));

  if (nombre && edad) {
    const data = usuarios.filter(
      (u) => u.nombre.toLowerCase().includes(nombre.toLowerCase()) && u.edad === parseInt(edad)
    );
    res.status(200).json(data);
  }

  if (nombre) {
    const data = usuarios.filter((u) => u.nombre.toLowerCase().includes(nombre.toLowerCase()));
    res.status(200).json(data);
  }

  if (edad) {
    const data = usuarios.filter((u) => u.edad === parseInt(edad));
    console.log(data);
    res.status(200).json(data);
  }
});

//Obtener un usuario por ID
app.get("/usuarios/:id", (req, res) => {
  const usuarioId = parseInt(req.params.id);
  const usuario = usuarios.find((u) => u.id === usuarioId);

  if (!usuario) return res.status(404).send("Usuario no encontrado");
  res.status(200).json(usuario);
});

//Crear un nuevo usuario
app.post("/usuarios", (req, res) => {
  const usuario = req.body;
  usuarios.push(usuario);
  res.status(200).json(usuarios);
});

//Actualizar un usuario
app.put("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const usuarioIndex = usuarios.findIndex((u) => u.id === id);

  if (usuarioIndex !== -1) {
    usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], ...req.body };
    res.status(200).json(usuarios[usuarioIndex]);
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
});

// delete
app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const usuarioIndex = usuarios.findIndex((u) => u.id === id);

  if (usuarioIndex !== -1) {
    usuarios.splice(usuarioIndex, 1);
    res.status(200).json(usuarios);
  } else {
    res.status(404).json({ message: "Usuario no encontrado" });
  }
});

//paginacion
app.get("/usuarios", (req, res) => {
  const { limit, page } = req.query;
  const { authorization } = req.headers;
  const isAuthorized = authorization === authorizationToken;

  if (!isAuthorized) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (limit && page) {
    const limitPage = parseInt(limit) * parseInt(page);
    const offset = limitPage - parseInt(limit);
    const data = usuarios.slice(offset, limitPage);
    return res.status(200).json(data);
  }

  res.send(usuarios);
});
// get id con autorizacion toke
app.get("/usuarios/:id", (req, res) => {
  const { authorization } = req.headers;
  const isAuthorized = authorization === authorizationToken;

  if (!isAuthorized) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const usuarioId = parseInt(req.params.id);
  const usuario = usuarios.find((u) => u.id === usuarioId);

  if (!usuario) return res.status(404).send("Usuario no encontrado");
  res.status(200).json(usuario);
});
// post alta masiva de usuarios
app.post("/bulk-usuarios", (req, res) => {
  const { body } = req;
  console.log(body);
  usuarios.push(...body);
  res.status(200).json(usuarios);
});
// delete masivo de usuarios
app.delete("/bulk-usuarios", (req, res) => {
  const { body } = req;
  console.log(body);
  usuarios.splice(0);
  res.status(200).json(usuarios);
});


app.listen(5000, () => console.log("Server Running"));
