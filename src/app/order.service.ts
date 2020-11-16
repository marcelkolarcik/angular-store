import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersCollection: AngularFirestoreCollection;
  private user;
  orders$: Observable<any>;
  orders;
  private myOrders: Subscription;
  private userId;

  constructor(private afs: AngularFirestore,
              private authService: AuthService) {
  }


  // tslint:disable-next-line:typedef
  getMyOrders() {

    this.ordersCollection = this.afs
      .collection('orders/',
          ref => ref.where('customerId', '==',  firebase.auth().currentUser.uid));


    this.orders = this.ordersCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        }))
      );
    return this.orders;
  }

   // tslint:disable-next-line:typedef
  getAdminOrders() {
    this.ordersCollection = this.afs
      .collection('orders/');

    this.orders = this.ordersCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        }))
      );
    return this.orders;
  }

}
