const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");
const UserData = require("./models/UserData");

const app = express();
const port = 3000;

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

mongoose
  .connect(
    "mongodb+srv://cristdozap:HjwOcD0FjYc68jZr@cluster0.zwvtr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión:", err));

app.use("/api/auth", authRoutes);

app.post("/api/data", authMiddleware, async (req, res) => {
  const { serviceType, description, date, status } = req.body;
  const userId = req.user.id;

  try {
    const newUserData = new UserData({
      userId,
      serviceType,
      description,
      date,
      status,
    });
    await newUserData.save();
    res.json({ message: "Datos guardados", data: newUserData });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar los datos" });
  }
});

app.get("/api/data", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const data = await UserData.find({ userId });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los datos" });
  }
});

app.put("/api/data/:id", authMiddleware, async (req, res) => {
  const { serviceType, description, date, status } = req.body;
  const userId = req.user.id;

  try {
    const updatedData = await UserData.findOneAndUpdate(
      { _id: req.params.id, userId },
      { serviceType, description, date, status },
      { new: true }
    );
    res.json({ message: "Datos actualizados", data: updatedData });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar los datos" });
  }
});

app.delete("/api/data/:id", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    await UserData.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ message: "Datos eliminados" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar los datos" });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});

