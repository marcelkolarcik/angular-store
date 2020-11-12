import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ProductService} from "../../product.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: { [p: string]: any; id: string }[];
  filteredProducts: any[];
  subscription: Subscription;
  columns = [{name: 'Title'}, {name: 'Price'}, {name: 'Category'}];



  constructor(private productService: ProductService) {

    this.subscription = this.productService.getAll()
      .subscribe(products =>
        this.filteredProducts = this.products = products);

  }


  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // tslint:disable-next-line:typedef
  filter(query: string) {
    this.filteredProducts = query ?
      this.products.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;
  }

  getCellClass({row, column, value}): any {
    return {
      'bg-danger': value > 2
    };

  }
}

