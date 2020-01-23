import { Component, OnInit, OnDestroy } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { Subscription, from } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { Subject } from 'src/app/model/subject.model';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SelectionModel } from '@angular/cdk/collections';
import { Course } from 'src/app/model/course.model';
import { CourseService } from 'src/app/service/course.service';
import { Navigator } from 'src/app/util/navigator';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationAckDialogComponent } from '../../confirmation-ack-dialog/confirmation-ack-dialog.component';

@Component({
	selector: 'app-course-handler',
	templateUrl: 'course-handler.component.html',
	styleUrls: ['course-handler.component.scss'],
	providers: [Navigator]
})
export class CourseHandlerComponent implements OnInit, OnDestroy {
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;
	subscriptions: Subscription = new Subscription();
	displayedColumns: string[] = ['select', 'name', 'edit'];
	academies = [];
	subjects = [];
	courses = [];
	dataSource = [];
	// dataSource = new MatTableDataSource<any>(this.subjects);
	selection = new SelectionModel<Course>(true, []);
	faPlus = faPlus;
	faPen = faPen;
	faTrash = faTrash;
	public selectedAcademyValue: number;
	public selectedSubjectValue: number;

  constructor(private academyService: AcademyService, private subjectService: SubjectService,
    private courseService: CourseService, private navigator: Navigator, private dialog: MatDialog){}
	ngOnInit() {
		this.dataSource = [];
		const sub = this.academyService
			.getAllAcademies()
			.subscribe(responseAcademies => {
				this.academies = responseAcademies;
				this.selectedAcademyValue = this.academies[0].id;
				this.selectedAcademy(this.selectedAcademyValue);
			});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	selectedAcademy(academyId: number) {
		const sub = this.subjectService
			.getAllSubjectsByAcademyId(academyId)
			.subscribe(responseSubjects => {
				this.subjects = responseSubjects;
				this.selectedSubjectValue = this.subjects[0].id;
				this.selectedSubject(this.selectedSubjectValue);
			});
		this.subscriptions.add(sub);
	}

	selectedSubject(subjectId: number) {
		const sub = this.courseService
			.getAllCoursesBySubjectId(subjectId)
			.subscribe(responseCourses => {
				this.courses = responseCourses;
				this.dataSource = this.courses;
			});
		this.subscriptions.add(sub);
	}

	// For the checkboxes
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.length;
		return numSelected === numRows;
	}
	// Selects all rows if they are not all selected; otherwise clear selection.
	masterToggle() {
		this.isAllSelected()
			? this.selection.clear()
			: this.dataSource.forEach(row => this.selection.select(row));
	}
	unpublishSelection() {
		const sub = this.courseService
			.unpublishCourses(this.selection.selected)
			.subscribe(
				data => this.onSuccess(data),
				error => this.onError(error)
			);
		this.subscriptions.add(sub);
	}
	onSuccess(data) {
		this.showDialog('Success','Successfully unpublished selected courses');
	}
	onError(error) {
		this.showDialog('Error', 'Something went wrong wile trying to unpublish courses.');
	}
	
	showDialog(header: string, message: string){
		this.dialogRef = this.dialog.open(ConfirmationAckDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = header;
		this.dialogRef.componentInstance.contentMessage = message;

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}
}