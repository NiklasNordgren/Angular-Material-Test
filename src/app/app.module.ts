import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
	HammerGestureConfig,
	HAMMER_GESTURE_CONFIG
} from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule, MatCheckboxModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { FileUploadComponent } from './component/file-upload/file-upload.component';
import { SelectExamPropertiesComponent } from './component/select-exam-properties/select-exam-properties.component';
import { FileUploadModule } from 'ng2-file-upload';
import { OutboxComponent } from './component/outbox/outbox.component';
import { ConfirmationDialogComponent } from './component/confirmation-dialog/confirmation-dialog.component';
import { NavComponent } from './nav/nav.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { TableComponent } from './component/table/table.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TreeComponent } from './tree/tree.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { TestSwipeComponent } from './component/test-swipe/test-swipe.component';
import { AdminHandlerComponent } from "./component/admin-handler/admin-handler.component";
import { NavHorizComponent } from './nav-horiz/nav-horiz.component';
import { ListComponent } from './component/list/list.component';
import { AcademyComponent } from './component/academy/academy.component';
import { SubjectComponent } from './component/subject/subject.component';
import { CourseComponent } from './component/course/course.component';
import { ExamComponent } from './component/exam/exam.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './component/login/login.component';
import { AcademyHandlerComponent } from './component/academy-handler/academy-handler.component';
import { SubjectHandlerComponent } from './component/subject-handler/subject-handler.component';
import { CourseHandlerComponent } from './component/course-handler/course-handler.component';
import { ExamHandlerComponent } from './component/exam-handler/exam-handler.component';
import { AcademyFormComponent } from './component/academy-form/academy-form.component';
import { SearchResultComponent } from './component/search-result/search-result.component';
import { SearchComponent } from './component/search/search.component';
import { AdminFormComponent } from './component/admin-form/admin-form.component';
import { SubjectFormComponent } from './component/subject-form/subject-form.component';
import { ExamFormComponent } from './component/exam-form/exam-form.component';
import { AdminGuard } from './guard/admin.guard';
import { CourseFormComponent } from './component/course-form/course-form.component';
import { SettingsComponent } from './component/settings/settings.component';
import { ConfirmationAckDialogComponent } from './component/confirmation-ack-dialog/confirmation-ack-dialog.component';

@NgModule({
	declarations: [
		AppComponent,
		NavComponent,
		AddressFormComponent,
		TableComponent,
		DashboardComponent,
		TreeComponent,
		DragDropComponent,
		LoginComponent,
		HomeComponent,
		LogoutComponent,
		FileUploadComponent,
		NavHorizComponent,
		ListComponent,
		AcademyComponent,
		SubjectComponent,
		CourseComponent,
		ExamComponent,
		AboutComponent,
		AdminHandlerComponent,
		AcademyHandlerComponent,
		SubjectHandlerComponent,
		CourseHandlerComponent,
		ExamHandlerComponent,
		AcademyFormComponent,
		SelectExamPropertiesComponent,
		OutboxComponent,
		ConfirmationDialogComponent,
		TestSwipeComponent,
		SearchResultComponent,
		SearchComponent,
		AdminFormComponent,
		SubjectFormComponent,
		ExamFormComponent,
		CourseFormComponent,
		SettingsComponent,
		ConfirmationAckDialogComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatSliderModule,
		LayoutModule,
		MatButtonModule,
		MatSidenavModule,
		MatIconModule,
		MatTooltipModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatSelectModule,
		MatRadioModule,
		MatCardModule,
		ReactiveFormsModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatGridListModule,
		MatMenuModule,
		MatTreeModule,
		MatProgressBarModule,
		DragDropModule,
		FileUploadModule,
		FontAwesomeModule,
		FlexLayoutModule,
		FormsModule,
		MatCheckboxModule,
		MatToolbarModule,
		MatListModule,
		MatDatepickerModule,
		MatDialogModule,
		MatTabsModule
	],
	entryComponents: [ConfirmationDialogComponent, ConfirmationAckDialogComponent],
	providers: [
		AdminGuard,
		{ provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
