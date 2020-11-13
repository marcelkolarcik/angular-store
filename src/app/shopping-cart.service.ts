import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Product} from "./models/product";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService implements OnDestroy {
  private cartDoc: AngularFirestoreDocument<Product>;
  private cart;
  product;
  subscription: Subscription;
  private productsCollection: AngularFirestoreCollection;
  products: Observable<any>;

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

    this.productsCollection = this.afs.collection<Product>('shopping-carts/' + cartId + '/items/');
    // .snapshotChanges() returns a DocumentChangeAction[], which contains
    // a lot of information about "what happened" with each change. If you want to
    // get the data and the id use the map operator.

    return this.productsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );


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
