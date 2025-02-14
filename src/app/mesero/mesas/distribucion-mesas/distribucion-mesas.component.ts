import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesaModelModel } from '../../../admin/mantenedores/mesa/mesa/mesa-model';
import { MesaService } from '../../../admin/mantenedores/mesa/mesa/mesa.service';
import { ProductoModel } from '../../../admin/mantenedores/producto/producto-model';
import { CategoriaModelModel } from '../../../admin/mantenedores/categoria/categoria/categoria-model';
import { SubcategoriaModel } from '../../../admin/mantenedores/subcategorias/subcategoria/subcategoria-model';
import { OrdenDetalleModel } from './ordenDetalle-model';
import { SubcategoriaService } from '../../../admin/mantenedores/subcategorias/subcategoria/subcategoria.service';
import { CategoriaService } from '../../../admin/mantenedores/categoria/categoria/categoria.service';
import { ProductoService } from '../../../admin/mantenedores/producto/producto.service';
import { OrdenService } from '../orden.service';
import { OrdenModel } from './orden-model';
import { LoginService } from '../../../login/login.service';
import { WSOrdenService } from '../../../cocina/wsorden.service';
import { RouterModule, Router } from '@angular/router';
import { PagosService } from '../../pagos/pagos.service';

@Component({
  selector: 'app-distribucion-mesas',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './distribucion-mesas.component.html',
  styleUrls: ['./distribucion-mesas.component.css']
})

