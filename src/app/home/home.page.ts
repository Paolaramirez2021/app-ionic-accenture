import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, 
  IonLabel, IonCheckbox, IonButton, IonIcon, IonItemSliding, 
  IonItemOptions, IonItemOption, IonSelect, IonSelectOption, IonInput, IonCard, IonCardContent, IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline, starOutline, folderOpenOutline, createOutline } from 'ionicons/icons';
import { TodoService, Tarea, Categoria } from '../services/todo';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Importaciones de Firebase para consumir el Feature Flag
import { RemoteConfig, getValue, fetchAndActivate } from '@angular/fire/remote-config';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, 
    IonList, IonItem, IonLabel, IonCheckbox, IonButton, IonIcon, IonItemSliding, 
    IonItemOptions, IonItemOption, IonSelect, IonSelectOption, IonInput, IonCard, IonCardContent, IonBadge
  ]
})
export class HomePage implements OnInit {
  tareasFiltradas$: Observable<Tarea[]> | undefined;
  categorias$: Observable<Categoria[]> | undefined;
  
  // Variables para tareas
  nuevaTareaTitulo: string = '';
  categoriaSeleccionadaId: string = '';
  filtroCategoriaId: string = 'todas';

  // Variables para gestionar categorías (Plus de Innovación y UX)
  nuevaCategoriaNombre: string = '';
  nuevaCategoriaColor: string = '#3880ff';

  // Variable para controlar la visibilidad del Banner Premium (Feature Flag)
  mostrarBannerPremium: boolean = false;

constructor(
  private todoService: TodoService,
  private remoteConfig: RemoteConfig
) {
  addIcons({ trashOutline, addOutline, starOutline, folderOpenOutline, createOutline }); 
}

  async ngOnInit() {
    this.categorias$ = this.todoService.getCategorias();
    this.cargarTareas();

    // --- CONSUMIR FEATURE FLAG DESDE LA NUBE ---
    try {
      await fetchAndActivate(this.remoteConfig);
      this.mostrarBannerPremium = getValue(this.remoteConfig, 'mostrar_banner_premium').asBoolean();
      console.log('Feature Flag "mostrar_banner_premium" cargado:', this.mostrarBannerPremium);
    } catch (error) {
      console.error('Error obteniendo Remote Config de Firebase:', error);
      this.mostrarBannerPremium = false;
    }
  }

  cargarTareas() {
    this.tareasFiltradas$ = this.todoService.getTareas().pipe(
      map((tareas: Tarea[]) => {
        if (this.filtroCategoriaId === 'todas') return tareas;
        return tareas.filter((t: Tarea) => t.categoriaId === this.filtroCategoriaId);
      })
    );
  }

  cambiarFiltro(event: any) {
    this.filtroCategoriaId = event.detail.value;
    this.cargarTareas();
  }

  agregarTarea() {
    if (!this.nuevaTareaTitulo.trim()) return;
    const catId = this.categoriaSeleccionadaId ? this.categoriaSeleccionadaId : undefined;
    this.todoService.agregarTarea(this.nuevaTareaTitulo, catId);
    this.nuevaTareaTitulo = '';
    this.categoriaSeleccionadaId = '';
  }

  alternarTarea(id: string) {
    this.todoService.alternarTarea(id);
  }

  eliminarTarea(id: string) {
    this.todoService.eliminarTarea(id);
  }

  // --- MÉTODOS DE CATEGORÍAS ADICIONALES ---
  crearCategoria() {
    if (!this.nuevaCategoriaNombre.trim()) return;
    this.todoService.agregarCategoria(this.nuevaCategoriaNombre, this.nuevaCategoriaColor);
    this.nuevaCategoriaNombre = '';
    // Reseteamos a un color aleatorio o por defecto
    this.nuevaCategoriaColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  eliminarCategoria(id: string) {
    this.todoService.eliminarCategoria(id);
    // Si teníamos el filtro puesto en la categoría eliminada, volvemos a 'todas'
    if (this.filtroCategoriaId === id) {
      this.filtroCategoriaId = 'todas';
    }
    this.cargarTareas();
  }

  obtenerEstiloCategoria(categoriaId?: string, categorias: Categoria[] | null = []): string {
    if (!categoriaId || !categorias) return '#737373';
    const cat = categorias.find((c: Categoria) => c.id === categoriaId);
    return cat ? cat.color : '#737373';
  }
}