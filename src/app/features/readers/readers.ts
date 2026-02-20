import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ReadersService } from '../../core/services/readers.service'

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

  constructor(private readersService: ReadersService) {}

  ngOnInit() {
    this.getAllReaders();
  }

  getAllReaders() {
    this.isLoading = true;
    this.readersService.getAll(this.currentPage, this.itemsPerPage).subscribe({
      next: (res) => {
        this.readersList = res.data;        // <- tara API response mujab adjust karo
        this.totalItems = res.totalItems;   // <- tara API response mujab adjust karo
        this.totalPages = res.totalPages;   // <- tara API response mujab adjust karo
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
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
      const formData = this.readerForm.value;

      if (this.isEditMode && formData.id) {
        // UPDATE
        this.readersService.update(formData.id, formData).subscribe({
          next: () => {
            this.isReaderLoading = false;
            this.Toast.fire({ icon: 'success', title: 'Reader Updated' });
            this.closePopup();
            this.getAllReaders();
          },
          error: () => {
            this.isReaderLoading = false;
            this.Toast.fire({ icon: 'error', title: 'Update Failed' });
          }
        });
      } else {
        // CREATE
        this.readersService.create(formData).subscribe({
          next: () => {
            this.isReaderLoading = false;
            this.Toast.fire({ icon: 'success', title: 'Reader Added' });
            this.closePopup();
            this.getAllReaders();
          },
          error: () => {
            this.isReaderLoading = false;
            this.Toast.fire({ icon: 'error', title: 'Save Failed' });
          }
        });
      }
    }
  }

  onEdit(reader: any) {
    this.isEditMode = true;
    this.showModal = true;
    this.readerForm.patchValue(reader);
  }

  onDelete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This reader will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.readersService.delete(id).subscribe({
          next: () => {
            this.Toast.fire({ icon: 'success', title: 'Reader Deleted' });
            this.getAllReaders();
          },
          error: () => {
            this.Toast.fire({ icon: 'error', title: 'Delete Failed' });
          }
        });
      }
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAllReaders();
    }
  }

  get pageNumbers(): number[] {
    const maxVisible = 5;
    if (this.totalPages <= maxVisible) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }
}