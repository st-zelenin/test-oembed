import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

function initializeApp(): Promise<void> {
  return new Promise((resolve, reject) => {

    const extendedWindow = window as unknown as any;
    extendedWindow.fbAsyncInit = function () {
      FB.init({
        appId: extendedWindow.APP_ID,
        cookie: true,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v11.0'
      });

      FB.getLoginStatus((response) => {
        console.log('auth response', response);

        if (!response.authResponse) {
          FB.login((response) => {
            if (response.authResponse) {
              console.log('Welcome!  Fetching your information.... ');

              FB.api('/me', (response: { name: string }) => {
                console.log('Good to see you, ' + response.name + '.');
              });

              resolve();
            } else {
              console.log('User cancelled login or did not fully authorize.');
            }
          });
        } else {
          resolve();
        }
      });
    };

    (function (d) {
      if (d.getElementById('facebook-jssdk')) {
        return;
      }

      const firstScript = d.getElementsByTagName('script')[0];
      const sdkScript = d.createElement('script');
      sdkScript.id = 'facebook-jssdk';
      sdkScript.src = "https://connect.facebook.net/en_US/sdk.js";
      firstScript.parentNode!.insertBefore(sdkScript, firstScript);
    }(document));
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: () => initializeApp,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
