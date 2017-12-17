import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {

    public notificationsOptions = {
        position: ['bottom', 'center'],
        timeOut: 5000,
        lastOnBottom: true,
        showProgressBar: false,
        pauseOnHover: false,
        clickToClose: true,
        animate: 'fromBottom',
    };
}
