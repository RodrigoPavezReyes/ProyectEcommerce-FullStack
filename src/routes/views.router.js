import express from "express"
import productModel from "../model/products.model.js"
import User from "../model/user.model.js"

const router = express.Router()


router.get("/products", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
        }

        // Obtener información del usuario
        const { first_name, last_name, role} = req.session.user;

        //parametros de la consulta
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;

        const filter = {};
        if (req.query.title) {
            filter.title = req.query.title;
        } else if (req.query.stock) {
            filter.stock = parseInt(req.query.stock);
        }

        const sort = req.query.sort === "asc" ? "price" : req.query.sort === "desc" ? "-price" : null;

        const options = {
            page,
            limit,
            sort,
            customLabels: {
                totalDocs: 'totalProducts',
                docs: 'productsList',
                totalPages: 'totalPages',
                prevPage: 'prevPage',
                nextPage: 'nextPage',
                hasPrevPage: 'hasPrevPage',
                hasNextPage: 'hasNextPage',
                prevLink: 'prevLink',
                nextLink: 'nextLink'
            }
        };

        const result = await productModel.paginate(filter, options);

        res.render("products", {
            first_name,
            last_name,
            role,
            productsList: result.productsList,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            limit: result.limit
        });
    } catch (error) {
        console.error("Error al cargar los productos", error);
        res.status(500).send("Error al cargar los productos");
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (product) {
            res.render('productDetail', { product });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product details', error);
        res.status(500).send('Error fetching product details');
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid).populate("products.product");
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        res.render('cart', { cart });
    } catch (error) {
        console.error("Error al cargar el carrito", error);
        res.status(500).send("Error al cargar el carrito");
    }
});






////////////////////////////////////////////////
///////////SESSIONS/////////////////////////////

router.get("/login",(req,res)=>{
    res.render("login")
})

router.get("/register",(req,res)=>{
    res.render("register")
})

router.get("/restore",(req,res)=>{
    res.render("restore")
})


export default router

