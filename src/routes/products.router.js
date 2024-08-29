import { Router } from "express";
import productModel from "../model/products.model.js";

const router = Router();

router.get("/products", async (req, res) => {
    try {
        // Obtener parámetros de consulta
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        
        // Construir el filtro basado en el query
        let filter = {};
        if (req.query.title) {
            filter.title = req.query.title; // filtrar por tittle 
        }else if(req.query.stock){
            filter.stock = parseInt (req.query.stock)
        }

        // Opciones para el ordenamiento
        let sort = null;
        if (req.query.sort === "asc") {
            sort = "price";
        } else if (req.query.sort === "desc") {
            sort = "-price";
        }

        // Opciones para la paginación
        const options = {
            page: page,
            limit: limit,
            sort: sort,
            customLabels: {
                totalDocs: 'totalProducts',
                docs: 'payload',
                totalPages: 'totalPages',
                prevPage: 'prevPage',
                nextPage: 'nextPage',
                hasPrevPage: 'hasPrevPage',
                hasNextPage: 'hasNextPage',
                prevLink: 'prevLink',
                nextLink: 'nextLink'
            }
        };

        // Ejecutar la consulta
        const result = await productModel.paginate(filter, options);

        // Construir enlaces para páginas previas y siguientes
        const baseUrl = '/api/products';
        const resultPrevLink = result.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${result.prevPage}${req.query.sort ? `&sort=${req.query.sort}` : ''}${req.query.query ? `&query=${encodeURIComponent(req.query.query)}` : ''}` : null;
        const resultNextLink = result.hasNextPage ? `${baseUrl}?limit=${limit}&page=${result.nextPage}${req.query.sort ? `&sort=${req.query.sort}` : ''}${req.query.query ? `&query=${encodeURIComponent(req.query.query)}` : ''}` : null;

        // Enviar respuesta
        res.send({
            status: 'success',
            payload: result.payload,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: resultPrevLink,
            nextLink: resultNextLink
        });

    } catch (error) {
        console.error("Error al cargar los productos", error);
        res.status(500).send({ status: 'error', message: 'Error al cargar los productos' });
    }
});




router.post("/products",async(req,res)=>{
    try {
        let{title, description,price,thumbnail,code,stock} = req.body
        if(!title ||  !description || !price || !thumbnail || !code || !stock){
            return res.send({status:"error", error:"Faltan datos obligatorios"})
        }
        
        let result = await productModel.create({title, description,price,thumbnail,code,stock})
        res.send ({result:"success", payload: result})
    } catch (error) {
        console.error("Error al ingresar el producto", error);
        
    }
})

router.put("/products/:uid",async(req,res)=>{
    try {
        let{uid}=req.params
        let productsToReplace = req.body
        if(!productsToReplace.title || !productsToReplace.description || !productsToReplace.thumbnail || !productsToReplace.code || !productsToReplace.stock){
            return res.send({status: "error", error: "Faltan datos obligatorios para reemplazar el producto"})
        }

        let result = await productModel.updateOne({_id : uid}, productsToReplace)
        res.send ({result:"success", payload:result})
    } catch (error) {
        console.error("Error al reemplazar el producto", error);
    }
})


router.delete("/products/:uid",async(req,res)=>{
    try {
        let{uid}= req.params
        let result = await productModel.deleteOne({_id : uid})
        res.send({result:"success", payload:result})

    } catch (error) {
        console.error("Error al eliminar el producto", error);
    }
})

export default router