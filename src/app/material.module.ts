import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // ...Material UI Modules...
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
  ],
  exports: [
    // ...Material UI Modules...
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
  ]
})
export class MaterialModule { }
