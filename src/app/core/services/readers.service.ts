import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReadersService {
  private apiUrl = 'http://your-api-url/api/readers'; 

  constructor(private http: HttpClient) {}

  getAll(page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
    return this.http.get(this.apiUrl, { params });
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}