const { getAll: getAllProducts, getOne: getOneProduct, add, remove, change } = require('../../database/products/productsRepository.js')
const { NotFoundError } = require("../../errors/httpErrors.js");

// 1. Get all list of products
async function getProducts(ctx) {
    const { limit, sort} = ctx.query
    const products = getAllProducts(limit, sort)

    ctx.status = 200
    ctx.body = {
        data: products
    }
}

// 2. Create a new product to the list
async function addProduct(ctx) {
    const newProduct = ctx.request.body
    const createAt = new Date()
    add({...newProduct, createAt });

    ctx.status = 201
    ctx.body = {
        success: true
    }
}

// 3. Update a product with the input data
async function changeProduct(ctx) {
    const id = ctx.params.id
    const product = getOneProduct(id)

    if(!product) throw new NotFoundError("Product not found")

    const updatedProduct =
        {
            ...ctx.request.body,
            id: product.id,
            createAt: product.createAt,
        }

    const result = change(id, updatedProduct)
    if (!result) throw new NotFoundError(`Product with id ${id} not found`)

    ctx.status= 200
    ctx.body = {
            success: true
    }
}

// 4. Delete a product of a given id
async function deleteProduct(ctx) {
    const id = ctx.params.id
    const result= remove(id)
    if (!result) throw new NotFoundError(`Product with id ${id} not found`)

    ctx.status = 204
}

// 5. Get one product by ID. param: fields=name,price
async function getProduct(ctx) {
    const id = ctx.params.id
    const fields  = ctx.query?.fields
    const product = getOneProduct(id, fields);

    if(!product) throw new NotFoundError("Product not found")

    ctx.status = 200
    ctx.body = {
        data: product
    }
}

module.exports = {
    getProducts,
    getProduct,
    addProduct,
    changeProduct,
    deleteProduct
}