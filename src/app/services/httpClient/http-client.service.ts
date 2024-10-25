import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../app.component';

@Injectable({
  providedIn: 'root'
})
export class HttpClientServiceService {

  constructor(private httpClient: HttpClient, @Inject(BASE_URL) private baseUrl: string) { }

  private url(requestParameters: Partial<RequestParameters>): string {
    return `${requestParameters.baseUrl ? requestParameters.baseUrl : 
      this.baseUrl}/${requestParameters.controller}${requestParameters.action ? `/${requestParameters.action}` : ''}`;
}

get<T>(requestParameters: Partial<RequestParameters>, id?: string){
  let url: string = "";
  if(requestParameters.fullEndpoint){
    url = requestParameters.fullEndpoint;
  }
  else{
    url = this.url(requestParameters);
    let queryParams: string[] = [];
    
    if(id){
      queryParams.push(`id=${encodeURIComponent(id)}`); 
    }
    if(requestParameters.querystrings){
      queryParams.push(requestParameters.querystrings);
    }
    let queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    url = `${url}${queryString}`;
  }
  url = url.replace(/\s/g, '');
  return this.httpClient.get<T>(url, {headers: requestParameters.headers});
}

  post<T>(requestParameters: Partial<RequestParameters>, body: Partial<T>): Observable<T>{
    let url : string = "";
    if( requestParameters.fullEndpoint){
      url = requestParameters.fullEndpoint
    }
    else{
      url = `${this.url(requestParameters)}${requestParameters.querystrings ? `?${requestParameters.querystrings}` : ""}` 
    }
    url = url.replace(/\s/g, '');
    return this.httpClient.post<T>(url, body, {headers: requestParameters.headers}) ; 

  }

  put<T>(requestParameters: Partial<RequestParameters>, body: Partial<T>): Observable<T>{
    let url : string = "";
    if( requestParameters.fullEndpoint){
      url = requestParameters.fullEndpoint
    }
    else{
      url = `${this.url(requestParameters)}${requestParameters.querystrings ? `?${requestParameters.querystrings}` : ""}`
    }
    url = url.replace(/\s/g, '');
    return this.httpClient.put<T>(url ,body, {headers: requestParameters.headers})
  }

  delete<T>(requestParameters: Partial<RequestParameters>, id?: string): Observable<T>{
    let url: string = "";
    if( requestParameters.fullEndpoint){
      url = requestParameters.fullEndpoint
    }
    else{
      url = `${this.url(requestParameters)}/ ${id}${requestParameters.querystrings ? `?${requestParameters.querystrings}` : ""}` ;
    }
    url = url.replace(/\s/g, '');
    return this.httpClient.delete<T>(url,{headers: requestParameters.headers});
  }
}

export class RequestParameters {
  controller?: string;
  action?: string;
  querystrings? : string;
  baseUrl?: string;
  headers?: HttpHeaders;
  fullEndpoint?: string;
}
