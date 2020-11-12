import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../product.service";
import {Observable, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../category.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private subscription2: Subscription;
  public products: any[];
  public filteredProducts: any[];
  private category: string;
  public categories$: Observable<{ name: string; id: string }[]>;

  constructor(private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute,
              private categoryService: CategoryService) {


    this.subscription = this.productService.getAll()
      .subscribe(products => {
          this.filteredProducts = this.products = products;

          this.subscription2 =  this.route.queryParams.subscribe(params => {
            this.category = params.category;
            this.filteredProducts = this.category ?
              this.products.filter(p =>
                p.category === this.category) :
              this.products;

          });
        }
      );

    this.categories$ = categoryService.getCategories();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
