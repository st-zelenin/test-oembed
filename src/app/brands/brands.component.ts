import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

interface Brand {
  name: string;
  url: string;
}

interface OEmbedParams {
  url: string;
}
interface OEmbedResponse {
  error?: { message: string; };

  height: number;
  width: number;
  html: string;
}

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent {

  brands: Brand[] = [
    { name: 'P&G Polska', url: 'https://www.facebook.com/PGPolska' },
    { name: 'Nike', url: 'https://www.facebook.com/nike' },
    { name: 'Reebok', url: 'https://www.facebook.com/ReebokPoland/' },
    { name: 'Nestle', url: 'https://www.facebook.com/NestlePL' },
  ];

  selectedBrand: Brand | undefined = undefined;
  embeddedContent: OEmbedResponse | undefined = undefined;

  constructor(private sanitizer: DomSanitizer) { }

  selectBrand(brand: Brand) {
    this.selectedBrand = brand === this.selectedBrand ? undefined : brand;

    const params: OEmbedParams = { url: brand.url };
    FB.api<OEmbedParams, OEmbedResponse>(
      "/oembed_page",
      params,
      (response) => {
        if (!response || response.error) {
          this.embeddedContent = {
            height: 200,
            width: 200,
            html: this.sanitizer.sanitize(SecurityContext.HTML, response.error?.message || '') || ''
          }
        } else {
          this.embeddedContent = response;
        }
      }
    );
  }

}
