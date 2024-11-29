import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ProductoModel } from './producto-model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private URL_API: string = '${API}/admin/producto';
  private http = inject(HttpClient);

  getProducto(): Observable<ProductoModel[]> {
    return this.http.get<ProductoModel[]>(`${this.URL_API}/listar`).pipe(
      map(res => res)
    );
  }

  saveProducto(request: ProductoModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/guardar`, request).pipe(
      map(resp => resp)
    );
  }

  updateProducto(request: ProductoModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/actualizar`, request).pipe(
      map(resp => resp)
    );
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.get<any>(`${this.URL_API}/inhabilitar/${id}`).pipe(
      map(resp => resp)
    );
  }
}