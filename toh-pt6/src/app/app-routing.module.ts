import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { SignComponent } from './sign/sign.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { CreateThreadComponent } from './create-thread/create-thread.component';
import { ThreadDetailComponent } from './thread-detail/thread-detail.component';
import { ThreadListComponent } from './thread-list/thread-list.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
//import { adminGuard } from './admin.guard';
//import { editorGuard } from './editor.guard';
//import { superAdminGuard } from './super-admin.guard';
import { CommandComponent } from './command/command.component';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';

import { superAdminGuard, adminGuard, editorGuard } from './create-role.guard';  // Import specifických guardů
import { SearchComponent } from './search/search.component';

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
  

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
