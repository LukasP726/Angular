import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateThreadComponent } from './features/create-thread/create-thread.component';



import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDataService } from './in-memory-data.service';


import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MessagesComponent } from './features/messages/messages.component';
import { LoginComponent } from './features/login/login.component';
import { SignComponent } from './features/sign/sign.component';
import { UserDetailComponent } from './features/user-detail/user-detail.component';
import { UsersComponent } from './features/users/users.component';
import { SearchComponent } from './features/search/search.component';
import { RoleComponent } from './features/role/role.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ThreadListComponent } from './features/thread-list/thread-list.component';
import { ThreadDetailComponent } from './features/thread-detail/thread-detail.component';
//import { CreatePostComponent } from "./create-post/create-post.component";
import { FileUploadComponent } from './features/file-upload/file-upload.component';
import { PostDetailComponent } from './features/post-detail/post-detail.component';
import { UserStatisticsComponent } from './features/user-statistics/user-statistics.component';
import { OrderByPipe } from './shared/pipes/order-by.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommandComponent } from './features/command/command.component';
import { ProfileDetailComponent } from './features/profile-detail/profile-detail.component';
import { SlideshowComponent } from './features/slideshow/slideshow.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    //CreatePostComponent,
    NgxPaginationModule,
  
   
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
    OrderByPipe,
    CommandComponent,
    ProfileDetailComponent,
    SlideshowComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
