import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Categories {
  private readonly http = inject(HttpClient);
  private readonly baseurl = environment.baseurl;



   getallcategory(): Observable<any> {
    return this.http.get(
      environment.baseurl + `/api/v1/categories`,  
    );
  }
   getspeccategory(id:string): Observable<any> {
    return this.http.get(
      environment.baseurl + `/api/v1/categories/${id}`,  
    );
  }


   getallsupcategory(): Observable<any> {
    return this.http.get(
      environment.baseurl + `/api/v1/subcategories`,  
    );
  }
   getspecsubcategory(id:string): Observable<any> {
    return this.http.get(
      environment.baseurl + `/api/v1/subcategories/${id}`,  
    );
  }
   getspecsubcategoryoncategory(id:string): Observable<any> {
    return this.http.get(
      environment.baseurl + `/api/v1/categories/${id}/subcategories`,  
    );
  }
   getallbrands(): Observable<any> {
    return this.http.get(
      environment.baseurl + `/api/v1/brands`,  
    );
  }


 getspecbrand(id:string): Observable<any> {
    return this.http.get(
      environment.baseurl + `/api/v1/brands/${id}`,  
    );
  }


}
