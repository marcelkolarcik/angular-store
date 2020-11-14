import {Component, OnInit} from '@angular/core';
import {ShoppingCartService} from "../shopping-cart.service";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart$;
  private shoppingCartItemsCount: number;
  totalPrice: number;
  private quantities: [] = [];

  constructor(private shoppingCartService: ShoppingCartService) {
  }

  // tslint:disable-next-line:typedef
  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
    // getting total quantity of products

    this.cart$.subscribe(items => {
        this.shoppingCartItemsCount = 0;
        this.totalPrice = 0;
        items.map(item => {

          this.shoppingCartItemsCount += item.quantity;
          this.totalPrice += item.quantity * item.product.price;
          // @ts-ignore
          this.quantities[item.id] = item.quantity;

        });
      }
    )
    ;
  }

  // tslint:disable-next-line:typedef
  async clearCart() {
   await this.shoppingCartService.clearCart();
  }

}
