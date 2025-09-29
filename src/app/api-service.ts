import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }


  register(data: { userName: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}api/User/register`, data, {
      withCredentials: true
    });
  }

  login(data: { userName: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}api/User/login`, data, {
      withCredentials: true
    });
  }

  resetRequest(data: { userName: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}api/User/request-reset-password`, data, {
      withCredentials: true
    })
  }

  resetPassword(data: { userName: string; newPassword: string; newConfirmPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}api/User/reset-password`, data, {
      withCredentials: true
    });
  }

  logout(userName: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}api/User/logout`,
      `"${userName}"`,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
  }


  getMyMenus(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/User/my-menus`, {
      withCredentials: true
    });
  }

  getMasterSkills(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Job/MasterSkills`, {
      withCredentials: true
    });
  }

  addUserSkills(userId: number, skills: number[]): Observable<any> {
    return this.http.post(
      `${this.baseUrl}api/Job/AdduserSkills?userId=${userId}`,
      skills,
      { withCredentials: true }
    );
  }

  applyForJob(userId: number, jobId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}api/Job/Apply?userId=${userId}&jobId=${jobId}`,
      {},
      { withCredentials: true }
    );
  }

  getAllJobs(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Job/GetAllJobs`, {
      withCredentials: true
    });
  }

  getJobById(jobId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Job/GetJobById?id=${jobId}`, {
      withCredentials: true
    });
  }

  addNewJob(jobData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}api/Job/AddNewJobs`, jobData, {
      withCredentials: true
    });
  }

  AddJobWithSkills(jobData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}api/Job/AddJobWithSkills`, jobData, {
      withCredentials: true
    });
  }

  unlockAccount(userName: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}api/User/Unlock-lockedAccount`,
      `"${userName}"`,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );
  }

  getLockedAccounts(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/User/LockedAccounts`, {
      withCredentials: true
    });
  }

  createProfileAndApply(formData: FormData) {
    return this.http.post(
      `${this.baseUrl}api/Job/CreateProfileAndApply`,
      formData,
      { withCredentials: true }
    )
  };

  UserAppliedJobs(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}api/Job/GetUserAppliedJobs?userId=${userId}`,
      { withCredentials: true }
    )
  };

  downloadResume(userId: number): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}api/Job/View-resume?userId=${userId}`,
      {
        responseType: 'blob',
        withCredentials: true
      }
    );
  }

  updateTheStatus(applicationId: number, newStatus: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}api/Job/UpdateStatus?applicationId=${applicationId}`,
      newStatus,
      { withCredentials: true }
    );
  }

  GetAllSubmission(jobId?: number, jobTitle?: string): Observable<any> {
    let params = new HttpParams();

    if (jobId) {
      params = params.set('jobId', jobId.toString());
    }

    if (jobTitle) {
      params = params.set('jobTitle', jobTitle);
    }

    return this.http.get(`${this.baseUrl}api/Job/GetAllSubmissions`, {
      params,
      withCredentials: true
    });
  }

  JobDetailsForDashBoard(jobId?: number): Observable<any> {
    const Id = jobId ? `${this.baseUrl}api/Job/jobDetailsForDashboard?jobId=${jobId}`
      : `${this.baseUrl}api/Job/jobDetailsForDashboard`;
    return this.http.get(Id, { withCredentials: true });
  }
}
