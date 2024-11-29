import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = '${API}/admin/report'; 

  constructor(private http: HttpClient) { }

  generateProductReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/productos`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

  generateEmployeeReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/empleados`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

  openPdfInNewWindow(blob: Blob) {
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  }
}