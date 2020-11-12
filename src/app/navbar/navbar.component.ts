import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import firebase from "firebase";
import {Subscription} from "rxjs";
import {AngularFirestore} from "@angular/fire/firestore";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  links = [

    {title: 'Shopping Cart', fragment: 'shopping-cart'},
    {title: 'Products', fragment: ''},


  ];
  isAdmin: boolean;
  subscription: Subscription;

  constructor(public auth: AuthService, private afs: AngularFirestore) { }

  logout(): void {
    this.auth.logout();
  }

  ngOnInit(): void {
    //localStorage.removeItem('cartId');
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
  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }

}
