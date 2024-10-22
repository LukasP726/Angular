import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UsersComponent } from './features/users/users.component';
import { LoginComponent } from './features/login/login.component';
import { SignComponent } from './features/sign/sign.component';
import { UserDetailComponent } from './features/user-detail/user-detail.component';
import { ProfileComponent } from './features/profile/profile.component';
import { FileUploadComponent } from './features/file-upload/file-upload.component';
import { CreateThreadComponent } from './features/create-thread/create-thread.component';
import { ThreadDetailComponent } from './features/thread-detail/thread-detail.component';
import { ThreadListComponent } from './features/thread-list/thread-list.component';
import { PostDetailComponent } from './features/post-detail/post-detail.component';
import { UserStatisticsComponent } from './features/user-statistics/user-statistics.component';
import { AddUserComponent } from './features/add-user/add-user.component';
import { CommandComponent } from './features/command/command.component';
import { ProfileDetailComponent } from './features/profile-detail/profile-detail.component';

import { superAdminGuard, adminGuard, editorGuard } from './core/guards/create-role.guard';  // Import specifických guardů
import { SearchComponent } from './features/search/search.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: UserDetailComponent, canActivate: [adminGuard]},
  { path: 'users', component: UsersComponent, canActivate: [adminGuard]},//superAdminGuard
  { path: 'login', component: LoginComponent},
  { path: 'sign', component: SignComponent},
  { path: 'profile', component: ProfileComponent, canActivate: [editorGuard]},
  { path: 'profile/:id', component: ProfileDetailComponent, canActivate: [editorGuard]},
  { path: 'upload', component: FileUploadComponent, canActivate: [editorGuard]},
  { path: 'create-thread', component: CreateThreadComponent,canActivate: [editorGuard] },
  { path: 'threads/:id', component: ThreadDetailComponent },
  { path: 'statistics/:id', component: UserStatisticsComponent },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: 'thread-list', component: ThreadListComponent ,canActivate: [editorGuard]},
  { path: 'rce', component: CommandComponent,canActivate: [superAdminGuard] },//superAdminGuard
  { path: 'search', component: SearchComponent},
  { path: 'add-user', component: AddUserComponent, canActivate: [superAdminGuard]},
  

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
