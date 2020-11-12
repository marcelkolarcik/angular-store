import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import firebase from "firebase";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "./user.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User>;


  constructor(private auth: AngularFireAuth,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
  ) {

    this.user$ = auth.authState;
  }

  login(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

    localStorage.setItem('returnUrl', returnUrl);

    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(
        () => {
          /* update user's name and email*/
          this.userService.update(this.user$);
          // console.log(this.userService.get('vcwsr2gVnOZlqVqodReiNF05U9w2'));
          const redirectUrl = localStorage.getItem('returnUrl');
          localStorage.removeItem('returnUrl');
          this.router.navigateByUrl(redirectUrl);

        }
      );

  }

  logout(): void {
    sessionStorage.clear();
    this.auth.signOut()
      .then(() => {
        this.router.navigateByUrl('/');
      });
  }

  // tslint:disable-next-line:typedef
  appUser$() {
    return this.user$.subscribe(user => {
      console.log('auth ', user.uid, this.userService.isAdmin(user.uid));
      return  this.userService.isAdmin(user.uid);


    });
  }


}
