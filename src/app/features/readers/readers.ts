import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-readers',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './readers.html',
  styleUrl: './readers.css',
})
export class Readers implements OnInit {
  readerForm = new FormGroup({
    id: new FormControl(null),
    READER_NAME: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
    MOBILE_NO: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
    ADDRESS: new FormControl('', Validators.required),
  });

  readersList: any[] = [];
  isEditMode = false;
  showModal = false;
  isLoading = false;
  isReaderLoading = false;

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  constructor() {}

  ngOnInit() {
    this.getAllReaders();
  }

  getAllReaders() {
    this.isLoading = true;
    // TODO: API call
    setTimeout(() => {
      this.readersList = [];
      this.totalItems = 0;
      this.totalPages = 0;
      this.isLoading = false;
    }, 500);
  }

  openPopup() {
    this.isEditMode = false;
    this.readerForm.reset();
    this.showModal = true;
  }

  closePopup() {
    this.showModal = false;
    this.readerForm.reset();
  }

  onSave() {
    if (this.readerForm.valid) {
      this.isReaderLoading = true;
      // TODO: API call
      setTimeout(() => {
        this.isReaderLoading = false;
        this.Toast.fire({ icon: 'success', title: this.isEditMode ? 'Reader Updated' : 'Reader Added' });
        this.closePopup();
        this.getAllReaders();
      }, 1000);
    }
  }

  onEdit(reader: any) {
    this.isEditMode = true;
    this.showModal = true;
    this.readerForm.patchValue(reader);
  }

  onDelete(id: number) {
    if (confirm('Are you sure?')) {
      // TODO: API call
      this.getAllReaders();
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAllReaders();
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
    
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
