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
import { UserSearchComponent } from './user-search/user-search.component';
import { RoleComponent } from './role/role.component';
import { ProfileComponent } from './profile/profile.component';
import { ThreadListComponent } from './thread-list/thread-list.component';
import { ThreadDetailComponent } from './thread-detail/thread-detail.component';
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    /*HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )*/
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    //HeroesComponent,
    //HeroDetailComponent,
    //HeroSearchComponent,
    UsersComponent,
    UserDetailComponent,
    UserSearchComponent,
    MessagesComponent,
    LoginComponent,
    SignComponent,
    RoleComponent,
    ProfileComponent,
    CreateThreadComponent,
    ThreadListComponent,
    ThreadDetailComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
