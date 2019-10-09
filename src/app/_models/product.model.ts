import { Create, Update, Delete } from './app.model';

export class Product {
    constructor(
        public title: string,
        public price: string,
        public description: string = '',
        public id: string = new Date().valueOf().toString(), // Note: not scalable..,
        public date: string = new Date().toISOString(),
    ) {}
}

export interface ProductsQuery {
  batchSize?: number;
  search?: string;
}

export interface ManageProductData {
  product?: Product;
  method: Create | Update | Delete;
}
