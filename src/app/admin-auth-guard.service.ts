import {Injectable} from '@angular/core';
import {CanActivate} from "@angular/router";
import {UserService} from "./user.service";
import firebase from "firebase";


@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor( private userService: UserService) {
  }


  // tslint:disable-next-line:typedef
 async canActivate() {
    return await this.userService.isAdmin();
  }
}
