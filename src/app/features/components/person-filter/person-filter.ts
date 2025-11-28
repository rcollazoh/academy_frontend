import { AuthService } from '@/app/core/services/auth.service';
import { FeaturesService } from '@/app/features/services/features.service';
import { Routes } from '@/app/shared/consts/routes';
import { PersonEntity } from '@/app/shared/models/person-model';
import { EmptyFieldPipe } from '@/app/shared/pipes/empty-field-pipe';
import { NotificationService } from '@/app/shared/services/notification.service';
import { RouteService } from '@/app/shared/services/route.service';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-person-filter',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatCardModule, MatTableModule, MatSortModule, MatPaginatorModule, EmptyFieldPipe, CommonModule, MatButtonModule,
     MatIconModule, MatTooltipModule, FormsModule],
  templateUrl: './person-filter.html',
  styleUrl: './person-filter.scss'
})
export class PersonFilter implements OnInit{

 public person$: Observable<PersonEntity>;

  displayedColumns: string[] = [];

  length = 0;
  pageSize = 15;
  pageIndex = 0;
  selectedRowIndex = 0;

  public routes: typeof Routes = Routes;

  personList: PersonEntity[] = [];
  personSelected!: PersonEntity | undefined;
  selection = new SelectionModel<PersonEntity>(false, []);

  lastRouteSubscription: Subscription;
  lastRoute = '';

  searchParam = '';
  

  /** Sort State */
  active: string = 'id';
  direction: string = 'desc';

  selectedFileName: string = '';

  constructor( private featuresService: FeaturesService,
               protected ngxLoaderService: NgxUiLoaderService,
               private notificacionService: NotificationService,
               public datepipe: DatePipe,
               public dialog: MatDialog,
               private routeService: RouteService,
               private authService: AuthService) {
                this.person$ = this.authService.getUser();
    this.lastRouteSubscription = this.routeService.lastRoute$.subscribe(lastRoute => {
      if (lastRoute) {
        this.lastRoute = lastRoute;
      } else {
        this.lastRoute = '';
      }
    });
  }

    getDataColumnsTable() {
    return ['name','lastName','email','phone','idNumber','areaName','practiceName'];
  }
  ngOnInit(): void {
    this.displayedColumns = this.getDataColumnsTable();


     this.getPersons(this.searchParam, this.pageIndex, this.pageSize);
  }

loadPersonList(): void {
    this.getPersons(this.searchParam, this.pageIndex, this.pageSize);
  }

    getPersons(request: string, pageNumber: number, pageSize: number): void {
    this.ngxLoaderService.start();
    this.featuresService.getPersons(request, pageNumber, pageSize, this.active + ',' + this.direction).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.personList = res.result.elements;
        this.length = res.result.count;

        this.personSelected = undefined;
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          'Lo sentimos, ocurrió un error al obtener el listado de personas'
        );
      },
    });
  }

    setSelectedRow(row: PersonEntity, event: MouseEvent): void {
      if (this.personSelected != row) {
        this.selection.toggle(row);
        this.personSelected = row;
      }
    }

    
  tableKeydown(event: KeyboardEvent) {
    if (!this.selection.isEmpty()) {
      let newSelection;
      const currentSelection = this.selection.selected[0];
      const currentIndex = this.personList.findIndex(row => row === currentSelection);
      this.selectedRowIndex = currentIndex;
      if (event.key === 'ArrowDown') {
        newSelection = this.personList[currentIndex + 1];
        this.selectedRowIndex = currentIndex + 1;
      } else if (event.key === 'ArrowUp') {
        newSelection = this.personList[currentIndex - 1];
        this.selectedRowIndex = currentIndex - 1;
      }
      if (newSelection) {
        this.selection.toggle(newSelection);
        this.personSelected = newSelection;
      }
    }
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getPersons(this.searchParam, this.pageIndex, this.pageSize);
  }

}

