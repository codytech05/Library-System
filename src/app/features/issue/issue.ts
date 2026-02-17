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

  constructor(
    private issueService: IssueService,
    private fb: FormBuilder,
  ) {}

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

  //  isLoading set karyel + label properly set karyel
  getBooksList() {
    this.isLoading = true;
    this.issueService.getAllBooks().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : res.data;
        this.allBooks = data || [];
        this.isLoading = false;
        // console.log('Original First Book:', this.allBooks[0]);
      },
      error: (err) => {
        console.error('Books API Error', err);
        this.isLoading = false;
      },
    });
  }

  //  error handler add karyel
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

  //  event.ID check + proper label set
  onBookSelect(event: any) {
    if (!event) return;

    const bookId = event.id;
    const bookLabel = event.label;
    const alreadyAdded = this.selectedBooks.find((b) => b.id === bookId);

    if (alreadyAdded) {
      alert('This book is already selected!');
    } else if (this.selectedBooks.length < 3) {
      this.selectedBooks.push({
        id: bookId,
        label: bookLabel, // ✅ direct label use karo
      });
    }

    this.issueForm.get('selectedBookId')?.setValue(null);
  }

  removeBook(index: number) {
    this.selectedBooks.splice(index, 1);
  }

  saveIssue() {
    if (this.issueForm.invalid || this.selectedBooks.length === 0) {
      this.issueForm.markAllAsTouched();
      return;
    }

    const payload = {
      ISSUE_ID: this.editId,
      READER_NAME: this.issueForm.value.readerName,
      READER_MOBILE_NO: this.issueForm.value.readerMobile,
      ADDRESS: this.issueForm.value.readerAddress,
      BOOK_IDS: this.selectedBooks.map((b) => b.id || b.ID),
    };

    this.issueService.saveIssueData(payload).subscribe({
      next: () => {
        alert(this.editId ? 'Record Updated!' : 'Record Saved!');
        this.fetchIssuedList();
        this.resetForm();
      },
      error: (err) => {
        console.error('Save Error:', err);
        alert('Something went wrong. Please try again.');
      },
    });
  }

  // BOOK_IDS undefined hoy to crash na thay
  editRecord(record: any) {
    this.editId = record.ISSUE_ID;

    this.issueForm.patchValue({
      readerName: record.READER_NAME,
      readerMobile: record.READER_MOBILE_NO,
      readerAddress: record.ADDRESS,
    });

    //BOOK_IDS exist kare to j map karo
    if (record.BOOK_IDS && Array.isArray(record.BOOK_IDS)) {
      const bookNames = record.BOOKS ? record.BOOKS.split(',') : [];
      this.selectedBooks = record.BOOK_IDS.map((id: number, index: number) => ({
        id: id,
        ID: id,
        label: `${id} - ${bookNames[index]?.trim() || 'Book ' + (index + 1)}`,
      }));
    } else {
      this.selectedBooks = [];
    }
  }

  deleteRecord(record: any) {
    const id = record.ISSUE_ID;

    if (!id) {
      alert('Delete ID not found!');
      return;
    }

    if (confirm('Are you sure you want to delete this record?')) {
      this.issueService.deleteIssue(id).subscribe({
        next: () => {
          alert('Record deleted!');
          this.fetchIssuedList();
        },
        error: (err) => {
          console.error('Delete Error:', err);
          alert('Delete failed. Please try again.');
        },
      });
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split(' ');
    return parts[0]; // sirf date return karo
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split(' ');
    return parts[1] + ' ' + (parts[2] || ''); // time return karo
  }

  resetForm() {
    this.issueForm.reset();
    this.selectedBooks = [];
    this.editId = null;
  }
}
