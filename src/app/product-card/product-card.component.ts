import {Component, Input} from '@angular/core';
import {Product} from "../models/product";
import {ShoppingCartService} from "../shopping-cart.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  // tslint:disable-next-line:no-input-rename
  @Input('product') product: Product;
  // tslint:disable-next-line:no-input-rename
  @Input('show-actions') showActions;

  // tslint:disable-next-line:no-input-rename
  @Input('shopping-cart') shoppingCart;
  quantity: any;

  constructor(private cartService: ShoppingCartService) {
  }

  addToCard(): void {
    this.cartService.adjustCart(this.product, 1);
  }
  // tslint:disable-next-line:typedef
  getQuantity() {
    return  this.shoppingCart ? this.shoppingCart[this.product.id] :  0 ;
  }
}
