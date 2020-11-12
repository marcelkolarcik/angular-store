import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../product.service";
import {Observable, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppingCartService} from "../shopping-cart.service";


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private subscription2: Subscription;
  public products: any[];
  public filteredProducts: any[];
  category: string;
  cart: any;


  constructor(private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute,
              private shoppingCartService: ShoppingCartService
             ) {


    this.subscription = this.productService.getAll()
      .subscribe(products => {
          this.filteredProducts = this.products = products;

          this.subscription2 =  this.route.queryParams.subscribe(params => {
            this.category = params.category;
            this.filteredProducts = this.category ?
              this.products.filter(p =>
                p.category === this.category) :
              this.products;

          });
        }
      );


  }

  async ngOnInit(): Promise<void> {
    this.cart  = await this.shoppingCartService.getCart();
    console.log('this,cart', this.shoppingCartService.getCart());

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

}
