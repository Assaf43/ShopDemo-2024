import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ShopParams } from '../../shared/models/shopParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-shop',
  imports: [
    ProductItemComponent, 
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog)
  title = 'ShopDemo';
  products?: Pagination<Product>;
  sortOption = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low-High', value: 'priceAsc'},
    {name: 'Price: High-Low', value: 'priceDesc'}
  ]
  shopParams = new ShopParams();
  pageSizeOption = [5,10,15,20];

  ngOnInit(): void {
    this.initializShop();
  }

  initializShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (response) => (this.products = response),
      error: (error) => console.log(error)
    });
  }

  onSearchChange() {
    console.log('in onSearchChange');
    
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  handlePageEvent(event: PageEvent){
    this.shopParams.pageNumber = event.pageIndex +1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(event: MatSelectionListChange) {
    const selectOption = event.options[0];
    if (selectOption) {
      this.shopParams.sort = selectOption.value;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FilterDialogComponent , {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types
      }
    });

    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          //Aplly Filters
          this.getProducts();         
        }
      }
    })
  }
}
