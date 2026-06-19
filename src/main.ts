import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Importaciones oficiales del SDK de Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withComponentInputBinding()),
    
    // Inicialización Limpia de los módulos Cloud (Criterio de Mantenibilidad)
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideRemoteConfig(() => {
      const remoteConfig = getRemoteConfig();
      // Configuramos un intervalo de fetch bajo (0 segundos) para desarrollo local 
      // así ves los cambios del feature flag inmediatamente en tu navegador sin caché
      remoteConfig.settings.minimumFetchIntervalMillis = 0;
      return remoteConfig;
    })
  ],
});