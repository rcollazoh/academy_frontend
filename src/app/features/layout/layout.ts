import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Sidebar } from "../../shared/components/sidebar/sidebar";
import { Header } from "../../layout/header/header";

@Component({
  selector: 'app-layout',
  imports: [MatSidenavModule, CommonModule, Sidebar, Header, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  public isShowSidebar: boolean;
  public mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  constructor(protected router: Router, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.isShowSidebar = !this.mobileQuery.matches;
  }

  public ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);

    window.removeEventListener('storage',(event) => {
      // console.log(event);
    });

    if (this.sidenav) {
      this.sidenav.close();
    }
  }

}
