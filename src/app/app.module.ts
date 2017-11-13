// angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

// pages
import { HomePageComponent } from './pages/home/home.page.component';
import { SetupPageComponent } from 'app/pages/setup/setup.page.component';

// services
import { KrakenService } from 'app/services/kraken/kraken.service';

// libs
import { MatButtonModule, MatInputModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
    { path: 'setup', component: SetupPageComponent },
    { path: '**', component: HomePageComponent },
];

@NgModule({
    declarations: [
        AppComponent,

        // pages
        HomePageComponent,
        SetupPageComponent,
    ],
    imports: [
        // angular
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(appRoutes),
        HttpClientModule,

        // Angular Material
        MatButtonModule,
        MatInputModule,
        MatToolbarModule,
        MatMenuModule
    ],
    entryComponents: [
    ],
    providers: [
        KrakenService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

