const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");
const indexRoute = require("./routes/index.routes");

const app = express();
const port = config.PORT;

const corsOptions={origin:true,optionsSuccessStatus:200};
app.use(cors(corsOptions));
app.use(express.json({limit:'20mb',extended:true}));
app.use(express.urlencoded({limit:'20mb',extended:true}));
app.use(morgan("dev"));

// Rutas
app.get("/", (req,res) => res.json({message: "OK"}));
app.use("/api",indexRoute.routes);

// Inicio del servidor
app.listen(port,()=> console.log(`Backend listening on port ${port}`));