import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../models/product";
import {ShoppingCartService} from "../shopping-cart.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.css']
})
export class ProductQuantityComponent  {

 // tslint:disable-next-line:no-input-rename
  @Input('product') product: Product;
  // tslint:disable-next-line:no-input-rename
  @Input('shopping-cart') shoppingCart;
  quantity: any;

  constructor(private cartService: ShoppingCartService) {
  }

  addToCard(): void {
    this.cartService.adjustCart(this.product, 1);
  }
  removeFromCart(): void {
    this.cartService.adjustCart(this.product, -1 );
  }

  // tslint:disable-next-line:typedef
  getQuantity() {
    return  this.shoppingCart[this.product.id] ? this.shoppingCart[this.product.id] :  0 ;
  }

}
