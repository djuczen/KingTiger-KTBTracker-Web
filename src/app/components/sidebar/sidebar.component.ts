import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  className = 'sidebar-full';
  collapsed = true;

  constructor(public auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.className = this.collapsed ? 'sidebar-icons' : 'sidebar-full';
  }

  showSidebar() {
    this.collapsed = false;
    this.className = 'sidebar-full';
  }

  hideSidebar() {
    this.collapsed = true;
    this.className = 'sidebar-icons';
  }
}
