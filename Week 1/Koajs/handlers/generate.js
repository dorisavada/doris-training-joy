const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

const TOTAL_RECORDS = 1000;

const products = [];

for (let i = 1; i <= TOTAL_RECORDS; i++) {
    products.push({
        id: i,
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price({ min: 10, max: 1000 })),
        description: faker.commerce.productDescription(),
        product: faker.commerce.department(),
        color: faker.color.human(),
        createdAt: faker.date.past().toISOString(),
        image: faker.image.url()
    });
}

const outputPath = path.join(__dirname, '../database/products/products.json');
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

console.log('✅ Generated 1000 products successfully!');
