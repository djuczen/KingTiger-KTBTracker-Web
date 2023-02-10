import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent {

  @Input() title: string = '';

  @Input() message: string = '';

  @Input() target: string | string[] = '';

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal) {}

}
