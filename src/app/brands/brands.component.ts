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

  private readonly TITLE_SIZE = 40; // the size of `h2` in the section of the embedded page/post

  @ViewChild('brandDetails') brandDetails: ElementRef<HTMLDivElement> | undefined = undefined;
  @ViewChild('embeddedContentContainer') embeddedContentContainer: ElementRef<HTMLDivElement> | undefined = undefined;

  constructor(private facebookService: FacebookService) { }

  ngOnInit(): void {
    this.filteredOptions = this.brandInputControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterBrands(value))
    );
  }

  showFacebookPage() {
    this.selectedBrand = this.brandInputControl.value;
    this.embedFacebookPage();
  }

  showInstagramPage() {
    this.selectedBrand = this.brandInputControl.value;
    this.embedInstagramPost();
  }

  clear() {
    this.brandInputControl.setValue('');
    this.selectedBrand = undefined;
  }

  private async embedFacebookPage() {
    if (!this.embeddedContentContainer || !this.brandDetails || !this.selectedBrand) {
      return;
    }

    const { clientHeight, clientWidth } = this.brandDetails.nativeElement;

    const url = `https://www.facebook.com/${this.selectedBrand}`;
    const response = await this.facebookService.getFacebookPage(url, clientHeight - this.TITLE_SIZE, clientWidth)

    const innerHTML = response && !response.error ? response.html : response.error?.message || '';
    const container = this.embeddedContentContainer.nativeElement as HTMLDivElement;
    container.innerHTML = innerHTML;

    this.facebookService.renderBrandPage(container);
  }

  private async embedInstagramPost() {
    if (!this.embeddedContentContainer || !this.brandDetails || !this.selectedBrand) {
      return;
    }

    const { clientWidth } = this.brandDetails.nativeElement;

    const url = `https://www.instagram.com/p/${this.selectedBrand}/`;
    const response = await this.facebookService.getInstagramPost(url, clientWidth - this.TITLE_SIZE);

    const innerHTML = response && !response.error ? response.html : response.error?.message || '';
    const container = this.embeddedContentContainer.nativeElement as HTMLDivElement;
    container.innerHTML = innerHTML;

    this.facebookService.renderInstagramPost();
  }

  private filterBrands(value: string): string[] {
    const substr = value.toLowerCase();

    return this.brands.filter(brand => brand.toLowerCase().includes(substr));
  }
}
