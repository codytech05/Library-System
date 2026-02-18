import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = 'http://192.168.1.136:8000/api/books';

  constructor(private http: HttpClient) {}

  // Token melvva mate nu common function
  private getHeaders() {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  } 

  getBooks(page: number = 1, perPage: number = 10) {
    return this.http.get(`${this.apiUrl}?page=${page}&per_page=${perPage}`, { headers: this.getHeaders() });
  }

  addBook(data: any) {
    return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
  }

  updateBook(id: number, data: any) {
 
    if (data instanceof FormData) {
      data.append('_method', 'PUT'); 
      return this.http.post(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
    }
    
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  deleteBook(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}