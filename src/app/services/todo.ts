import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaces de datos claras para mantener el tipado fuerte (Mantenibilidad)
export interface Categoria {
  id: string;
  nombre: string;
  color: string; // Plus de UX: guardar un color por categoría para diseño premium
}

export interface Tarea {
  id: string;
  titulo: string;
  completada: boolean;
  categoriaId?: string; // Relación opcional con una categoría
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // Manejo de estado reactivo con BehaviorSubjects (Optimización de Rendimiento)
  private tareasSubject = new BehaviorSubject<Tarea[]>([]);
  private categoriasSubject = new BehaviorSubject<Categoria[]>([]);

  constructor() {
    this.cargarDatosIniciales();
  }

  // --- PERSISTENCIA LOCAL ---
  private cargarDatosIniciales() {
    const tareasLocal = localStorage.getItem('tareas');
    const categoriasLocal = localStorage.getItem('categorias');

    // Categorías por defecto si la app está vacía (Creatividad y UX)
    const categoriasPorDefecto: Categoria[] = [
      { id: '1', nombre: 'Trabajo', color: '#3880ff' },
      { id: '2', nombre: 'Personal', color: '#2dd36f' },
      { id: '3', nombre: 'Ideas', color: '#ffc409' }
    ];

    this.categoriasSubject.next(categoriasLocal ? JSON.parse(categoriasLocal) : categoriasPorDefecto);
    this.tareasSubject.next(tareasLocal ? JSON.parse(tareasLocal) : []);
  }

  private guardarEnLocalStorage() {
    localStorage.setItem('tareas', JSON.stringify(this.tareasSubject.value));
    localStorage.setItem('categorias', JSON.stringify(this.categoriasSubject.value));
  }

  // --- MÉTODOS PARA TAREAS ---
  getTareas(): Observable<Tarea[]> {
    return this.tareasSubject.asObservable();
  }

  agregarTarea(titulo: string, categoriaId?: string) {
    const nueva: Tarea = {
      id: crypto.randomUUID(),
      titulo,
      completada: false,
      categoriaId
    };
    this.tareasSubject.next([...this.tareasSubject.value, nueva]);
    this.guardarEnLocalStorage();
  }

  alternarTarea(id: string) {
    const actualizadas = this.tareasSubject.value.map(t => 
      t.id === id ? { ...t, completada: !t.completada } : t
    );
    this.tareasSubject.next(actualizadas);
    this.guardarEnLocalStorage();
  }

  eliminarTarea(id: string) {
    const filtradas = this.tareasSubject.value.filter(t => t.id !== id);
    this.tareasSubject.next(filtradas);
    this.guardarEnLocalStorage();
  }

  // --- MÉTODOS PARA CATEGORÍAS ---
  getCategorias(): Observable<Categoria[]> {
    return this.categoriasSubject.asObservable();
  }

  agregarCategoria(nombre: string, color: string = '#737373') {
    const nueva: Categoria = { id: crypto.randomUUID(), nombre, color };
    this.categoriasSubject.next([...this.categoriasSubject.value, nueva]);
    this.guardarEnLocalStorage();
  }

  editarCategoria(id: string, nuevoNombre: string, nuevoColor: string) {
    const actualizadas = this.categoriasSubject.value.map(c =>
      c.id === id ? { ...c, nombre: nuevoNombre, color: nuevoColor } : c
    );
    this.categoriasSubject.next(actualizadas);
    this.guardarEnLocalStorage();
  }

  eliminarCategoria(id: string) {
    // Eliminar la categoría
    const categoriasFiltradas = this.categoriasSubject.value.filter(c => c.id !== id);
    this.categoriasSubject.next(categoriasFiltradas);
    
    // Limpiar la referencia de la categoría en las tareas asociadas (Mantenibilidad)
    const tareasLimpias = this.tareasSubject.value.map(t =>
      t.categoriaId === id ? { ...t, categoriaId: undefined } : t
    );
    this.tareasSubject.next(tareasLimpias);
    
    this.guardarEnLocalStorage();
  }
}