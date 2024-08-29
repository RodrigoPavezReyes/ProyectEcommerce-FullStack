import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt"

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);


// Crear __dirname manualmente
const __filename = fileURLToPath(import.meta.url); // Obtiene la ruta del archivo actual
const __dirname = dirname(__filename); // Obtiene el directorio del archivo actual


export {createHash, isValidPassword, __dirname}

