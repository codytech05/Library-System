import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { IssueService } from '../../core/services/issue.services';
 
@Component({

  selector: 'app-issue',

  standalone: true,

  imports: [NgSelectModule, ReactiveFormsModule, CommonModule],

  templateUrl: './issue.html',

  styleUrl: './issue.css',

  encapsulation: ViewEncapsulation.None,

})

export class Issue implements OnInit {
 
  issueForm!: FormGroup;

  allBooks: any[] = [];

  selectedBooks: any[] = [];

  issuedRecords: any[] = [];

  editId: any = null;
 
  isLoading: boolean = false;

  isIssueLoading: boolean = false;

  showIssueModal = false;

  backendError: string = '';
 
  constructor(

    private issueService: IssueService,

    private fb: FormBuilder,

  ) {}
 
  // ================= INIT =================
 
  ngOnInit(): void {

    this.issueForm = this.fb.group({

      readerName: ['', [Validators.required, Validators.minLength(3)]],

      readerMobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

      readerAddress: ['', Validators.required],

      selectedBookId: [null],

    });
 
    this.getBooksList();

    this.fetchIssuedList();

  }
 
  // ================= FETCH =================
 
  getBooksList() {

    this.issueService.getAllBooks().subscribe({

      next: (res: any) => {

        const data = Array.isArray(res) ? res : res.data;

        this.allBooks = data || [];

      },

      error: (err) => {

        console.error('Books API Error', err);

      },

    });

  }
 
  fetchIssuedList() {

    this.isLoading = true;

    this.issueService.getIssuedRecords().subscribe({

      next: (res: any) => {

        this.issuedRecords = Array.isArray(res) ? res : res.data || [];

        this.isLoading = false;

      },

      error: (err) => {

        console.error('Issued Records Error', err);

        this.isLoading = false;

      },

    });

  }
 
  // ================= MODAL =================
 
  openPopup() {

    this.showIssueModal = true;

    this.resetForm();

  }
 
  closePopup() {

    this.showIssueModal = false;

    this.resetForm();

  }
 
  // ================= BOOK SELECT =================
 
  onBookSelect(event: any) {

    if (!event) return;
 
    const alreadyAdded = this.selectedBooks.find(b => b.id === event.id);
 
    if (alreadyAdded) {

      alert('This book is already selected!');

    } else {

      this.selectedBooks.push({

        id: event.id,

        label: event.label

      });

    }
 
    this.issueForm.get('selectedBookId')?.setValue(null);

  }
 
  removeBook(index: number) {

    this.selectedBooks.splice(index, 1);

  }
 
  // ================= SAVE =================
 
  saveIssue() {

    if (this.issueForm.invalid || this.selectedBooks.length === 0) {

      this.issueForm.markAllAsTouched();

      return;

    }
 
    this.isIssueLoading = true;

    this.backendError = '';
 
    const payload = {

      ISSUE_ID: this.editId,

      READER_NAME: this.issueForm.value.readerName,

      READER_MOBILE_NO: this.issueForm.value.readerMobile,

      ADDRESS: this.issueForm.value.readerAddress,

      BOOK_IDS: this.selectedBooks.map(b => b.id),

    };
 
    this.issueService.saveIssueData(payload).subscribe({

      next: (res: any) => {
 
        if (this.editId) {

          // UPDATE

          const index = this.issuedRecords.findIndex(

            r => r.ISSUE_ID === this.editId

          );
 
          if (index !== -1) {

            this.issuedRecords[index] = res.issue;

          }
 
        } else {

          // ADD → Show on TOP

          this.issuedRecords.unshift(res.issue);

        }
 
        this.isIssueLoading = false;

        this.closePopup();

      },

      error: (err) => {

        this.isIssueLoading = false;

        this.backendError =

          err.error?.message || 'Something went wrong. Please try again.';

      },

    });

  }
 
  // ================= EDIT =================
 
  editRecord(record: any) {

    this.editId = record.ISSUE_ID;

    this.showIssueModal = true;

    this.backendError = '';
 
    this.issueForm.patchValue({

      readerName: record.READER_NAME,

      readerMobile: record.READER_MOBILE_NO,

      readerAddress: record.ADDRESS,

    });
 
    if (record.BOOK_IDS && Array.isArray(record.BOOK_IDS)) {

      const bookNames = record.BOOKS ? record.BOOKS.split(',') : [];
 
      this.selectedBooks = record.BOOK_IDS.map((id: number, index: number) => ({

        id: id,

        label: `${id} - ${bookNames[index]?.trim() || ''}`,

      }));

    } else {

      this.selectedBooks = [];

    }

  }
 
  // ================= DELETE =================
 
  deleteRecord(record: any) {

    const id = record.ISSUE_ID;
 
    if (!id) {

      alert('Delete ID not found!');

      return;

    }
 
    if (confirm('Are you sure you want to delete this record?')) {

      this.issueService.deleteIssue(id).subscribe({

        next: () => {

          // Remove only that row

          this.issuedRecords = this.issuedRecords.filter(

            r => r.ISSUE_ID !== id

          );

        },

        error: (err) => {

          console.error('Delete Error:', err);

          alert('Delete failed. Please try again.');

        },

      });

    }

  }
 
  // ================= FORMAT =================
 
  formatDate(dateStr: string): string {

    if (!dateStr) return '';

    const parts = dateStr.split(' ');

    return parts[0];

  }
 
  formatTime(dateStr: string): string {

    if (!dateStr) return '';

    const parts = dateStr.split(' ');

    return parts[1] + ' ' + (parts[2] || '');

  }
 
  // ================= RESET =================
 
  resetForm() {

    this.issueForm.reset();

    this.selectedBooks = [];

    this.editId = null;

    this.backendError = '';

  }

}
 