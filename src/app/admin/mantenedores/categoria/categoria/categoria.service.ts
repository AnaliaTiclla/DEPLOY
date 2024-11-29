
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoriaModelModel } from './categoria-model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private URL_API: string = '${API}/admin/categoria';
  private http = inject(HttpClient);

  getCategoria(): Observable<CategoriaModelModel[]> {
    return this.http.get<CategoriaModelModel[]>(`${this.URL_API}/listar`).pipe(
      map(res => res)
    );
  }

  saveCategoria(request: CategoriaModelModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/guardar`, request).pipe(
      map(resp => resp)
    );
  }

  updateCategoria(request: CategoriaModelModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/actualizar`, request).pipe(
      map(resp => resp)
    );
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.get<any>(`${this.URL_API}/inhabilitar/${id}`).pipe(
      map(resp => resp)
    );
  }

}
