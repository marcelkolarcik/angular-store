import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

export interface Category {
  name: string;
}

export interface CategoryId extends Category {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  private categoriesCollection: AngularFirestoreCollection<Category>;
  categories: Observable<CategoryId[]>;

  constructor(private readonly afs: AngularFirestore) {


  }

  // tslint:disable-next-line:typedef
  getCategories() {


    this.categoriesCollection = this.afs.collection<Category>('categories', ref => ref.orderBy('name'));
    // .snapshotChanges() returns a DocumentChangeAction[], which contains
    // a lot of information about "what happened" with each change. If you want to
    // get the data and the id use the map operator.
    return this.categories = this.categoriesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Category;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }
}
