import { Client, StompConfig } from '@stomp/stompjs';
import { OrdenDetalleModel } from '../mesero/mesas/distribucion-mesas/ordenDetalle-model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WSOrdenService {
  private client!: Client; 

  private ordenesSubject = new BehaviorSubject<OrdenDetalleModel[]>([]);
  ordenes$ = this.ordenesSubject.asObservable();

  constructor() {
    this.initWebSocketConnection();
  }

  private initWebSocketConnection() {
    const stompConfig: StompConfig = {
      brokerURL: 'ws://back-v10.onrender.com/WSorden/websocket',
      
      webSocketFactory: () => {
        return new WebSocket('ws://back-v10.onrender.com/WSorden/websocket');
      },
      
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      debug: (str) => {
        console.log(new Date(), str);
      },
      
      onConnect: () => {
        this.client.subscribe('/escuchar/canal1', (message) => {
          const orden = JSON.parse(message.body);
          const currentOrdenes = this.ordenesSubject.value;
          this.ordenesSubject.next([...currentOrdenes, orden]);
        });
      },
      
      onStompError: (frame) => {
        console.error('Error: ' + frame.headers['message']);
        console.error('Detalle adicional: ' + frame.body);
      },
      
      onDisconnect: (frame) => {
        console.log('Desconectado:', frame);
      }
    };

    this.client = new Client(stompConfig);
    
    this.client.activate();
  }

  sendOrden(orden: OrdenDetalleModel) {
    if (!this.client) {
      console.error('WebSocket cliente no inicializado');
      return;
    }

    if (!this.client.connected) {
      console.warn('WebSocket no conectado.');
      this.client.activate();
      
      setTimeout(() => {
        this.sendOrdenInternal(orden);
      }, 1000);
      return;
    }

    this.sendOrdenInternal(orden);
  }

  private sendOrdenInternal(orden: OrdenDetalleModel) {
    try {
      this.client.publish({
        destination: '/enviar/orden1',
        body: JSON.stringify(orden)
      });
    } catch (error) {
      console.error('Fallo al enviar una orden', error);
    }
  }
}