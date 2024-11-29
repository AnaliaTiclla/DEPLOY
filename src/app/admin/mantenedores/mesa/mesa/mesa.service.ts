

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MesaModelModel } from './mesa-model';

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private URL_API: string = '${API}/admin/mesa';
  private http = inject(HttpClient);

  getMesa(): Observable<MesaModelModel[]> {
    return this.http.get<MesaModelModel[]>(`${this.URL_API}/listar`).pipe(
      map(res => res)
    );
  }

  saveMesa(request: MesaModelModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/guardar`, request).pipe(
      map(resp => resp)
    );
  }

  updateMesa(request: MesaModelModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/actualizar`, request).pipe(
      map(resp => resp)
    );
  }

  condicionMesa(request: MesaModelModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/condicion`, request).pipe(
      map(resp => resp)
    );
  }

  deleteMesa(id: number): Observable<any> {
    return this.http.get<any>(`${this.URL_API}/inhabilitar/${id}`).pipe(
      map(resp => resp)
    );
  }

}
