
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmpleadoModelModel } from './empleado-model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private URL_API: string = '${API}/admin/empleado';
  private http = inject(HttpClient);

  getEmpleado(): Observable<EmpleadoModelModel[]> {
    return this.http.get<EmpleadoModelModel[]>(`${this.URL_API}/listar`).pipe(
      map(res => res)
    );
  }

  saveEmpleado(request: EmpleadoModelModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/guardar`, request).pipe(
      map(resp => resp)
    );
  }

  updateEmpleado(request: EmpleadoModelModel): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/actualizar`, request).pipe(
      map(resp => resp)
    );
  }

  deleteEmpleado(id: number): Observable<any> {
    return this.http.get<any>(`${this.URL_API}/inhabilitar/${id}`).pipe(
      map(resp => resp)
    );
  }


}
