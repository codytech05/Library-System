import { Component, OnInit } from '@angular/core';
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
})
export class Issue implements OnInit {
  // public logoPath = "/src/img/issue.png";

  issueForm!: FormGroup;
  allBooks: any[] = [];
  selectedBooks: any[] = [];
  issuedRecords: any[] = [];
  editId: any = null;
  isLoading: boolean = false;

  constructor(private issueService: IssueService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.issueForm = this.fb.group({
      readerName: ['', [Validators.required, Validators.minLength(3)]],
      readerMobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      readerAddress: ['', [Validators.required]],
      selectedBookId: [null],
    });

    this.getBooksList();
    this.fetchIssuedList();
  }

  // Dropdown mate books fetch karvi
  getBooksList() {
    this.issueService.getAllBooks().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : res.data;
        this.allBooks = data || [];
      },
      error: (err) => console.error('Books API Error', err),
    });
  }

  // Database mathi list fetch karvi
  fetchIssuedList() {
    this.issueService.getIssuedRecords().subscribe({
      next: (res: any) => {
        this.issuedRecords = Array.isArray(res) ? res : res.data;
      },
    });
  }

  // Selection logic for Books
  onBookSelect(event: any) {
    if (event && this.selectedBooks.length < 3) {
      if (!this.selectedBooks.find((b) => b.id === event.id)) {
        this.selectedBooks.push(event);
      } else {
        alert('Already selected!');
      }
      this.issueForm.get('selectedBookId')?.setValue(null);
    }
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
      BOOK_IDS: this.selectedBooks.map((b) => b.id),
    };

    this.issueService.saveIssueData(payload).subscribe({
      next: () => {
        alert(this.editId ? 'Updated!' : 'Saved!');
        this.fetchIssuedList();
        this.resetForm();
      },
      error: () => alert('Backend Error'),
    });
  }

  editRecord(record: any) {
    this.editId = record.ISSUE_ID;

    this.issueForm.patchValue({
      readerName: record.READER_NAME,
      readerMobile: record.READER_MOBILE_NO,
      readerAddress: record.ADDRESS,
    });

    this.selectedBooks = record.BOOK_IDS.map((id: number, index: number) => {
      return {
        id: id,
        label: record.BOOKS.split(',')[index]?.trim() || '',
      };
    });
  }

    deleteRecord(record: any) {
      const id = record.ISSUE_ID;

      if (!id) {
        alert('Delete ID not found!');
        return;
      }

      if (confirm('Are you sure?')) {
        this.issueService.deleteIssue(id).subscribe({
          next: () => this.fetchIssuedList(),
          error: (err) => console.log(err),
        });
      }
    }

  resetForm() {
    this.issueForm.reset();
    this.selectedBooks = [];
    this.editId = null;
  }
}
