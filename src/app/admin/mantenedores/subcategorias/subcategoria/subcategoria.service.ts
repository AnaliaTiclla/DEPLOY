import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubcategoriaModel } from './subcategoria-model';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {
  private URL_API: string = '${API}/admin/subcategoria';
  private http = inject(HttpClient);

  getSubcategoria(): Observable<SubcategoriaModel[]> {
    return this.http.get<SubcategoriaModel[]>(`${this.URL_API}/listar`).pipe(
      map(res => res)
    );
  }

  saveSubcategoria(request: SubcategoriaModel): Observable<any> {
    console.log('Enviando datos al servidor:', request);
    return this.http.post<any>(`${this.URL_API}/guardar`, request).pipe(
      map(response => {
        console.log('Respuesta del servidor:', response);
        return response;
      })
    );
  }

  updateSubcategoria(request: SubcategoriaModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/actualizar`, request).pipe(
      map(resp => resp)
    );
  }

  deleteSubcategoria(id: number): Observable<any> {
    console.log(`Intentando eliminar subcategoría con ID: ${id}`);
    return this.http.get<any>(`${this.URL_API}/inhabilitar/${id}`);
  }
} 