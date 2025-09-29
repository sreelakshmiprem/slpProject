import { Routes } from '@angular/router';
import { AddNewJobs } from './Admin/add-new-jobs/add-new-jobs';
import { LockedAccounts } from './Admin/locked-accounts/locked-accounts';
import { Submissions } from './Admin/submissions/submissions';
import { authGuard } from './auth.guard';
import { Chatbot } from './chatbot/chatbot';

import { DashBoard } from './dash-board/dash-board';
import { Forgetpassword } from './forgetpassword/forgetpassword';
import { LoginPage } from './login-page/login-page';
import { Registerpage } from './registerpage/registerpage';
import { ResetPassword } from './reset-password/reset-password';
import { UserDashBoard } from './user-dash-board/user-dash-board';
import { AppliedJobs } from './User/applied-jobs/applied-jobs';
import { UserApply } from './User/user-apply/user-apply';

export const routes: Routes = [
    { path: '', component: LoginPage },
    { path: 'login', component: LoginPage },
    { path: 'register', component: Registerpage },
    { path: 'requestResetpassword', component: ResetPassword },
    { path: 'forgetPassword', component: Forgetpassword },


    { path: 'Dashboard', component: DashBoard, canActivate: [authGuard] },
    { path: 'createJobs', component: AddNewJobs, canActivate: [authGuard] },
    { path: 'LockedAccounts', component: LockedAccounts, canActivate: [authGuard] },
    { path: 'applyJob', component: UserApply, canActivate: [authGuard] },
    { path: 'AppliedJobs', component: AppliedJobs, canActivate: [authGuard] },
    { path: 'UserApplications', component: Submissions, canActivate: [authGuard] },
    { path: 'userDashboard', component: UserDashBoard, canActivate: [authGuard] },
    { path: 'ChatBot', component: Chatbot, canActivate: [authGuard] },

];
