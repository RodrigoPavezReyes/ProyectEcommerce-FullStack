import express from "express";
import session from 'express-session';
import path from "path";
import { create } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import mongoose from "mongoose";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import sessionRouter from "./routes/session.router.js"
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import Handlebars from "handlebars";
import MongoStore from "connect-mongo"
import { __dirname } from "./utils.js"
import passport from "passport";
import initializePassport from "./config/passport.config.js";


const app = express();
const PORT = 8080;

// Configuración de Handlebars
const hbs = create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
});

// Configuración del motor de plantillas
app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public'))); // Cambiado a '/public' para servir archivos estáticos

// Conexión con la base de datos
//conexion a mongo
mongoose.connect("mongodb+srv://devpavez:20232023@clusterpavez.pg1fh.mongodb.net/HOLloginFULL?retryWrites=true&w=majority")
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error de conexión a MongoDB:", err));

app.use(session({
    store:MongoStore.create({
        mongoUrl: "mongodb+srv://devpavez:20232023@clusterpavez.pg1fh.mongodb.net/HOLloginFULL?retryWrites=true&w=majority&appName=ClusterPavez"
    }),
    secret:"coderhouse",
    resave:false,
    saveUninitialized:false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
