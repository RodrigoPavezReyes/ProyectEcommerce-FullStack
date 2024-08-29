import { Router } from "express"
import User from "../model/user.model.js"
import { createHash, isValidPassword } from "../utils.js"
import passport from "passport"


const router = Router()

router.post("/register",passport.authenticate("register",{failureRedirect:"/failregister"}),async(req,res)=>{
        res.redirect("/login")
})

router.get("/failregister",async(req,res)=>{
    console.log("Registro fallido")
    res.send({error:"Failed"})
})


router.post("/login",passport.authenticate("login",{failureRedirect:"/faillogin"}),async(req,res)=>{
    if(!req.user)return res.status(400).send({status:"error", error: "Credenciales Invalidas"})
     // Verificar el rol del usuario
    if(req.user.role==="admin"){
        req.session.user = {
                first_name: req.user.first_name,  
                last_name: req.user.last_name,
                role: req.user.role
            };
    }else{
        req.session.user = {
            first_name: req.user.first_name,  
            last_name: req.user.last_name,}
    }
    //Envio los datos de session del usuario correcto a /profile de handlebars
    res.redirect("/products")
})

router.get("/faillogin",(req,res)=>{
    res.send({error:"Error de Login"})
})



router.post("/restore", passport.authenticate("restore",{failureRedirect:"/failrestore"}),async(req,res)=>{
            res.redirect("/login")
})

router.get("/failrestore",async(req,res)=>{
    console.log("Restablecimiento fallido")
    res.send({error:"Failed restore"})
})



//cierre de session
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error al cerrar sesión");
        }

        // Redirigir al usuario a la página de login o inicio
        res.redirect("/login"); // o a la ruta que desees
    });
});


//SESSIONS DE GITHUB

router.get("/github", passport.authenticate("github",{scope:["user:email"]}), async(req,res)=>{})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async(req,res)=>{

    req.session.user = req.user;
    res.redirect("/products")
})

export default router