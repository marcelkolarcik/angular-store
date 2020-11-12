import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {CategoryService} from "../../category.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {
  public categories$: Observable<{ name: string; id: string }[]>;
  // tslint:disable-next-line:no-input-rename
  @Input('category') category;

  constructor(private categoryService: CategoryService) {
    this.categories$ = categoryService.getCategories();
  }

  ngOnInit(): void {
  }


}
