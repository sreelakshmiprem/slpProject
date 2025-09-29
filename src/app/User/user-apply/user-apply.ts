import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../api-service';
import { Footer } from '../../DashBoardmaterials/footer/footer';
import { Header } from '../../DashBoardmaterials/header/header';
import { Sidebar } from '../../DashBoardmaterials/sidebar/sidebar';
import { DecodeAuth, UserInfo } from '../../decode-auth';

interface Job {
  jobId: number;
  jobTitle: string;
}

interface Skill {
  masterSkillId: number;
  skillName: string;
}

declare let toastr: any;

@Component({
  selector: 'app-user-apply',
  imports: [Header, Sidebar, Footer, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './user-apply.html',
  styleUrl: './user-apply.scss'
})
export class UserApply {
  applyForm!: FormGroup;
  resumeFile: File | null = null;
  isSubmitting = false;

  jobs: Job[] = [];
  masterSkills: Skill[] = [];

  constructor(private fb: FormBuilder, private api: ApiService, private auth: DecodeAuth, private router: Router) { }

  ngOnInit() {
    this.applyForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [{ value: this.auth.currentUser?.userName || '', disabled: true },
      [Validators.required, Validators.email]],
      yearsOfExperience: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      jobId: ['', Validators.required],
      skills: [[], Validators.required]
    });

    this.loadJobs();
    this.loadSkills();

    toastr.options = {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      timeOut: 3000
    };

  }

  loadJobs() {
    this.api.getAllJobs().subscribe(res => {
      this.jobs = res || [];
    });
  }

  loadSkills() {
    this.api.getMasterSkills().subscribe(res => {
      this.masterSkills = res || [];
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.resumeFile = event.target.files[0];
      console.log('Selected file:', this.resumeFile);
    }
  }

  onSkillToggle(skillId: number, event: any) {
    const selectedSkills: number[] = this.applyForm.get('skills')?.value || [];
    if (event.target.checked) {
      selectedSkills.push(skillId);
    } else {
      const index = selectedSkills.indexOf(skillId);
      if (index > -1) selectedSkills.splice(index, 1);
    }
    this.applyForm.get('skills')?.setValue(selectedSkills);
  }

  onSubmit() {
    if (!this.applyForm.valid || !this.resumeFile) {
      this.applyForm.markAllAsTouched(); //
      toastr.warning('Please fill all fields and upload resume.', 'Warning');
      return;
    }

    this.isSubmitting = true;
    const currentUserId = this.auth.currentUser.userId;
    if (!currentUserId) {
      toastr.error('User not logged in.', 'Error');
      this.isSubmitting = false;
      return;
    }


    const formData = new FormData();
    formData.append('FullName', this.applyForm.get('fullName')?.value);
    formData.append('Email', this.applyForm.get('email')?.value);
    formData.append('YearsOfExperience', this.applyForm.get('yearsOfExperience')?.value);
    formData.append('JobId', this.applyForm.get('jobId')?.value);
    formData.append('UserId', currentUserId);
    formData.append('ResumeFile', this.resumeFile, this.resumeFile.name);


    const skills: number[] = this.applyForm.get('skills')?.value || [];
    skills.forEach(skillId => {
      formData.append('UserSkillIds', skillId.toString());
    });

    this.api.createProfileAndApply(formData).subscribe({
      next: (res: any) => {
        toastr.success(res.message || 'Profile created and applied successfully!', 'Success');

        this.applyForm.reset();
        this.router.navigate(['/userDashboard'])
        this.resumeFile = null;
        this.isSubmitting = false;
      },
      error: err => {
        console.error(err);
        toastr.error(err?.error?.message || 'Deadline has passed and Failed to apply.', 'Error'); //Job application deadline has passed.
        this.isSubmitting = false;
      }
    });
  }
  removeSkill(skillId: number) {
    const selectedSkills: number[] = this.applyForm.get('skills')?.value || [];
    const updatedSkills = selectedSkills.filter(id => id !== skillId);
    this.applyForm.get('skills')?.setValue(updatedSkills);
  }
  getSkillName(skillId: number): string {
    const skill = this.masterSkills.find(s => s.masterSkillId === skillId);
    return skill ? skill.skillName : '';
  }

}
