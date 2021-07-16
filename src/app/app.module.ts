import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PolicyComponent } from './policy/policy.component';
import { BrandsComponent } from './brands/brands.component';
import { ExtendedWindow } from './models';
import { FacebookService } from './facebook.service';
import { DOCUMENT } from '@angular/common';

function initializeAppFactory(fb: FacebookService, doc: Document): () => Promise<void> {
  return () => new Promise<void>((resolve) => {

    const extendedWindow: ExtendedWindow = window as unknown as ExtendedWindow;
    extendedWindow.fbAsyncInit = () => {
      fb.init(extendedWindow.APP_ID, extendedWindow.FB_TOKEN);
      fb.logIn().then(resolve);
    };

    fb.injectScripts(doc);
  });
}

@NgModule({
  declarations: [
    AppComponent,
    PolicyComponent,
    BrandsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeAppFactory,
    multi: true,
    deps: [FacebookService, DOCUMENT],
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
