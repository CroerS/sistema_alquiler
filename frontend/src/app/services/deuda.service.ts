import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Deuda } from '../interfaces/deuda';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/deudas/'
  }

  getList(): Observable<Deuda[]> {
    return this.http.get<Deuda[]>(`${this.myAppUrl}${this.myApiUrl}`)
  }

  save(deuda: Deuda): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}`, deuda)
  }

  update(id:number, deuda:any): Observable<any>{
    return this.http.put(this.myAppUrl + this.myApiUrl +'/'+ id, deuda); 
  }

  delete(id: number): Observable<any>{
    return this.http.delete(this.myAppUrl + this.myApiUrl +'/'+ id)
  }

}