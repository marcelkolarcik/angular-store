import {Injectable} from '@angular/core';
import {CanActivate} from "@angular/router";
import {AuthService} from "./auth.service";
import {map} from "rxjs/operators";
import {UserService} from "./user.service";


@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private auth: AuthService, private userService: UserService) {
  }


  // tslint:disable-next-line:typedef
  // @ts-ignore
  // tslint:disable-next-line:typedef
  canActivate() {
    return this.auth.user$.pipe(map(user => {

      return this.userService.isAdmin(user.uid);


    }));


  }
}
