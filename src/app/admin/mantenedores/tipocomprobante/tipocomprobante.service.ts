import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TipocomprobanteModel } from './tipocomprobante-model';

@Injectable({
  providedIn: 'root'
})
export class TipocomprobanteService {
  private URL_API: string = '${API}/admin/tipocomprobante';
  private http = inject(HttpClient);

  getTipocomprobante(): Observable<TipocomprobanteModel[]> {
    return this.http.get<TipocomprobanteModel[]>(`${this.URL_API}/listar`).pipe(
      map(res => res)
    );
  }

  saveTipocomprobante(request: TipocomprobanteModel): Observable<any> {
    console.log('Enviando datos al servidor:', request);
    return this.http.post<any>(`${this.URL_API}/guardar`, request).pipe(
      map(response => {
        return response;
      })
    );
  }

  updateTipocomprobante(request: TipocomprobanteModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/actualizar`, request).pipe(
      map(resp => resp)
    );
  }

  deleteTipocomprobante(id: number): Observable<any> {
    return this.http.get<any>(`${this.URL_API}/inhabilitar/${id}`);
  }
} 