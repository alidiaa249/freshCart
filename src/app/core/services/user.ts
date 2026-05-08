import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly _http = inject(HttpClient);
    signup(data:any):Observable<any>{
	return this._http.post(environment.baseurl+"/api/v1/auth/signup" , data)
  }
    signin(data:any):Observable<any>{
	return this._http.post(environment.baseurl+"/api/v1/auth/signin" , data)
  }
    forgetpass(data:any):Observable<any>{
	return this._http.post(environment.baseurl+"/api/v1/auth/forgotPasswords" , data)
  }
    verifycode(data:any):Observable<any>{
	return this._http.post(environment.baseurl+"/api/v1/auth/verifyResetCode" , data)
  }
    resetpass(data:any):Observable<any>{
	return this._http.put(environment.baseurl+"/api/v1/auth/resetPassword" , data )
  }
    updatepass(data:any):Observable<any>{
	return this._http.put(environment.baseurl+"/api/v1/users/updateMe/" , data , {
	  headers:{
	    token: localStorage.getItem("token") || ""
	  }
	})
  }

       getuseraddress(): Observable<any> {
	    return this._http.get(environment.baseurl + '/api/v1/addresses', {
	      headers: {
	        token: localStorage.getItem('token') || '',
	      },
	    });
	  }

  addAddress(data: any): Observable<any> {
	    return this._http.post(environment.baseurl + '/api/v1/addresses', data, {
	      headers: {
	        token: localStorage.getItem('token') || '',
	      },
	    });
	  }
	  deleteaddreses(id: any): Observable<any> {
	    return this._http.delete(environment.baseurl + `/api/v1/addresses/${id}`,  {
	      headers: {
	        token: localStorage.getItem('token') || '',
	      },
	    });
	  }

	  getspecAddresess(id: any): Observable<any> {
	    return this._http.get(environment.baseurl + `/api/v1/addresses/${id}`,  {
	      headers: {
	        token: localStorage.getItem('token') || '',
	      },
	    });
	  }


	  updateuserdata(data:any):Observable<any>{
	return this._http.put(environment.baseurl+"/api/v1/users/updateMe/" , data , {
	  headers:{
	    token: localStorage.getItem("token") || ""
	  }
	})
	  }


	    verifytoken():Observable<any>{
	const token = typeof window !== 'undefined' ? localStorage.getItem("token") || "" : "";
	return this._http.get(environment.baseurl+"/api/v1/auth/verifyToken" ,  {
	  headers:{
	    token: token
	  }
	})
	  }
	    getuserorders(userid:string):Observable<any>{
	return this._http.get(environment.baseurl+`/api/v1/orders/user/${userid}` )
	  }



}