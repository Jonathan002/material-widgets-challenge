import * as faker from 'faker';
import * as fs from 'fs';
import { join } from 'path';
import { Product } from '../app/_models/product.model';

const data = [];

// Fake Database... multiple asset.json with pagination api..
for (let i = 0; i < 100; i++) {
    data.push(new Product(
        faker.commerce.productName(),
        faker.commerce.price(),
        faker.lorem.sentences(),
        faker.random.uuid(),
        faker.date.past().toISOString(),
    ));
}

const fullPath = join(__dirname, '../app/mock/_models/database.model.ts');
const json = JSON.stringify(data, null, 2);
const file = `export const database = ${json}`;
fs.writeFileSync(fullPath, file, 'utf-8');
console.log(`Mock Database Seeded at: ${fullPath}`);
