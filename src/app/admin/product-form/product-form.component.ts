import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "../../category.service";
import {ProductService} from "../../product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  categories$;
  product = {
    title: '',
    price: 0,
    imageUrl: '',
    category: ''
  };
  subscription: Subscription;
  id;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService) {

    this.categories$ = categoryService.getCategories();

    this.id = this.route.snapshot.paramMap.get('id');


    if (!this.id) {
      return;
    } else {
      this.subscription = this.productService.get(this.id).subscribe(p => {
        this.product = p;

      });
    }

  }

  // tslint:disable-next-line:typedef
  save(product) {

    if (this.id) {
      this.productService.update(this.id, product);
    } else {
      this.productService.create(product);
    }

    this.router.navigate(['/admin/products']);
  }

  // tslint:disable-next-line:typedef
  delete() {
    if (confirm('Are you sure?')) {
      this.productService.delete(this.id);
      this.router.navigate(['/admin/products']);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.id) {
      this.subscription.unsubscribe();
    }

  }

}
