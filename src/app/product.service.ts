import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {Product} from "./models/product";



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsCollection: AngularFirestoreCollection;
  products: Observable<any>;

  private productDoc: AngularFirestoreDocument<Product>;
  product: Observable<Product>;

  constructor(private afs: AngularFirestore) {
  }

  // tslint:disable-next-line:typedef
  create(product) {
    this.afs.collection('products').add(product);
  }

  // tslint:disable-next-line:typedef
  update(productId, product: Product) {
    this.productDoc = this.afs.doc<Product>('products/' + productId);
    this.productDoc.update(product);
  }

  // tslint:disable-next-line:typedef
  getAll() {
    // return this.afs.collection('products').valueChanges();
    this.productsCollection = this.afs.collection<Product>('products', ref => ref.orderBy('title'));
    // .snapshotChanges() returns a DocumentChangeAction[], which contains
    // a lot of information about "what happened" with each change. If you want to
    // get the data and the id use the map operator.
    return this.products = this.productsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }

  // tslint:disable-next-line:typedef
  get(id) {
    this.productDoc = this.afs.doc<Product>('products/' + id);
    this.product = this.productDoc.valueChanges();
    return this.product;
    // return  this.afs.collection('products').doc(id).snapshotChanges();
  }

  // tslint:disable-next-line:typedef
  delete(productId) {
    this.afs.doc<Product>('products/' + productId).delete();
  }
}
