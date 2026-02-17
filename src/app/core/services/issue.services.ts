import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IssueService {
  private getBooksUrl = 'http://192.168.1.136:8000/api/books-search';
  private issueUrl = 'http://192.168.1.136:8000/api/issue-books';

  constructor(private http: HttpClient) {}

  // Common function headers banavva mate
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    });
  }

  getAllBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.getBooksUrl, { headers: this.getHeaders() });
  }


  saveIssueData(payload: any) {
    if (payload.ISSUE_ID) {
      return this.http.put(
        `${this.issueUrl}/${payload.ISSUE_ID}`,
        payload,
        { headers: this.getHeaders() }
      );
    } else {
      return this.http.post(
        this.issueUrl,
        payload,
        { headers: this.getHeaders() }
      );
    }
  }

  getIssuedRecords() {
    return this.http.get(this.issueUrl, { headers: this.getHeaders() });
  }

  deleteIssue(id: any) {
    return this.http.delete(`${this.issueUrl}/${id}`, { headers: this.getHeaders() });
  }

  getSingleIssue(id: any) {
    return this.http.get(`${this.issueUrl}/${id}`, { headers: this.getHeaders() });
  }
}