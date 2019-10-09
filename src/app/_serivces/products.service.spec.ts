import { MaterialModule } from './../material/material.module';
import { MockModule } from './../mock/mock.module';
import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { HttpClientModule } from '@angular/common/http';

fdescribe('ProductsService', () => {
  let service: ProductsService;
  const apiDomain = 'https://in-memory.dev/';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        HttpClientModule,
        MockModule,
      ]
    });
    service = TestBed.get(ProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Note: Running Seed.ts requires manually updating test
  it(`should be able to update products on get() and return an observable of products'`, async () => {
    expect(service.collection.length).toEqual(0);
    const batchRequest = await service.read({ batchSize: 40 }).toPromise().then((prodcuts) => {
      expect(service.collection.length).toEqual(40);
      expect(prodcuts).toEqual(service.collection);
    });
    const searchRequestUpdate = await service.read({ search: 'bacon'}).toPromise().then((data) => {
      const expected = [{"title":"Unbranded Plastic Bacon","price":"362.00","description":"Eos cum distinctio atque qui. Adipisci eveniet animi consequatur qui. Iusto odio mollitia quos dolores voluptatem corporis qui. Et eos minima et.","id":"0541940e-9a96-4ce8-ac34-cdabdb4d5424","date":"2019-02-12T02:24:56.254Z"},{"title":"Handmade Steel Bacon","price":"548.00","description":"Doloremque quia maxime quia. Dolor omnis eum consequatur ratione fugit. Facilis minima unde consequuntur consectetur adipisci excepturi id iure.","id":"757109ff-50bd-4054-8578-873bfa12a5a8","date":"2019-05-06T22:44:46.384Z"}]
      expect(service.collection).toEqual(expected);
    });
  });
});
