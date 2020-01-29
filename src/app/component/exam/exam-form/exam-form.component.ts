import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Navigator } from 'src/app/util/navigator';
import { Exam } from '../../../model/exam.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../service/exam.service';
import { CourseService } from 'src/app/service/course.service';
import { Course } from 'src/app/model/course.model';
import { ConfirmationAckDialogComponent } from '../../confirmation-ack-dialog/confirmation-ack-dialog.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { StatusMessageService } from 'src/app/service/status-message.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface CustomBooleanArray {
	value: boolean;
	viewValue: string;
}

@Component({
	selector: 'app-address-form',
	templateUrl: './exam-form.component.html',
	styleUrls: ['./exam-form.component.scss'],
	providers: [Navigator]
})
export class ExamFormComponent implements OnInit, OnDestroy {

	dialogRef: MatDialogRef<ConfirmationDialogComponent>;

	form: FormGroup;
	subscriptions: Subscription = new Subscription();

	createFormId: number = 0;
	exam: Exam = new Exam();
	id: number;

	isUnpublishedSelector = false;
	courses: Course[];

	constructor(
		private formBuilder: FormBuilder, 
		private route: ActivatedRoute, 
		private service: ExamService, 
		private courseService: CourseService,
		public navigator: Navigator, 
		private dialog: MatDialog,
		private statusMessageService: StatusMessageService
	) { }

	ngOnInit() {
		this.form = this.formBuilder.group({
			filename: '',
			date: '',
			unpublishDate: '',
			course: ''
		});

		const sub = this.courseService.getAllCourses().subscribe(responseResult => {
			this.courses = responseResult;
		});
		this.subscriptions.add(
			this.route.paramMap.subscribe(params => {
				this.id = parseInt(params.get('id'), 10);
				this.handleId(this.id);
			})
		);
	}

	handleId(id: number) {
		const sub = this.service.getExamById(id).subscribe(exam => {
			this.exam = exam;
			this.isUnpublishedSelector = exam.unpublished;
			this.form = this.formBuilder.group({
				filename: exam.filename,
				date: exam.date,
				unpublishDate: exam.unpublishDate,
				course: exam.courseId
			});
		});
		this.subscriptions.add(sub);

	}
	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	onSubmit() {
		if (this.form.valid) {
			this.exam.filename = this.form.controls.filename.value;
			this.exam.date = this.form.controls.date.value;
			this.exam.unpublishDate = this.form.controls.unpublishDate.value;
			this.exam.courseId = this.form.controls.course.value;

			const sub = this.service.saveExam(this.exam).subscribe(
				data => this.onSuccess(data),
				error => this.onError(error)
			);
			this.subscriptions.add(sub);
		}
	}

	onSuccess(data: any) {
		this.form.reset();
		this.navigator.goToPage('/admin/exam-handler');
		this.statusMessageService.showSuccessMessage(data.name + " was " + 
			((this.id == this.createFormId) ? "created" : "updated"));
	}

	onError(error: HttpErrorResponse) {
		if (error.status === 401) {
			this.statusMessageService.showErrorMessage('Not authorized. Please log in and try again', 'Error');
			this.navigator.goToPage('/login');	
		} else {
			throw(error);
		}
	}

	openAcknowledgeDialog(erorrMessage: string, typeText: string) {
		this.dialogRef = this.dialog.open(ConfirmationAckDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = typeText;
		this.dialogRef.componentInstance.contentMessage = erorrMessage;

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			this.dialogRef = null;
		});
		
		this.subscriptions.add(sub);
	}
}
