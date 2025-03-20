import { bootstrapApplication } from '@angular/platform-browser';
import { appModuleConfig } from './app/app.module';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appModuleConfig)
  .catch((err) => console.error(err));
