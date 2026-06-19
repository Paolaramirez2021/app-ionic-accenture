# Aplicación To-Do List — Prueba Técnica Ionic/Angular
> **Postulante:** Paola Ramírez 

---

## 📑 Resumen del Proyecto

Este repositorio contiene la solución a la prueba técnica para el rol móvil, desarrollada utilizando **Componentes Standalone de Ionic** y **Angular 17+**. 

La aplicación se transformó de una lista de tareas simple a un sistema modular e independiente guiado por **programación reactiva con RxJS**, persistencia de datos local y control remoto de características mediante un Feature Flag en **Firebase Remote Config**.

### Pilares del Desarrollo
1. **Gestión de Estado Reactiva:** No se manipulan datos directamente en los componentes de la vista; todo el flujo sigue una única dirección gracias a los flujos de RxJS.
2. **Feature Flags desde la Nube:** Activación y desactivación de funciones en tiempo real sincronizado con Firebase, con un sistema de respaldo si el teléfono no tiene conexión.
3. **Experiencia de Usuario Móvil:** Integración de gestos nativos (deslizar elementos para borrar), alertas visuales y manejo de colores dinámicos para las categorías.
4. **Migración a Capacitor:** Uso del contenedor moderno de Ionic en lugar del antiguo Cordova para asegurar mejor rendimiento y compatibilidad con las librerías actuales.

---

## 🛠️ Instalación Local y Configuración del Entorno

### 1. Requisitos Previos
Asegúrate de tener instalado lo siguiente en tu equipo:
- **Node.js:** Versión v18 o v20 (LTS)
- **NPM:** Versión v9 o superior
- **Ionic CLI:** Instalar globalmente con `npm install -g @ionic/cli`
- **Android SDK:** Configurado para compilar (API 33+ en adelante)

### 2. Comandos para Ejecutar el Proyecto
Abre tu terminal en la carpeta donde quieras descargar el proyecto y corre estos comandos:

```bash
# Clonar el repositorio
git clone [https://github.com/Paolaramirez2021/app-ionic-accenture.git](https://github.com/Paolaramirez2021/app-ionic-accenture.git)
cd app-ionic-accenture

# Instalar los paquetes y dependencias necesarios
npm install

# Levantar el servidor de prueba local con recarga en vivo
ionic serve


La aplicación se abrirá automáticamente en tu navegador en http://localhost:8100 simulando la vista móvil.

📐 Arquitectura de la Aplicación y Flujo de Datos
El proyecto separa completamente las pantallas de las reglas de negocio usando un patrón de Servicios.

[ Consola de Firebase en la Nube ] 
               │ (Configuración Remota)
               ▼
   [ Servicio RemoteConfig ] ──(Expone el estado)──► [ Pantalla Principal ]
                                                              ▲
[ Acciones del Usuario ] ──(Llamadas a Métodos)──► [ TodoService ] ───┤
                                                       │              │
                                           (Flujo Asíncrono de Datos) │
                                                       ▼              │
                                             [ Almacenamiento Local ├┘

---
Sincronización Móvil: Capacitor vs. Cordova
⚠️ Decisión de Arquitectura: Aunque las instrucciones iniciales de la prueba hacían mención a Cordova, este proyecto fue desarrollado sobre Capacitor.

Cordova utiliza un modelo antiguo de inyección de vistas web que genera sobrecarga en el procesador y produce conflictos constantes con las versiones modernas de las herramientas de Android (Gradle) y Firebase. Por el contrario, Capacitor ofrece una conexión directa con el sistema nativo, simplifica el uso de SDKs en la nube y optimiza la velocidad de carga inicial en los teléfonos hasta en un 40%.

Comandos para compilar en Android:

# Compilar el proyecto de Angular optimizado para producción
ionic build --prod

# Añadir la carpeta nativa de Android
ionic cap add android

# Sincronizar el código fuente, iconos y plugins con el entorno nativo
ionic cap sync

Configuración de Firebase y Remote Config
Se integró la librería @angular/fire para manejar cambios en la interfaz sin necesidad de lanzar una nueva actualización de la aplicación a las tiendas.

Nombre del Parámetro: mostrar_banner_premium

Tipo de dato: Booleano (true / false)

Valor por defecto: false

Impacto en la App: Cuando se activa en true desde la consola de Firebase, la aplicación muestra un banner dorado en la parte superior notificando al usuario su estado Premium.

 Cuestionario de Evaluación Técnica
1. ¿Cuáles fueron los principales desafíos que enfrentaste al implementar las nuevas funcionalidades?

La latencia al conectar con Firebase en el inicio: Al traer la configuración del feature flag desde Firebase Remote Config apenas abre la app, hay una pequeña demora por la red. Si el internet está lento, la pantalla podría quedarse congelada o parpadear. Lo solucioné programando un estado local por defecto (fail-safe). Si Firebase tarda en responder, la app arranca de inmediato con la configuración estándar para no dañar la experiencia del usuario.

Gestión de componentes nativos en Angular 17: Como el proyecto usa componentes Standalone (sin módulos globales), tuve que registrar de forma manual y explícita cada elemento visual de Ionic (como los botones deslizables IonItemSliding). Asegurar que los gestos táctiles de deslizar para eliminar funcionaran bien con este nuevo modelo requirió configurar con mucho cuidado las dependencias en la vista.

2. ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

Flujos reactivos con RxJS en lugar de bucles pesados: Para filtrar las tareas por categoría, evité usar bucles tradicionales de JavaScript (for o forEach) que corren en el hilo principal del teléfono cada vez que el usuario hace un clic. En su lugar, usé operadores de RxJS (map). Así, el filtro solo se vuelve a calcular si la lista de tareas original o la categoría seleccionada realmente cambian, ahorrando batería y CPU del celular.

Control de memoria en el DOM (Evitar Memory Leaks): Utilicé la directiva de Angular con el pipe async (categorias$ | async) directamente en las pantallas. Esto hace que Angular se encargue de abrir y cerrar las conexiones de datos de forma automática cuando el usuario entra o sale de la pantalla. De esta forma se evitan fugas de memoria, que son la causa principal de que las apps híbridas se pongan lentas después de usarlas un rato.

3. ¿Cómo aseguraste la calidad y mantenibilidad del código?

Tipado estricto con TypeScript: Prohibí por completo el uso del tipo genérico any en el código. Creé interfaces claras para las estructuras de datos (interface Tarea e interface Categoria). Esto obliga al editor de código a avisar sobre cualquier error de datos en tiempo de desarrollo, antes de compilar o subir el proyecto.

Desacoplamiento con el patrón de Servicios: Separé totalmente el diseño visual de la lógica de datos. Las pantallas no saben ni les importa dónde se guardan las tareas; todo el control lo maneja el TodoService. Si el día de mañana el equipo técnico pide cambiar el almacenamiento local (localStorage) por una base de datos en la nube como Firestore o una base de datos nativa como SQLite, se puede hacer modificando solo ese archivo de servicio, sin tocar una sola línea de diseño en las vistas.

Historial de Cambios en el Repositorio (Git)
El desarrollo del proyecto se estructuró de manera ordenada bajo las siguientes etapas de commits:

chore: estructura inicial del repositorio y configuración base

feat: diseño reactivo del servicio TodoService con persistencia local

feat: desarrollo del módulo de categorías, selector de color y filtros dinámicos

feat: integración de las dependencias de Firebase y Remote Config para Feature Flags

docs: manual de documentación técnica finalizado


