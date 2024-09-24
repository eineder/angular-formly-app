import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CustomQueryBuilderComponent } from './custom-query-builder/custom-query-builder.component';
import { RepeatTypeComponent } from './repeat-section.type';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';
import { SearchService } from './services/search.service';

@NgModule({
  declarations: [
    AppComponent,
    CustomQueryBuilderComponent,
    RepeatTypeComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 500 }), // delay is optional
    FormlyModule.forRoot({
      types: [{ name: 'repeat', component: RepeatTypeComponent }],
    }),
    FormlyBootstrapModule,
  ],
  providers: [SearchService],
  bootstrap: [AppComponent],
})
export class AppModule {}
