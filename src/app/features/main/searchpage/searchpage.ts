import {Component,signal,computed,inject,OnInit,OnDestroy,ChangeDetectionStrategy,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Products } from '../../../core/services/products';
import { Categories } from '../../../core/services/categories';
import { Category, Brand } from '../../../core/models/products';
import { Productsinterface } from '../../../core/models/products';
import { Featureproducts } from '../../featureproducts/featureproducts';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-searchpage',
  imports: [Featureproducts, FormsModule],
  templateUrl: './searchpage.html',
  styleUrl: './searchpage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Searchpage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(Products);
  private readonly categoriesService = inject(Categories);

  readonly products = signal<Productsinterface[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly brands = signal<Brand[]>([]);
  readonly loading = signal<boolean>(false);
  readonly viewMode = signal<'grid' | 'list'>('grid');
  searchQuery = '';
  selectedCategories: string[] = [];
  selectedBrands: string[] = [];
  selectedSort = '';
  minPrice: string = '';
  maxPrice: string = '';

  private readonly search$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  readonly sortOptions: { value: string; label: string }[] = [
    { value: '', label: 'Relevance' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-ratingsAverage', label: 'Rating: High to Low' },
    { value: 'title', label: 'Name: A to Z' },
    { value: '-title', label: 'Name: Z to A' },
  ];

  readonly quickPriceFilters: { label: string; min: string; max: string }[] = [
    { label: 'Under 500', min: '', max: '500' },
    { label: 'Under 1K', min: '', max: '1000' },
    { label: 'Under 5K', min: '', max: '5000' },
    { label: 'Under 10K', min: '', max: '10000' },
  ];

  readonly mobileFilterOpen = signal(false);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalResults = signal(0);
  readonly pageSize = 12;

  readonly paginatedProducts = computed(() => this.products());

  toggleMobileFilter(): void {
    this.mobileFilterOpen.update(v => !v);
  }

  closeMobileFilter(): void {
    this.mobileFilterOpen.set(false);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.currentPage.set(page);
    this.updateUrl();
  }

  ngOnInit(): void {
    this.search$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe((q) => {
      this.searchQuery = q;
      this.updateUrl();
    });

    this.loadCategories();
    this.loadBrands();

    this.route.queryParamMap.subscribe((params) => {
      const q = params.get('q') || '';
      const categories = params.getAll('category');
      const brands = params.getAll('brand');
      const sort = params.get('sort') || '';
      const page = Number(params.get('page')) || 1;
      this.searchQuery = q;
      this.selectedCategories = categories;
      this.selectedBrands = brands;
      this.selectedSort = sort;
      this.minPrice = params.get('price[gte]') || '';
      this.maxPrice = params.get('price[lte]') || '';
      this.currentPage.set(page);
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(q: string): void {
    this.searchQuery = q;
    this.search$.next(q);
  }

  onCategoryToggle(categoryId: string): void {
    const current = this.selectedCategories;
    const updated = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];
    this.selectedCategories = updated;
    this.updateUrl();
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  onBrandToggle(brandId: string): void {
    const current = this.selectedBrands;
    const updated = current.includes(brandId)
      ? current.filter((id) => id !== brandId)
      : [...current, brandId];
    this.selectedBrands = updated;
    this.updateUrl();
  }

  isBrandSelected(brandId: string): boolean {
    return this.selectedBrands.includes(brandId);
  }

  onSortChange(sortValue: string): void {
    this.selectedSort = sortValue;
    this.updateUrl();
  }

  onPriceFilter(): void {
    this.updateUrl();
  }

  quickPriceFilter(min: string, max: string): void {
    this.minPrice = min;
    this.maxPrice = max;
    this.updateUrl();
  }

  removeCategory(categoryId: string): void {
    this.selectedCategories = this.selectedCategories.filter((id) => id !== categoryId);
    this.updateUrl();
  }

  removeBrand(brandId: string): void {
    this.selectedBrands = this.selectedBrands.filter((id) => id !== brandId);
    this.updateUrl();
  }

  removeSearchQuery(): void {
    this.searchQuery = '';
    this.updateUrl();
  }

  removeSort(): void {
    this.selectedSort = '';
    this.updateUrl();
  }

  removePriceRange(): void {
    this.minPrice = '';
    this.maxPrice = '';
    this.updateUrl();
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.selectedCategories = [];
    this.selectedBrands = [];
    this.selectedSort = '';
    this.minPrice = '';
    this.maxPrice = '';
    this.router.navigate(['/search']);
  }

  getCategoryName(categoryId: string): string {
    return this.categories().find((c) => c._id === categoryId)?.name || categoryId;
  }

  getBrandName(brandId: string): string {
    return this.brands().find((b) => b._id === brandId)?.name || brandId;
  }

  getSortLabel(): string {
    return this.sortOptions.find((o) => o.value === this.selectedSort)?.label || '';
  }

  hasActiveFilters(): boolean {
    return !!(
      this.searchQuery ||
      this.selectedCategories.length ||
      this.selectedBrands.length ||
      this.selectedSort ||
      this.minPrice ||
      this.maxPrice
    );
  }

  getPriceLabel(): string {
    if (this.minPrice && this.maxPrice) {
      return `${this.minPrice} - ${this.maxPrice} EGP`;
    }
    if (this.minPrice) return `From ${this.minPrice} EGP`;
    if (this.maxPrice) return `Up to ${this.maxPrice} EGP`;
    return '';
  }

  private updateUrl(): void {
    const params = new URLSearchParams();
    if (this.searchQuery) {
      params.set('q', this.searchQuery);
    }
    this.selectedCategories.forEach((c) => params.append('category', c));
    this.selectedBrands.forEach((b) => params.append('brand', b));
    if (this.selectedSort) {
      params.set('sort', this.selectedSort);
    }
    if (this.minPrice) {
      params.set('price[gte]', this.minPrice);
    }
    if (this.maxPrice) {
      params.set('price[lte]', this.maxPrice);
    }
    if (this.currentPage() > 1) {
      params.set('page', this.currentPage().toString());
    }
    const queryString = params.toString();
    const url = queryString ? '/search?' + queryString : '/search';
    this.router.navigateByUrl(url, { replaceUrl: true });
  }

  private loadCategories(): void {
    this.categoriesService.getallcategory().subscribe({
      next: (response) => this.categories.set(response.data || []),
    });
  }

  private loadBrands(): void {
    this.productsService.getAllBrands().subscribe({
      next: (response) => this.brands.set(response.data || []),
    });
  }

  private loadProducts(): void {
    this.loading.set(true);
    const q = this.searchQuery;
    const categories = this.selectedCategories;
    const brands = this.selectedBrands;
    const sort = this.selectedSort;
    const min = this.minPrice;
    const max = this.maxPrice;
    const page = this.currentPage();

    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('limit', this.pageSize.toString());

    if (categories.length) {
      categories.forEach((c) => (params = params.append('category[in]', c)));
    }
    if (brands.length) {
      brands.forEach((b) => (params = params.append('brand[in]', b)));
    }
    if (sort) {
      params = params.append('sort', sort);
    }
    if (min) {
      params = params.append('price[gte]', min);
    }
    if (max) {
      params = params.append('price[lte]', max);
    }

    const handleResponse = (response: any) => {
      this.products.set(response.data || []);
      this.totalResults.set(response.results || response.data?.length || 0);
      this.totalPages.set(response.metadata?.numberOfPages || 1);
      this.loading.set(false);
    };

    const handleError = () => this.loading.set(false);

    if (q) {
      this.productsService.searchProducts(q, params).subscribe({
        next: handleResponse,
        error: handleError,
      });
    } else {
      this.productsService.getProductsByFilters(params).subscribe({
        next: handleResponse,
        error: handleError,
      });
    }
  }

  private sortProducts(items: Productsinterface[], sort: string): Productsinterface[] {
    switch (sort) {
      case 'price':
        return [...items].sort((a, b) => a.price - b.price);
      case '-price':
        return [...items].sort((a, b) => b.price - a.price);
      case 'title':
        return [...items].sort((a, b) => a.title.localeCompare(b.title));
      case '-title':
        return [...items].sort((a, b) => b.title.localeCompare(a.title));
      case '-ratingsAverage':
        return [...items].sort((a, b) => b.ratingsAverage - a.ratingsAverage);
      default:
        return items;
    }
  }
}