import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddressFormComponent } from "./address-form/address-form.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DragDropComponent } from "./drag-drop/drag-drop.component";
import { TableComponent } from "./component/table/table.component";
import { TreeComponent } from "./tree/tree.component";
import { HomeComponent } from "./home/home.component";
import { FileUploadComponent } from "./component/file-upload/file-upload.component";
import { AcademyComponent } from "./component/academy/academy.component";
import { AdminComponent } from "./admin/admin.component";
import { Academy } from "./model/academy.model";
import { CourseComponent } from "./component/course/course.component";
import { Course } from "./model/course.model";
import { Subject } from "rxjs";
import { SubjectComponent } from "./component/subject/subject.component";
import { Exam } from "./model/exam.model";
import { ExamComponent } from "./component/exam/exam.component";
import { AboutComponent } from "./about/about.component";
import { LoginComponent } from "./component/login/login.component";
import { AcademyHandlerComponent } from "./component/academy-handler/academy-handler.component";
import { SubjectHandlerComponent } from "./component/subject-handler/subject-handler.component";
import { CourseHandlerComponent } from "./component/course-handler/course-handler.component";
import { ExamHandlerComponent } from "./component/exam-handler/exam-handler.component";
import { AcademyFormComponent } from "./component/academy-form/academy-form.component";
import { OutboxComponent } from "./component/outbox/outbox.component";
import { TestSwipeComponent } from "./component/test-swipe/test-swipe.component";
import { AdminGuard } from "./guard/admin.guard";
import { SearchResultComponent } from "./component/search-result/search-result.component";
import { CourseFormComponent } from "./component/course-form/course-form.component";
import { SubjectFormComponent } from "./component/subject-form/subject-form.component";
import { ExamFormComponent } from "./component/exam-form/exam-form.component";
import { AdminFormComponent } from "./admin-form/admin-form.component";
import { SettingsComponent } from "./component/settings/settings.component";

const routes: Routes = [
	{
		path: "",
		redirectTo: "academy",
		pathMatch: "full"
	},
	{
		path: "login",
		component: LoginComponent
	},
	{
		path: "about",
		component: AboutComponent
	},
	{
		path: "academy",
		component: AcademyComponent,
		data: Academy
	},
	{
		path: "search/:searchString",
		component: SearchResultComponent,
		data: String
	},
	{
		path: "subjects/academy/:id",
		component: SubjectComponent,
		data: Subject
	},
	{
		path: "courses/subject/:id",
		component: CourseComponent,
		data: Course
	},
	{
		path: "exams/course/:id",
		component: ExamComponent,
		data: Exam
	},
	{
		path: "home",
		component: HomeComponent,
		canActivate: [AdminGuard],
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "dashboard"
			},
			{
				path: "settings",
				component: SettingsComponent
			},
			{
				path: "academy-handler",
				component: AcademyHandlerComponent
			},
			{
				path: "academy-form/:id",
				component: AcademyFormComponent
			},
			{
				path: "subject-handler",
				component: SubjectHandlerComponent
			},
			{
				path: "course-handler",
				component: CourseHandlerComponent
			},
			{
				path: "subject-form/:id",
				component: SubjectFormComponent
			},
			{
				path: "course-handler",
				component: CourseHandlerComponent
			},
			{
				path: "course-form/:id",
				component: CourseFormComponent
			},
			{
				path: "exam-handler",
				component: ExamHandlerComponent
			},
			{
				path: "exam-form/:id",
				component: ExamFormComponent
			},
			{
				path: "admin-form/:id",
				component: AdminFormComponent
			},
			{
				path: "address-form",
				component: AddressFormComponent
			},
			{
				path: "dashboard",
				component: DashboardComponent
			},
			{
				path: "drag-drop",
				component: DragDropComponent
			},
			{
				path: "table",
				component: TableComponent
			},
			{
				path: "tree",
				component: TreeComponent
			},
			{
				path: "file-upload",
				component: FileUploadComponent
			},
			{
				path: "admin",
				component: AdminComponent
			},
			{
				path: "outbox",
				component: OutboxComponent
			},
			{
				path: "swipe",
				component: TestSwipeComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
