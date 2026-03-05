const Router = require("koa-router");
const ProductHandler = require('../handlers/products/productHandlers.js')
const {validateUpdateProduct, validateCreateProduct } = require('../middleware/productInputMiddleware.js');

const router = new Router({
    prefix: "/api"
});


router.get("/products", ProductHandler.getProducts)

router.post('/products', validateCreateProduct, ProductHandler.addProduct);

router.put('/product/:id', validateUpdateProduct, ProductHandler.changeProduct);

router.delete("/product/:id", ProductHandler.deleteProduct)

router.get("/product/:id", ProductHandler.getProduct)

module.exports = router;