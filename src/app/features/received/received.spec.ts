import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Received } from './received';

describe('Received', () => {
  let component: Received;
  let fixture: ComponentFixture<Received>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Received]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Received);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
