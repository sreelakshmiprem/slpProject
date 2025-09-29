import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApply } from './user-apply';

describe('UserApply', () => {
  let component: UserApply;
  let fixture: ComponentFixture<UserApply>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserApply]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserApply);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
