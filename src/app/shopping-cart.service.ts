import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Product} from "./models/product";
import {Subscription} from "rxjs";
import firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService implements OnDestroy {
  private cartDoc: AngularFirestoreDocument<Product>;
  cart;
  product;
  subscription: Subscription;

  constructor(private afs: AngularFirestore) {
  }

  // tslint:disable-next-line:typedef
  private create() {
    return this.afs.collection('shopping-carts').add(
      {dateCreated: new Date().getTime()}
    );
  }

  // tslint:disable-next-line:typedef
  async getCart() {
    const cartId = await this.getOrCreateCartId();
    this.afs.doc('shopping-carts/' + cartId).ref.get().then(cart => {

      console.log('cart : ', cart.data());
    });

    // return this.cart;

    const snapshot = await firebase.firestore()
      .collection('shopping-carts')
      .doc(cartId)
      .collection('items')
      .get();

    snapshot.forEach(doc => {
      console.log('hello', doc.data(), doc.id);
      return {data: doc.data(), id: doc.id};
    });

   //  return 7;


  }

  // tslint:disable-next-line:typedef
  getItem(cartId, productId) {
    return this.afs.doc('shopping-carts/' + cartId + '/items/' + productId);
  }

  // using async and await, we don't need to call then on promise
  // tslint:disable-next-line:typedef
  private async getOrCreateCartId(): Promise<string> {

    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      return cartId;
    }

    const result = await this.create();
    localStorage.setItem('cartId', result.id);
    return result.id;
  }

  // tslint:disable-next-line:typedef
  async addToCart(product: Product) {

    const cartId = await this.getOrCreateCartId();
    /*get product*/
    const item$ = this.getItem(cartId, product.id);

    item$.ref.get()
      .then(item =>
        item$.set({product, quantity: 1 + (typeof item.data() !== "undefined" ? item.data().quantity : 0)})
      )
    ;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