export class DistribucionMesasComponent implements OnInit {
  private mesaService = inject(MesaService);
  private subcategoriaService = inject(SubcategoriaService);
  private categoriaService = inject(CategoriaService);
  private productoService = inject(ProductoService);   
  private ordenService = inject(OrdenService);
  private loginService = inject(LoginService);
  private wsOrdenService = inject(WSOrdenService);
  private pagosService = inject(PagosService);

  
  listMesa: MesaModelModel[] = [];
  listSubcategoria: SubcategoriaModel[] = [];
  listCategoria: CategoriaModelModel[] = [];
  listProductos: ProductoModel[] = [];
  mesaSeleccionada: MesaModelModel | null = null;
  subcategoriaActual: number = 1;
  ordenActual: OrdenDetalleModel[] = [];
  ordenModel: OrdenModel | null = null;
  ordenAntigua: OrdenModel | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.list();
    this.loadCategorias();
    this.loadSubcategorias();
    this.loadProductos();
  }

  list(): void {
    this.mesaService.getMesa().subscribe({
      next: (resp: any) => {
        if (resp?.data) {
          this.listMesa = resp.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar mesas:', error);
      }
    });
  }

  seleccionarMesa(mesa: MesaModelModel): void {
    this.mesaSeleccionada = mesa;
    if (mesa.condicion === 'Disponible') {
      mesa.condicion = 'Atendiendo';
      this.mesaService.condicionMesa(mesa).subscribe({
      next: (respuesta) => {
        console.log('Mesa actualizada exitosamente:', respuesta);
      },
      error: (error) => {
        console.error('Error al actualizar condición:', error);
      },
    });
    }
  }

  cerrarModal(): void {
    if (this.mesaSeleccionada != null && this.mesaSeleccionada.condicion == "Atendiendo") {
      this.mesaSeleccionada.condicion = 'Disponible';
      this.mesaService.condicionMesa(this.mesaSeleccionada).subscribe({
        next: (respuesta) => {
          console.log('Mesa actualizada exitosamente:', respuesta);
        },
        error: (error) => {
          console.error('Error al actualizar condición:', error);
        },
      });
    }
    this.mesaSeleccionada = null;
    this.ordenActual = [];
    this.ordenModel = null;
  }

  getProductosPorSubcategoria(): ProductoModel[] {
    return this.listProductos.filter(p => p.subcategoriaID === +this.subcategoriaActual);
  }

  agregarAOrden(producto: ProductoModel): void {
    const itemExistente = this.ordenActual.find(item => item.productoID === producto.productoID);
    
    if (itemExistente) {
      itemExistente.cantidad++;
      itemExistente.subTotal = itemExistente.cantidad * this.getPrecioProducto(producto.productoID);
    } else {
      const nuevoDetalle: OrdenDetalleModel = {
        productoID: producto.productoID,
        cantidad: 1,
        subTotal: this.getPrecioProducto(producto.productoID),
        ordenID: 0,
        comentario: '',
        condicion: 'Pendiente'
      };
      this.ordenActual.push(nuevoDetalle);
    }
  }

  getNombreProducto(productoId: number): string {
    const producto = this.listProductos.find(p => p.productoID === productoId);
    return producto?.nombre || '';
  }

  getPrecioProducto(productoId: number): number {
    const producto = this.listProductos.find(p => p.productoID === productoId);
    return producto?.precio || 0;
  }

  eliminarItem(item: OrdenDetalleModel): void {
    const index = this.ordenActual.findIndex(i => i.productoID === item.productoID);
    if (index !== -1) {
      if (this.ordenActual[index].cantidad > 1) {
        this.ordenActual[index].cantidad--;
        this.ordenActual[index].subTotal = 
          this.ordenActual[index].cantidad * this.getPrecioProducto(this.ordenActual[index].productoID);
      } else {
        this.ordenActual.splice(index, 1);
      }
    }
  }

  calcularTotal(): number {
    return this.ordenActual.reduce((total, item) => total + item.subTotal, 0);
  }

  agregarComentario(item: OrdenDetalleModel, comentario: string): void {
    const detalleItem = this.ordenActual.find(i => i.productoID === item.productoID);
    if (detalleItem) {
      detalleItem.comentario = comentario;
      
    }
  }

  saveOrden(orden: OrdenModel) {
    this.ordenService.saveOrden(orden).subscribe({
      next: (resp: any) => {
        if (resp && resp.status === 'success') {
          this.ordenModel = resp.data;
          const ordenID = resp.data.ordenID;
          
          const detallesConID = this.ordenActual.map(detalle => {
            return { ...detalle, ordenID};
          });
          this.guardarDetalles(detallesConID);
        }
      },
      error: (error) => {
        console.error('Error al guardar la orden:', error);
      }
    });
  }
  
  guardarDetalles(detalles: OrdenDetalleModel[]): void {
    detalles.forEach(detalle => {
      this.ordenService.saveDetalleOrden(detalle).subscribe({
        next: (resp: any) => {
          if (resp && resp.status === 'success') {
            this.wsOrdenService.sendOrden(resp.data);
          }
        },
        error: (error) => {
          console.error('Error al guardar detalle de orden:', error);
        }
      });
    });
  }
  

enviarOrden(): void {
  if (this.mesaSeleccionada && this.ordenActual.length > 0) {
    const empleadoID = this.loginService.obtenerEmpleadoID(); 

    if (!empleadoID) {
      console.error('Empleado no autenticado');
      alert('No se pudo enviar la orden. Verifique la sesión del empleado.');
      return;
    }
    
    this.ordenModel = {
      mesaID: this.mesaSeleccionada.mesaID,
      fecha: new Date(),
      condicion: "Atendiendo",
      montoTotal: this.calcularTotal(),
      empleadoID: empleadoID
    };

    this.saveOrden(this.ordenModel);
    this.mesaSeleccionada.condicion = 'Ocupada';
    this.mesaService.condicionMesa(this.mesaSeleccionada).subscribe({
      next: (respuesta) => {
        console.log('Mesa actualizada exitosamente:', respuesta);
      },
      error: (error) => {
        console.error('Error al actualizar condición:', error);
      },
    });
    alert('Pedido enviado a cocina');
  } else {
    alert('Debe seleccionar una mesa y agregar productos a la orden antes de enviarla.');
  }
}

agregarProductos(): void {
  if (!this.mesaSeleccionada?.mesaID) {
    return;
  }
  this.ordenService.getOrdenAntiguo(this.mesaSeleccionada.mesaID).subscribe({
    next: (resp: any) => {
      if (resp && resp.status === 'success' && resp.data) {
        this.ordenModel = resp.data;
        if (this.ordenModel) {
          const nuevoMontoTotal = (this.ordenModel.montoTotal || 0) + this.calcularTotal();
          this.ordenModel.montoTotal = parseFloat(nuevoMontoTotal.toFixed(2));
          this.ordenService.updateOrden(this.ordenModel).subscribe({
            next: () => {
              const ordenID = resp.data.ordenID;
              const detallesConID = this.ordenActual.map(detalle => ({
                ...detalle,
                ordenID
              }));
              this.guardarDetalles(detallesConID);
              alert('Se agregaron más productos a la orden.');
            },
            error: (error) => {
              console.error('Error al actualizar la orden:', error);
            }
          });
        } else {
          console.error('Error: ordenModel no está inicializado.');
        }
      } else {
        console.warn('No se encontró una orden válida para la mesa seleccionada.');
      }
    },
    error: (error) => {
      console.error('Error al obtener la orden antigua:', error);
    }
  });
}

mostrarPago(): void {
  if (confirm('¿Desea generar el comprobante de pago?')) {
    if (this.mesaSeleccionada && this.ordenModel) {
      const stateData = { 
        orden: this.ordenModel
      };  
      this.pagosService.setData(stateData);
      this.router.navigate(['/mesero/pagos']);
      
      this.mesaSeleccionada.condicion = 'Disponible';
      this.mesaService.condicionMesa(this.mesaSeleccionada).subscribe({
      next: (respuesta) => {
        console.log('Mesa actualizada exitosamente:', respuesta);
      },
      error: (error) => {
        console.error('Error al actualizar condición:', error);
      },
    });
    } else {
      alert('No hay una orden asociada para realizar el pago.');
    }
  }
}

  loadSubcategorias(): void {
    this.subcategoriaService.getSubcategoria().subscribe({
      next: (resp: any) => {
        if (resp?.data) {
          this.listSubcategoria = resp.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar subcategorías:', error);
      }
    });
  }

  getSubcategoryName(subcategoriaID: number): string {
    return this.listSubcategoria.find(sub => sub.subCategoriaId === subcategoriaID)?.nombre || '';
  }

  loadCategorias(): void {
    this.categoriaService.getCategoria().subscribe({
      next: (resp: any) => {
        if (resp?.data) {
          this.listCategoria = resp.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  getCategoryName(categoriaID: number): string {
    return this.listCategoria.find(cat => cat.categoriaID === categoriaID)?.nombre || '';
  }

  loadProductos(): void {
    this.productoService.getProducto().subscribe({
      next: (resp: any) => {
        if (resp?.data) {
          this.listProductos = resp.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }

  cargarSubcategorias() {
    this.subcategoriaService.getSubcategoria().subscribe({
      next: (resp: any) => {
        if (resp && resp.data) {
          this.listSubcategoria = resp.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }

  obtenerSubcategoryName(subcategoriaID: number): string {
    const subcategory = this.listSubcategoria.find(sub => sub.subCategoriaId === subcategoriaID);
    return subcategory?.nombre || 'Sin subcategoría';
  }
}