import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OrdenModel } from './distribucion-mesas/orden-model';
import { OrdenDetalleModel } from './distribucion-mesas/ordenDetalle-model';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private URL_API: string = '${API}/mozo';
  private http = inject(HttpClient);

  getOrdenAntiguo(mesaid: number): Observable<OrdenModel> {
    return this.http.get<OrdenModel>(`${this.URL_API}/orden/obtenerOrden/${mesaid}`).pipe(
      map(res => res)
    );
  }

  saveOrden(request: OrdenModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/orden/guardar`, request).pipe(
      map(resp => resp)
    );
  }

  updateOrden(request: OrdenModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/orden/actualizar`, request).pipe(
      map(resp => resp)
    );
  }

  getDetalleOrden(id: number): Observable<OrdenDetalleModel[]> {
    return this.http.get<OrdenDetalleModel[]>(`${this.URL_API}/detalleOrden/listar/${id}`).pipe(
      map(res => res)
    );
  }

  saveDetalleOrden(request: OrdenDetalleModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/detalleOrden/guardar`, request).pipe(
      map(resp => resp)
    );
  }

  updateDetalleOrden(request: OrdenDetalleModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/detalleOrden/actualizar`, request).pipe(
      map(resp => resp)
    );
  }
}