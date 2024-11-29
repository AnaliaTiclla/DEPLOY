

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioModelModel } from './usuario-model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private URL_API: string = '${API}/admin/usuario';
  private http = inject(HttpClient);

  getUsuario(): Observable<UsuarioModelModel[]> {
    return this.http.get<UsuarioModelModel[]>(`${this.URL_API}/listar`).pipe(
      map(res => res)
    );
  }

  saveUsuario(request: UsuarioModelModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/guardar`, request).pipe(
      map(resp => resp)
    );
  }
}
