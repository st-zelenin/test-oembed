import { Component, ElementRef, ViewChild } from '@angular/core';
import { FacebookService } from '../facebook.service';
import { Brand } from '../models';

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

  constructor(private facebookService: FacebookService) {}

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

  private async getBrandPage() {
    if (!this.embeddedContentContainer || !this.selectedBrand) {
      return;
    }

    const { clientHeight, clientWidth } = this.embeddedContentContainer.nativeElement;

    const response = await this.facebookService.getBrandPage(this.selectedBrand.url, clientHeight, clientWidth);
    const innerHTML = response && !response.error ? response.html : response.error?.message || '';
  
    if (this.embeddedContentContainer) {
      const container = this.embeddedContentContainer.nativeElement as HTMLDivElement;
      container.innerHTML = innerHTML;

      this.facebookService.renderBrandPage(container);
    }
  }
}
