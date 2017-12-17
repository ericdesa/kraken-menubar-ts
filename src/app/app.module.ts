// angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// app
import { AppComponent } from './app.component';

// pages
import { HomePageComponent } from './pages/home/home.page.component';
import { SetupPageComponent } from 'app/pages/setup/setup.page.component';

// services
import { KrakenService } from 'app/services/kraken/kraken.service';
import { PreferencesService } from 'app/services/preferences/preferences.service';

// libs

@NgModule({
    declarations: [
        // app
        AppComponent,

        // pages
        HomePageComponent,
    ],

    imports: [
        // angular
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,

    ],

    providers: [
        // app
        KrakenService,
        PreferencesService,
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }

