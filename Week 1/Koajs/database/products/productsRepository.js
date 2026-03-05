const fs = require('fs')
const path = require('path')

const productsFilePath = path.join(__dirname, 'products.json');

function readProducts() {
    const raw = fs.readFileSync(productsFilePath, 'utf-8')
    const parsed = JSON.parse(raw)

    // Backward compatibility in case old code wrote { data: [...] }
    return Array.isArray(parsed) ? parsed : parsed.data || []
}

function writeProducts(data) {
    fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2))
}

function getAll(limit, sort) {
    const products = readProducts()
    const limitNumber = parseInt(limit)

    let result = [...products]

    if (sort === 'asc' || sort === 'desc') {
        result.sort((a,b) => (
            sort ==='asc'
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt))
        )
    }

    if (!isNaN(limitNumber) && limitNumber > 0) {
        result = result.slice(0, limitNumber)
    }

    return result;
}

function getOne(id, fieldsQuery) {
    const products = readProducts()
    const product = products.find(p => p.id === parseInt(id))

    if(!product) return null;
    if(!fieldsQuery) return product;
    // use the split method to convert the query fields into the array
    const fields = fieldsQuery.split(',').map((field)=> field.trim() )

    const partialProduct = {}
    fields.forEach(field => {
        if(product.hasOwnProperty(field)) {
            partialProduct[field] = product[field]
        } else {
            throw new Error(`${field} field not found`)
        }
    })

    return partialProduct
}

function remove(id) {
    const products = readProducts()
    const index = products.findIndex(p => p.id === parseInt(id))
    if (index === -1) return false

    products.splice(index, 1)
    writeProducts(products)
    return true
}

function add(data) {
    const products = readProducts()
    const newId = products.length ? Math.max(...products.map(product => product.id) + 1) : 1
    const newProduct = {
        id: newId,
        ...data,
        createAt: new Date().toISOString()
    }
    products.push(newProduct)
    writeProducts(products)
    return true
}

function change(id, data) {
    const products = readProducts()
    const index = products.findIndex(p => p.id === parseInt(id))
    if (index === -1) return false

    products[index] = data
    writeProducts(products)

    return true
}

module.exports = {
    getAll,
    getOne,
    add,
    remove,
    change
}
