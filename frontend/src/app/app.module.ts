import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './views/signin/signin.component';
import { ChatComponent } from './views/chat/chat.component';
import { ChatRowComponent } from './components/chat-row/chat-row.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { MessageComponent } from './components/message/message.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { LazyImageLoadingDirective } from './directives/lazy-image-loading.directive';
import { NotificationsPanelComponent } from './components/notifications-panel/notifications-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    ChatComponent,
    ChatRowComponent,
    DropdownComponent,
    MessageComponent,
    SettingsPanelComponent,
    LazyImageLoadingDirective,
    NotificationsPanelComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
