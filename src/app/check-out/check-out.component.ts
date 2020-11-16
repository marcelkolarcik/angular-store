import {Component, OnInit} from '@angular/core';
import {ShoppingCartService} from "../shopping-cart.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  cart$;
  private cartSubscription: Subscription;

  private totalPrice = 0;


  constructor(private shoppingCartService: ShoppingCartService, private router: Router) {
  }

  // tslint:disable-next-line:typedef
  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
    this.cartSubscription = this.cart$.subscribe(items => {
        items.map(item => {
          this.totalPrice += item.quantity * item.product.price;
        });
      }
    )
    ;

  }

  // tslint:disable-next-line:typedef
  async purchase(customer) {
    await this.shoppingCartService.purchase(customer);
    await this.router.navigate(['']);
    window.location.reload();
  }


}
