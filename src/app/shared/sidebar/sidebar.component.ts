import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  shrink = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.shrink = !this.shrink;
  }

  get shrinkClass(): string {
    return this.shrink ? 'shrink' : '';
  }

  get shrinkIconClass(): string {
    return this.shrink ? 'bi-arrow-bar-right' : 'bi-arrow-bar-left';
  }
}
