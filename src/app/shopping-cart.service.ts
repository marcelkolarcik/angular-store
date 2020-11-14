import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Product} from "./models/product";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import firebase from "firebase";

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
  async getCart() {
    const cartId = await this.getOrCreateCartId();

    this.productsCollection = this.afs.collection<Product>('shopping-carts/' + cartId + '/items/');
    // .snapshotChanges() returns a DocumentChangeAction[], which contains
    // a lot of information about "what happened" with each change. If you want to
    // get the data and the id use the map operator.

    this.products = this.productsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );

    return this.products;

  }

  // tslint:disable-next-line:typedef
  async clearCart() {

    const cartId = await this.getOrCreateCartId();
    const cart  = this.afs.collection<Product>('shopping-carts/' + cartId + '/items/');
    console.log('cart' , cart.get() );
    const qry: firebase.firestore.QuerySnapshot = await this.afs.collection('shopping-carts/' + cartId + '/items/').ref.get();
    // const batch = this.db.firestore.batch();

    // You can use the QuerySnapshot above like in the example i linked
    qry.forEach(doc => {
    console.log(doc.get('product').id);
    this.afs.doc<Product>('shopping-carts/' + cartId + '/items/' + doc.get('product').id).delete();
    });

    await this.afs.doc<Product>('shopping-carts/' + cartId ).delete();
  }

  // tslint:disable-next-line:typedef
  async adjustCart(product, action) {

    // increase quantity of a product by 1 if action is add, otherwise decrease by 1
    const cartId = await this.getOrCreateCartId();
    const item$ = this.getItem(cartId, product.id);
    item$.ref.get()
      .then(item =>
        item$.set({
          product,
          quantity: (typeof item.data() !== "undefined" ? item.data().quantity : 0) + (action === 'add' ? 1 : -1)
        })
      );
  }

  // tslint:disable-next-line:typedef
  getItem(cartId, productId) {
    return this.afs.doc('shopping-carts/' + cartId + '/items/' + productId);
  }

  // tslint:disable-next-line:typedef
  private create() {
    return this.afs.collection('shopping-carts').add(
      {dateCreated: new Date().getTime()}
    );
  }

  // using async and await, we don't need to call then on promise
  // tslint:disable-next-line:typedef
  private async getOrCreateCartId(): Promise<string> {

    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      return cartId;
    }

    const newCart = await this.create();
    localStorage.setItem('cartId', newCart.id);
    return newCart.id;
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
