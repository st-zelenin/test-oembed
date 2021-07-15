import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Brand {
  name: string;
  url: string;
}

interface OEmbedParams {
  url: string;
  omitscript: boolean;
  adapt_container_width: boolean;
  maxheight?: number;
  maxwidth?: number;
}

interface OEmbedResponse {
  error?: { message: string; };

  height: number;
  width: number;
  html: string;
}

interface EmbeddedContent {
  height: number;
  width: number;
  html: SafeHtml;
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
  embeddedContent: EmbeddedContent | undefined = undefined;

  constructor(private sanitizer: DomSanitizer) { }

  selectBrand(brand: Brand) {
    if (brand === this.selectedBrand) {
      this.selectedBrand = undefined;
      return;
    }

    this.selectedBrand = brand;

    const params: OEmbedParams = { url: brand.url, omitscript: false, adapt_container_width: true, maxheight: 1000, maxwidth: 1000 };
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
          this.embeddedContent = {
            height: 1000, //response.height,
            width: 1000, //response.width,
            html: this.sanitizer.bypassSecurityTrustHtml(response.html)
          };
        }
      }
    );
  }
}
