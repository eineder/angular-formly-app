import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiUrl = 'api';

  constructor(private http: HttpClient) {}

  getTypeNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/typeNames`);
  }

  getSchema(typeName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schemas/?typeName=${typeName}`);
  }
}
