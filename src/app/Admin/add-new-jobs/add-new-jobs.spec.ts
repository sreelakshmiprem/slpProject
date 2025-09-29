import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewJobs } from './add-new-jobs';

describe('AddNewJobs', () => {
  let component: AddNewJobs;
  let fixture: ComponentFixture<AddNewJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewJobs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewJobs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
