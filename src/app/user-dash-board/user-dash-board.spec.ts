import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashBoard } from './user-dash-board';

describe('UserDashBoard', () => {
  let component: UserDashBoard;
  let fixture: ComponentFixture<UserDashBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDashBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDashBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
