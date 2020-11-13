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
  @Input('product') product;
  // tslint:disable-next-line:no-input-rename
  @Input('show-actions') showActions;

  // tslint:disable-next-line:no-input-rename
  @Input('shopping-cart') shoppingCart;
  quantity: any;

  constructor(private cartService: ShoppingCartService) {
  }

  addToCard(product: Product): void {
    this.cartService.addToCart(product);
  }

  // tslint:disable-next-line:typedef
  getQuantity() {

    if (!this.shoppingCart) {return 0; }
    this.shoppingCart.filter(item => {
      if (item.id === this.product.id) {
        this.quantity = item.quantity;
      }
    });
    return this.quantity;
  }
}
