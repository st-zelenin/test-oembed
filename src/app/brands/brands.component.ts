import { Component, ElementRef, ViewChild } from '@angular/core';

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

  @ViewChild('embeddedContentContainer') embeddedContentContainer: ElementRef<HTMLDivElement> | undefined = undefined;

  selectBrand(brand: Brand) {
    if (brand === this.selectedBrand) {
      this.selectedBrand = undefined;
      return;
    }

    this.selectedBrand = brand;

    // [class.visible] should apply first
    // to update height/width of the container
    setTimeout(() => this.getBrandPage());
  }

  private getBrandPage() {
    if (!this.embeddedContentContainer || !this.selectedBrand) {
      return;
    }

    const { clientHeight, clientWidth } = this.embeddedContentContainer.nativeElement;


    const params: OEmbedParams = {
      url: this.selectedBrand.url,
      omitscript: true,             // SDK and 'div.fb-root' are already initialized
      adapt_container_width: false,
      maxheight: clientHeight,
      maxwidth: clientWidth,
    };

    FB.api<OEmbedParams, OEmbedResponse>(
      "/oembed_page",
      params,
      (response) => {
        const innerHTML = response && !response.error ? response.html : response.error?.message || '';

        if (this.embeddedContentContainer) {
          const container = this.embeddedContentContainer.nativeElement as HTMLDivElement;
          container.innerHTML = innerHTML;

          // triggers 'div.fb-page' rendering
          FB.XFBML.parse(container);
        }
      }
    );
  }
}
