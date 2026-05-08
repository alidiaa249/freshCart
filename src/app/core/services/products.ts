import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Products {
  private readonly http = inject(HttpClient);
  private readonly baseurl = environment.baseurl;

  getallproducts(params?: HttpParams): Observable<any> {
    return this.http.get(environment.baseurl + `/api/v1/products`, { params });
  }
  getspecproduct(id: string): Observable<any> {
    return this.http.get(environment.baseurl + `/api/v1/products/${id}`);
  }

  getProductsByCategory(id: string): Observable<any> {
    return this.http.get(`${environment.baseurl}/api/v1/products?category[in]=${id}`);
  }

  getAllBrands(): Observable<any> {
    return this.http.get(`${environment.baseurl}/api/v1/brands`);
  }

  getProductsByBrand(id: string): Observable<any> {
    return this.http.get(`${environment.baseurl}/api/v1/products?brand[in]=${id}`);
  }

  getBrandById(id: string): Observable<any> {
    return this.http.get(`${environment.baseurl}/api/v1/brands/${id}`);
  }

  searchProducts(query: string, params?: HttpParams): Observable<any> {
    let httpParams = params || new HttpParams();
    httpParams = httpParams.append('keyword', query);
    return this.http.get(`${environment.baseurl}/api/v1/products`, { params: httpParams });
  }

  getProductsByFilters(params: HttpParams): Observable<any> {
    return this.http.get(`${environment.baseurl}/api/v1/products`, { params });
  }



  addtowisthlist(data:any){
    return this.http.post(`${environment.baseurl}/api/v1/wishlist`, data , {
      headers:{
         token: localStorage.getItem("token") || ""
      } 
     
    });
  }
  deletewisthlist(productid:any){
    return this.http.post(`${environment.baseurl}/api/v1/wishlist/${productid}`,  {
      headers:{
         token: localStorage.getItem("token") || ""
      } 
     
    });
  }
   getwithlist(): Observable<any> {
    return this.http.get(`${environment.baseurl}/api/v1/wishlist`, {
      headers:{
         token: localStorage.getItem("token") || ""
      }
    });
  }

}
