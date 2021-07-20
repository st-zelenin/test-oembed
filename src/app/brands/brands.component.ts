import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { FacebookService } from '../facebook.service';
import { default as BRANDS } from './brands.json';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  brands: string[] = BRANDS;
  selectedBrand: string | undefined = undefined;

  brandInputControl = new FormControl();
  filteredOptions: Observable<string[]> | undefined = undefined;

  @ViewChild('brandDetails') brandDetails: ElementRef<HTMLDivElement> | undefined = undefined;
  @ViewChild('embeddedContentContainer') embeddedContentContainer: ElementRef<HTMLDivElement> | undefined = undefined;

  constructor(private facebookService: FacebookService) { }

  ngOnInit(): void {
    this.filteredOptions = this.brandInputControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterBrands(value))
    );
  }

  onSubmit() {
    this.selectedBrand = this.brandInputControl.value;
    this.getBrandPage();
  }

  clear() {
    this.brandInputControl.setValue('');
    this.selectedBrand = undefined;
  }

  private async getBrandPage() {
    if (!this.embeddedContentContainer || !this.brandDetails || !this.selectedBrand) {
      return;
    }

    const { clientHeight, clientWidth } = this.brandDetails.nativeElement;

    const url = `https://www.facebook.com/${this.selectedBrand}`;
    const titleSize = 50; // this is the size of the `h2` and the `p`
    const response = await this.facebookService.getBrandPage(url, clientHeight - titleSize, clientWidth);
    const innerHTML = response && !response.error ? response.html : response.error?.message || '';

    if (this.embeddedContentContainer) {
      const container = this.embeddedContentContainer.nativeElement as HTMLDivElement;
      container.innerHTML = innerHTML;

      this.facebookService.renderBrandPage(container);
    }
  }

  private filterBrands(value: string): string[] {
    const substr = value.toLowerCase();

    return this.brands.filter(brand => brand.toLowerCase().includes(substr));
  }
}
