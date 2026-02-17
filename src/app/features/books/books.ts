import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../core/services/book.services';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books implements OnInit {
  bookForm = new FormGroup({
    id: new FormControl(null),
    BOOK_NAME: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
    AUTHOR: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
    FRONT_IMAGE: new FormControl(null),
    BACK_IMAGE: new FormControl(null),
  });

  booksList: any[] = [];
  isEditMode = false;
  backendError: string = '';
  showModal = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  showImageModal = false;
  selectedBookImages: any = { front: '', back: '' };
  baseUrl = 'http://192.168.1.136:8000/storage/books/';

  // Preview mate variables
  frontPreview: string | null = null;
  backPreview: string | null = null;

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.getAllBooks();
  }

  getAllBooks() {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: (res: any) => {
        this.booksList = res.books;
        this.totalItems = this.booksList.length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get paginatedBooks() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.booksList.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  onFileSelect(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.bookForm.patchValue({ [field]: file } as any);

      // File Reader for Preview
      const reader = new FileReader();
      reader.onload = () => {
        if (field === 'FRONT_IMAGE') this.frontPreview = reader.result as string;
        if (field === 'BACK_IMAGE') this.backPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openPopup() {
    this.isEditMode = false;
    this.bookForm.reset();
    this.frontPreview = null;
    this.backPreview = null;
    this.backendError = '';
    this.showModal = true;
  }

  closePopup() {
    this.showModal = false;
    this.resetAll();
  }

  onSave() {
    if (this.bookForm.valid) {
      this.backendError = '';
      const formData = new FormData();

      // ID handle 
      const idValue = this.bookForm.get('id')?.value;
      if (idValue) {
        formData.append('id', String(idValue));
      }

      formData.append('BOOK_NAME', this.bookForm.get('BOOK_NAME')?.value || '');
      formData.append('AUTHOR', this.bookForm.get('AUTHOR')?.value || '');

      // --- Front Image Logic ---
      const frontImg: any = this.bookForm.get('FRONT_IMAGE')?.value;
      if (frontImg instanceof File) {
        formData.append('FRONT_IMAGE', frontImg);
      } else if (this.isEditMode && !this.frontPreview) {
        formData.append('FRONT_IMAGE', '');
      }

      // --- Back Image Logic ---
      const backImg: any = this.bookForm.get('BACK_IMAGE')?.value;
      if (backImg instanceof File) {
        formData.append('BACK_IMAGE', backImg);
      } else if (this.isEditMode && !this.backPreview) {
        formData.append('BACK_IMAGE', '');
      }

      // API Call
      if (this.isEditMode) {
        // UPDATE Logic
        this.bookService.updateBook(Number(idValue), formData).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.Toast.fire({ icon: 'success', title: 'Book Updated successfully' });
            this.closePopup();
          },
          error: (err: any) => {
            this.isSubmitting = false;
            this.backendError = err.error?.message || 'Update failed';
          },
        });
      } else {
        // CREATE Logic
        this.bookService.addBook(formData).subscribe({
          next: () => {
            this.Toast.fire({ icon: 'success', title: 'Book Added successfully' });
            this.closePopup();
          },
          error: (err: any) => {
            this.backendError = err.error?.message || 'Error saving book';
          },
        });
      }
    }
  }

  onEdit(book: any) {
    this.isEditMode = true;
    this.showModal = true;
    this.bookForm.patchValue({
      id: book.id,
      BOOK_NAME: book.BOOK_NAME,
      AUTHOR: book.AUTHOR,
    });
    // Edit વખતે જુના ફોટા દેખાય તે માટે
    this.frontPreview = book.FRONT_IMAGE ? this.baseUrl + book.FRONT_IMAGE : null;
    this.backPreview = book.BACK_IMAGE ? this.baseUrl + book.BACK_IMAGE : null;
  }

  onDelete(id: number) {
    if (confirm('Are you sure?')) {
      this.bookService.deleteBook(id).subscribe(() => this.getAllBooks());
    }
  }

  resetAll() {
    this.isEditMode = false;
    this.bookForm.reset();
    this.frontPreview = null;
    this.backPreview = null;
    this.getAllBooks();
  }

  openImagePreview(book: any) {
    this.selectedBookImages = {
      front: this.baseUrl + book.FRONT_IMAGE,
      back: this.baseUrl + book.BACK_IMAGE,
      name: book.BOOK_NAME,
    };
    this.showImageModal = true;
  }

  closeImagePreview() {
    this.showImageModal = false;
  }

  removeImage(field: string, inputElement: HTMLInputElement) {
    this.bookForm.patchValue({ [field]: null });

    if (field === 'FRONT_IMAGE') this.frontPreview = null;
    if (field === 'BACK_IMAGE') this.backPreview = null;

    inputElement.value = '';
  }
}
