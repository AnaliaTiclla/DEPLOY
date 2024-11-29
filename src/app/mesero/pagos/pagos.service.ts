import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PagoModel } from './pago-model';
import { PagoDetalleModel } from './pagoDetalle-model';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private apiUrl = 'https://apiperu.dev/api/dni';
  private token = 'INGRESAR_TOKEN_AQUI';
  private URL_API: string = '${API}/mozo';
  private http = inject(HttpClient);

  getPago(): Observable<PagoModel[]> {
    return this.http.get<PagoModel[]>(`${this.URL_API}/pago/listar`).pipe(
      map(res => res)
    );
  }

  savePago(request: PagoModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/pago/guardar`, request).pipe(
      map(resp => resp)
    );
  }

  updatePago(request: PagoModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/pago/actualizar`, request).pipe(
      map(resp => resp)
    );
  }

  saveDetallePago(request: PagoDetalleModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/detallePago/guardar`, request).pipe(
      map(resp => resp)
    );
  }

  updateDetallePago(request: PagoDetalleModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/detallePago/actualizar`, request).pipe(
      map(resp => resp)
    );
  }

  private data: any = null;

  setData(data: any): void {
    this.data = data;
  }

  getData(): any {
    const temp = this.data;
    this.data = null;
    return temp;
  }
}