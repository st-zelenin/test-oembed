import { Injectable } from '@angular/core';
import { OEmbedParams, OEmbedResponse } from './models';

@Injectable({
  providedIn: 'root'
})
export class FacebookService {
  private token: string | undefined = undefined;


  init(appId: string, token: string): void {
    this.token = token;

    FB.init({
      appId,
      cookie: true,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v11.0'
    });
  }

  logIn(): Promise<void> {
    if (this.token) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
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
              reject();
            }
          });
        } else {
          resolve();
        }
      });
    });
  }

  injectScripts(doc: Document) {
    if (doc.getElementById('facebook-jssdk')) {
      return;
    }

    const firstScript = doc.getElementsByTagName('script')[0];
    const sdkScript = doc.createElement('script');
    sdkScript.id = 'facebook-jssdk';
    sdkScript.src = "https://connect.facebook.net/en_US/sdk.js";
    firstScript.parentNode!.insertBefore(sdkScript, firstScript);
  }

  getBrandPage(url: string, maxheight: number, maxwidth: number): Promise<OEmbedResponse> {
    return new Promise<OEmbedResponse>((resolve) => {
      const params: OEmbedParams = {
        url,
        omitscript: true,             // SDK and 'div.fb-root' are already initialized
        adapt_container_width: false,
        maxheight,
        maxwidth,
      };

      if (this.token) {
        params.access_token = this.token;
      }

      FB.api<OEmbedParams, OEmbedResponse>(
        "/oembed_page",
        params,
        (response) => resolve(response)
      );
    });
  }

  renderBrandPage(container: HTMLElement): void {
    // triggers 'div.fb-page' rendering
    FB.XFBML.parse(container);
  }
}
