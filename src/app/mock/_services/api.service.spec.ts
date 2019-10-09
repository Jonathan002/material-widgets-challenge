import { TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { MockResponse } from '../_models/api.model';
import { database } from '../_models/database.model';

fdescribe('ApiService', () => {
  let service: ApiService;
  const apiDomain = 'https://in-memory.dev/';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.get(ApiService);
    // Prevents Database Instance from being altered by test
    const databaseStatic = JSON.stringify(database);
    (service as any).database = JSON.parse(databaseStatic);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`should be able to respond to the request path of 'v1/products?batchSize=40'`, async () => {
    const req = new HttpRequest('GET', `${apiDomain}v1/products?batchSize=40`);
    const res: any = await service.makeRequest(req);
    const { body } = res;
    expect(body.length).toEqual(40);
  });

  it(`should be able to respond to the request path of 'v1/products and return and empty [] without page query'`, async () => {
    const req = new HttpRequest('GET', `${apiDomain}v1/products`);
    const res: any = await service.makeRequest(req);
    const { body } = res;
    expect(Array.isArray(body)).toEqual(true);
    expect(body.length).toEqual(0);
  });

  it(`should be able to provide a 404 response`, async () => {
    const req = new HttpRequest('GET', `${apiDomain}v1/404`);
    const res: any = await service.makeRequest(req);
    const expected = new MockResponse(null, 404, 'NOT_FOUND');
    expect(res).toEqual(expected);
  });

  // Note: The test below need to be updated each time the seed.ts file is run!
  it(`should be able to respond to the request path of 'v1/products/unbranded-plastic-bacon`, async () => {
    const req = new HttpRequest('GET', `${apiDomain}v1/products/unbranded-plastic-bacon`);
    const res: any = await service.makeRequest(req);
    const { body } = res;
    const expected = {
      title: 'Unbranded Plastic Bacon',
      price: '362.00',
      description:
        'Eos cum distinctio atque qui. Adipisci eveniet animi consequatur qui. Iusto odio mollitia quos dolores voluptatem corporis qui. Et eos minima et.',
      id: '0541940e-9a96-4ce8-ac34-cdabdb4d5424',
      date: '2019-02-12T02:24:56.254Z'
    };
    expect(body).toEqual(expected);
  });

  it(`should be able to handle search request for the search term 'bacon'`, async () => {
    const req = new HttpRequest('GET', `${apiDomain}v1/products?search=bacon`);
    const res: any = await service.makeRequest(req);
    const { body } = res;
    const expected = [
      {
        title: 'Unbranded Plastic Bacon',
        price: '362.00',
        description:
          'Eos cum distinctio atque qui. Adipisci eveniet animi consequatur qui. Iusto odio mollitia quos dolores voluptatem corporis qui. Et eos minima et.',
        id: '0541940e-9a96-4ce8-ac34-cdabdb4d5424',
        date: '2019-02-12T02:24:56.254Z'
      },
      {
        title: 'Handmade Steel Bacon',
        price: '548.00',
        description:
          'Doloremque quia maxime quia. Dolor omnis eum consequatur ratione fugit. Facilis minima unde consequuntur consectetur adipisci excepturi id iure.',
        id: '757109ff-50bd-4054-8578-873bfa12a5a8',
        date: '2019-05-06T22:44:46.384Z'
      }
    ];
    expect(body).toEqual(expected);
  });

  it(`should be able to provide a 201 response for post request to 'products'`, async () => {
    const itemToCreate = {
      title: 'Handmade Steel Bacon',
      price: '548.00',
      description:
        'Doloremque quia maxime quia. Dolor omnis eum consequatur ratione fugit. Facilis minima unde consequuntur consectetur adipisci excepturi id iure.',
      id: '757109ff-50bd-4054-8578-873bfa12a5a8',
      date: '2019-05-06T22:44:46.384Z'
    };
    expect((service as any).database.length).toEqual(100)
    const req = new HttpRequest('POST', `${apiDomain}v1/products`, itemToCreate);
    const res: any = await service.makeRequest(req);
    expect(res.status).toEqual(201);
    expect(res.body).toEqual(itemToCreate);
    expect((service as any).database.length).toEqual(101);
  });

  it(`should be able to provide a 204 response for post request to 'products'`, async () => {
    const updatedProduct = {
      'title': 'Licensed Hard Tuna',
      'price': '41.00',
      'description': 'Amet voluptates dicta eos non ab ut. Nesciunt aliquid error error. Ratione mollitia est velit animi eum cum sapiente. Et ipsum ad harum ab magni dolor vel. Et aut dolorem consectetur. Culpa quia id non tempora et quia dolor consequuntur.',
      'id': '04fed37f-ea54-4daa-b9fb-87bc963bace1',
      'date': '2019-05-30T18:40:22.080Z'
    };
    expect((service as any).database.length).toEqual(100)
    const req = new HttpRequest('PUT', `${apiDomain}v1/products/`, updatedProduct);
    const res: any = await service.makeRequest(req);
    expect(res.status).toEqual(204);
    expect((service as any).database.length).toEqual(100);
  });

  it(`should be able to provide a 204 response for delete request to 'products/:id'`, async () => {
    expect((service as any).database.length).toEqual(100)
    const req = new HttpRequest('DELETE', `${apiDomain}v1/products/6fec1bee-7dd7-426e-86f0-6269f53fe8e8`);
    const res: any = await service.makeRequest(req);
    expect(res.status).toEqual(204);
    expect((service as any).database.length).toEqual(99);
  });
});
