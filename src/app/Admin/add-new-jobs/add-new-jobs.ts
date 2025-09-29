import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../api-service';
import { Footer } from '../../DashBoardmaterials/footer/footer';
import { Header } from '../../DashBoardmaterials/header/header';
import { Sidebar } from '../../DashBoardmaterials/sidebar/sidebar';

declare let toastr: any;

@Component({
  selector: 'app-add-new-jobs',
  imports: [Header, Sidebar, Footer, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-new-jobs.html',
  styleUrl: './add-new-jobs.scss'
})
export class AddNewJobs {
  jobForm!: FormGroup;
  submitted = false;
  masterSkills: any[] = [];
  todayDate: string = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) { }
  static minLessThanMaxValidator(minField: string, maxField: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const min = formGroup.get(minField)?.value;
      const max = formGroup.get(maxField)?.value;

      if (min !== null && max !== null && min >= max) {
        return { minGreaterThanMax: true };
      }
      return null;
    };
  }
  static deadlineAfterPostedValidator(today: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const deadline = formGroup.get('deadline')?.value;
      if (!deadline) return null;

      const deadlineDate = new Date(deadline);
      const todayDate = new Date(today);

      if (deadlineDate <= todayDate) {
        return { deadlineNotAfterPosted: true };
      }
      return null;
    };
  }
  atLeastOneSkillValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedSkills = control.value;
      return (Array.isArray(selectedSkills) && selectedSkills.length > 0)
        ? null
        : { noSkillSelected: true };
    };
  }


  ngOnInit(): void {
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      jobDescription: ['', Validators.required, Validators.maxLength(100)],
      minRequiredExperience: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      maxRequiredExperience: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      deadline: ['', Validators.required],
      jobLocation: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      requiredSkillIds: [[], [this.atLeastOneSkillValidator()]]


    },
      {
        validators: [
          AddNewJobs.minLessThanMaxValidator('minRequiredExperience', 'maxRequiredExperience'),
          AddNewJobs.deadlineAfterPostedValidator(this.todayDate)
        ]
      }
    );

    this.api.getMasterSkills().subscribe({
      next: (res) => {
        console.log('Master skills loaded:', res);
        this.masterSkills = res;
      },
      error: (err) => console.error('Error fetching master skills', err)
    });
  }

  onCheckboxChange(skillId: number, event: any) {
    const selected: number[] = this.jobForm.value.requiredSkillIds || [];
    if (event.target.checked) {
      if (!selected.includes(skillId)) {
        selected.push(skillId);
      }
    } else {
      const index = selected.indexOf(skillId);
      if (index > -1) selected.splice(index, 1);
    }
    this.jobForm.patchValue({ requiredSkillIds: selected });
  }

  onSubmit() {
    this.submitted = true;
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      toastr.warning('Please fill all required fields', 'Warning');
      return;
    }

    const deadlineDate = new Date(this.jobForm.value.deadline);
    if (deadlineDate <= new Date(this.todayDate)) {
      toastr.warning('Deadline must be greater than posted date', 'Warning');
      return;
    }

    const jobData = {
      ...this.jobForm.value,
      deadline: new Date(this.jobForm.value.deadline).toISOString(),
      postedDate: new Date().toISOString()
    };

    this.api.AddJobWithSkills(jobData).subscribe({
      next: () => {
        toastr.success('Job added successfully!', 'Success');
        this.jobForm.reset();
        this.router.navigate(['/Dashboard']);
      },
      error: (err) => {
        console.error('Error adding job:', err);
        toastr.error('Failed to add job', 'Error');
      }
    });
  }
}