import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {Subscription} from "rxjs";
import {AngularFirestore} from "@angular/fire/firestore";
import firebase from "firebase";
import {OrderService} from "../order.service";

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders$;
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {

     this.orders$ = this.orderService.getMyOrders();


  }

}
