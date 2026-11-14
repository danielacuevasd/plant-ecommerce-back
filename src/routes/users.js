//ejemplo prueba repo profesor

import express from "express";
// Creación del router
const router = express.Router();
// Creación de una ruta GET
router.get("/", (req, res) => {
res.json("Hola desde express!");
});
// exportación del router
export default router;