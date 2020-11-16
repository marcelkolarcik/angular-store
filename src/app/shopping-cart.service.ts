import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Product} from "./models/product";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import firebase from "firebase";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService implements OnDestroy {
  private cartDoc: AngularFirestoreDocument<Product>;
  private cart;
  product;
  subscription: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  private productsCollection: AngularFirestoreCollection;
  products: Observable<any>;
  private order: any;
  private user: firebase.User;


  constructor(private afs: AngularFirestore, private authService: AuthService) {
  }


  // tslint:disable-next-line:typedef
  async getCart() {
    const cartId = await this.getOrCreateCartId();

    this.productsCollection = this.afs.collection<Product>('shopping-carts/' + cartId + '/items/');
    // .snapshotChanges() returns a DocumentChangeAction[], which contains
    // a lot of information about "what happened" with each change. If you want to
    // get the data and the id use the map operator.
    // tslint:disable-next-line:prefer-const
    this.products = this.productsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        const productTotal = a.payload.doc.data().product.price * a.payload.doc.data().quantity;
        return {productTotal, id, ...data};
      }))
    );

    return this.products;

  }


  // tslint:disable-next-line:typedef
  async clearCart() {

    const cartId = await this.getOrCreateCartId();
    const qry: firebase.firestore.QuerySnapshot = await this.afs.collection('shopping-carts/' + cartId + '/items/').ref.get();
    qry.forEach(doc => {
      console.log(doc.get('product').id);
      this.afs.doc<Product>('shopping-carts/' + cartId + '/items/' + doc.get('product').id).delete();
    });

    await this.afs.doc<Product>('shopping-carts/' + cartId).delete();
  }

  // tslint:disable-next-line:typedef
  async adjustCart(product, increase) {

    // increase quantity of a product by 1 if action is add, otherwise decrease by 1
    const cartId = await this.getOrCreateCartId();
    const product$ = this.getProduct(cartId, product.id);
    product$.ref.get()
      .then(item => {
          product$.set({
            product,
            quantity: (typeof item.data() !== "undefined" ? item.data().quantity : 0) + (increase)
          });

        }
      );
  }

  // tslint:disable-next-line:typedef
  async purchase(customer) {

    const cartId = await this.getOrCreateCartId();
    const qry: firebase.firestore.QuerySnapshot = await this.afs.collection('shopping-carts/' + cartId + '/items/').ref.get();
    const purchasedProducts = [];
    qry.forEach(doc => {
      purchasedProducts.push(doc.data());
    });

    this.subscription2 = this.authService.getUser$().subscribe(user => {
      this.user = user;
      this.afs.collection('users/' + this.user.uid + '/orders/').add({
        order: {
          customerName: customer.firstName,
          customerEmail: customer.email,
          order: purchasedProducts,
          customerId: this.user.uid,
        }
      });
    });
    await this.clearCart();

  }

  // tslint:disable-next-line:typedef
  getProduct(cartId, productId) {
    return this.afs.doc('shopping-carts/' + cartId + '/items/' + productId);
  }

  // tslint:disable-next-line:typedef
  private create() {
    return this.afs.collection('shopping-carts').add(
      {dateCreated: new Date().getTime()}
    );
  }
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
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }
}
