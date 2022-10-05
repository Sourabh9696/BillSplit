import { Component, ViewChild, HostListener,EventEmitter,OnInit ,Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';

import screenfull from 'screenfull';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  isExpanded= true;
  hide = true;
  menus: any;
  screenWidth?: number;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  @ViewChild('sidenav') sidenav?: MatSidenav;
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.screenWidth$.next(event.target.innerWidth);
  }
  constructor() { 
    this.menus = [
      {
        "name": 'Users',
        "href": '/component/users',
        "icons":'people'

      },
      {
        "name": 'Expenses',
        "href": '/component/expenses',
        "icons":'bar_chart'

      }
    ]
  }

  ngOnInit(): void {
    this.screenWidth$.subscribe(width => {
      this.screenWidth = width;
    });
  }

  toggleFullscreen()
  {
      if (screenfull.isEnabled) {
        screenfull.toggle();
        this.hide = !this.hide
      } 
  }

}
