import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../product.service";
import {Subscription} from "rxjs";
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
  private cartSubscription: Subscription;
  public products: any[];
  public filteredProducts: any[];
  category: string;
  cart: any;
  private cartSer: any;
  private quantities: [] = [];


  constructor(private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute,
              private shoppingCartService: ShoppingCartService
  ) {


  }

  async ngOnInit(): Promise<void> {

    await this.getQuantities();

    this.getProducts();

  }

  // tslint:disable-next-line:typedef
  private async getQuantities() {
    this.cartSer = await this.shoppingCartService.getCart();
    this.cartSubscription = this.cartSer.subscribe(items => {
      items.map(item => { // @ts-ignore
        this.quantities[item.id] = item.quantity;
      });
      this.cart = this.quantities;

    });
  }

  // tslint:disable-next-line:typedef
  private getProducts() {
    this.subscription = this.productService.getAll()
      .subscribe(products => {
          this.filteredProducts = this.products = products;

          this.subscription2 = this.route.queryParams.subscribe(params => {
            this.category = params.category;
            this.filteredProducts = this.category ?
              this.products.filter(p =>
                p.category === this.category) :
              this.products;

          });
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.cartSubscription.unsubscribe();
  }

}
