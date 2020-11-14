import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";
import {AngularFirestore} from "@angular/fire/firestore";
import {ShoppingCartService} from "../shopping-cart.service";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isAdmin: boolean;
  subscription: Subscription;
  shoppingCartItemsCount;
  cart$;

  constructor(public auth: AuthService,
              private afs: AngularFirestore,
              private shoppingCartService: ShoppingCartService) {
  }

  logout(): void {
    this.auth.logout();
  }

  // tslint:disable-next-line:typedef
  async ngOnInit() {


    // localStorage.removeItem('cartId');
    this.subscription =
      this.auth.user$.subscribe(user => {
        // check if user is admin
        if (user) {

          this.afs.collection('users')
            .doc(user.uid)
            .valueChanges()
            .subscribe(adminUser => this.isAdmin = adminUser['isAdmin']);
        }


      });


    this.cart$ = await this.shoppingCartService.getCart();
    // getting total quantity of products

    this.cart$.subscribe(items => {
        this.shoppingCartItemsCount = 0;

        items.map(item => {

          this.shoppingCartItemsCount += item.quantity;


        });
      }
    )
    ;
  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }

}
