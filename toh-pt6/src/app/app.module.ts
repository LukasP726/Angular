import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateThreadComponent } from './create-thread/create-thread.component';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDataService } from './in-memory-data.service';


import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MessagesComponent } from './messages/messages.component';
import { LoginComponent } from './login/login.component';
import { SignComponent } from './sign/sign.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UsersComponent } from './users/users.component';
import { SearchComponent } from './search/search.component';
import { RoleComponent } from './role/role.component';
import { ProfileComponent } from './profile/profile.component';
import { ThreadListComponent } from './thread-list/thread-list.component';
import { ThreadDetailComponent } from './thread-detail/thread-detail.component';
import { CreatePostComponent } from "./create-post/create-post.component";
import { FileUploadComponent } from './file-upload/file-upload.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CreatePostComponent
],
  declarations: [
    AppComponent,
    DashboardComponent,
    //HeroesComponent,
    //HeroDetailComponent,
    //HeroSearchComponent,
    UsersComponent,
    UserDetailComponent,
    SearchComponent,
    MessagesComponent,
    LoginComponent,
    SignComponent,
    RoleComponent,
    ProfileComponent,
    CreateThreadComponent,
    ThreadListComponent,
    ThreadDetailComponent,
    PostDetailComponent,
    FileUploadComponent,
    UserStatisticsComponent,
    ThreadDetailComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
