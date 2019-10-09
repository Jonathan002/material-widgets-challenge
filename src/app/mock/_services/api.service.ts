import { Injectable } from '@angular/core';
import * as Case from 'case';
import * as pathToRegex from 'path-to-regexp';
import * as url from 'url';
import { Product } from '../../_models/product.model';
import { MockResponse } from '../_models/api.model';
import { database } from './../_models/database.model';
import { HttpRequest } from '@angular/common/http';
import * as faker from 'faker';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private database: Product[] = database;
  private res: MockResponse;
  private _next = false;
  private next() {
    this._next = true;
  }

  private handleGetReq(path, req) {
    switch (true) {
      case pathToRegex('/v1/products/:product').test(path):
        this.getProduct(req);
        break;
      case pathToRegex('/v1/products').test(path):
        this.getProductCollection(req);
        break;
      default:
        this.notFound();
        break;
    }
  }

  private handlePostReq(path, req) {
    switch (true) {
      case pathToRegex('/v1/products').test(path):
        this.postProduct(req);
        break;
      default:
        this.notFound();
        break;
    }
  }

  private handlePutReq(path, req) {
    switch (true) {
      case pathToRegex('/v1/products').test(path):
        this.putProduct(req);
        break;
      default:
        this.notFound();
        break;
    }
  }

  private handleDeleteReq(path, req) {
    switch (true) {
      case pathToRegex('/v1/products/:id').test(path):
        this.deleteProduct(req);
        break;
      default:
        this.notFound();
        break;
    }
  }

  private deleteProduct(req?) {
    const { pathname } = req;
    const pathArr = pathname.split('/');
    const id = pathArr.pop();
    if (id) {
      const productIdx = this.database.findIndex(product => product.id === id);
      if (productIdx > -1) {
        this.database.splice(productIdx, 1);
        this.res = new MockResponse(null, 204, 'NO_CONTENT');
        return;
      }
    }
    this.next();
  }

  private putProduct(req?) {
    const { body } = req;
    const productIdx = this.database.findIndex((product) => product.id === body.id);
    if (productIdx > -1) {
      this.database[productIdx] = body;
      this.res = new MockResponse(null, 204, 'NO_CONTENT');
    } else {
      this.next();
    }
  }

  private sanitize(req?) {
    // Converts price int to str for search to work..
    if (req.body && req.body.price) {
      req.body.price = req.body.price.toString();
    }
  }

  private postProduct(req?) {
    const item = req.body;
    item.id = faker.random.uuid();
    this.database.push(item);
    this.res = new MockResponse(item, 201, 'CREATED');
  }

  private notFound() {
    this.res = new MockResponse(null, 404, 'NOT_FOUND');
  }

  private getProductCollection(req?) {
    const { batchSize, search } = req.query;
    const batchSizeInt = parseInt(batchSize as any, 10);
    let products;
    if (search) {
      const lowercaseSearch = search.toLowerCase();
      products = this.database.filter(item => {
        const { title, price, date } = item;
        return (
          title.toLowerCase().includes(lowercaseSearch) ||
          price.toLowerCase().includes(lowercaseSearch) ||
          date.toLowerCase().includes(lowercaseSearch)
        );
      });
    } else {
      products = this.database.slice(0, batchSizeInt);
    }
    this.res = new MockResponse(products);
  }

  private getProduct(req?) {
    const segments = req.pathname.split('/');
    const productName = segments[3];
    const lowerTitleCase = Case.title(productName).toLowerCase();
    const item = this.database.find(product => {
      return product.title.toLowerCase() === lowerTitleCase;
    });
    if (item) {
      this.res = new MockResponse(item);
    } else {
      this.next();
    }
  }

  makeRequest(req: HttpRequest<any>) {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;
    const updatedReq = { ...req, ...parsedUrl };

    // validate and sanitize..
    this.sanitize(updatedReq);

    // API Router..
    if (updatedReq.method === 'GET') {
      this.handleGetReq(pathname, updatedReq);
    } else if (updatedReq.method === 'POST') {
      this.handlePostReq(pathname, updatedReq);
    } else if (updatedReq.method === 'PUT') {
      this.handlePutReq(pathname, updatedReq);
    } else if (updatedReq.method === 'DELETE') {
      this.handleDeleteReq(pathname, updatedReq);
    }

    if (this._next) {
      this._next = false;
      this.notFound();
    }

    return new Promise((resolve, reject) => {
      const res = this.res;
      setTimeout(() => {
        resolve(res);
      }, 1000);
    });
  }
}
