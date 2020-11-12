import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Observable, Subscription} from "rxjs";
import firebase from "firebase";
import Item = firebase.analytics.Item;


@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {


  constructor(private  afs: AngularFirestore) {

  }

  userAdmin: boolean;
  currentUser: firebase.analytics.Item;
  subscription: Subscription;
  private itemDoc: AngularFirestoreDocument<Item>;
  item: Observable<Item>;


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  update(luser: Observable<any>): void {

    this.subscription = luser.subscribe(user => {
      if (user) {
        this.afs.collection("users")
          .doc(user.uid)
          .set({name: user.displayName, email: user.email}, {merge: true});

      }

    });

  }

  // tslint:disable-next-line:typedef
  get(uid: string) {
    // tslint:disable-next-line:prefer-const
    let userRef = firebase.firestore().collection("users").doc(uid);


    // tslint:disable-next-line:prefer-const
    let user;
    // tslint:disable-next-line:only-arrow-functions typedef
    userRef.get().then((doc) => {
      if (doc.exists) {


        user = doc.data();

        console.log('userRef', user);
        return user;


      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }


    }).catch((error) => {
      console.log("Error getting document:", error);
    });

  }

  // tslint:disable-next-line:typedef
  isAdmin(uid: string) {
    this.itemDoc = this.afs.doc<Item>('users/' + uid);
    this.item = this.itemDoc.valueChanges();


    this.item.subscribe(user => {

      // console.log('isAdmin', this.userAdmin);
      this.userAdmin = user['isAdmin'];

    });
    /*todo fix this admin guard*/

    return true;
  }



}
