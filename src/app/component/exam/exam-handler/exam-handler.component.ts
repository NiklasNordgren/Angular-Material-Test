import { Component, ChangeDetectorRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Navigator } from 'src/app/util/navigator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import {
	faPlus,
	faUsersCog,
	faSearch,
	faPen,
	faTrash,
	faScroll,
} from '@fortawesome/free-solid-svg-icons';
import { ExamService } from '../../../service/exam.service';
import { Exam } from '../../../model/exam.model';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { CourseService } from 'src/app/service/course.service';
import { AcademyService } from 'src/app/service/academy.service';
import { SubjectService } from 'src/app/service/subject.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessageService } from 'src/app/service/status-message.service';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
	selector: 'app-exam-handler',
	templateUrl: './exam-handler.component.html',
	styleUrls: ['./exam-handler.component.scss'],
	providers: [Navigator]
})
export class ExamHandlerComponent implements OnInit, OnDestroy {
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	subscriptions: Subscription = new Subscription();
	faPlus = faPlus;
	faUsersCog = faUsersCog;
	faSearch = faSearch;
	faScroll = faScroll;

	selection = new SelectionModel<Exam>(true, []);
	faPen = faPen;
	faTrash = faTrash;

	academies = [];
	subjects = [];
	courses = [];
	examSource = new MatTableDataSource<Exam>();

	public selectedAcademyValue: number;
	public selectedSubjectValue: number;
	public selectedCourseValue: number;

	isUnpublishButtonDisabled = true;
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;
	displayedColumns: string[] = [
		'select',
		'filename',
		'date',
		'unpublishDate',
		'edit'
	];

	constructor(
		private examService: ExamService,
		private courseService: CourseService,
		private subjectService: SubjectService,
		private academyService: AcademyService,
		public navigator: Navigator,
		private dialog: MatDialog,
		private statusMessageService: StatusMessageService
	) { }

	ngOnInit() {
		this.examSource.sort = this.sort;
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
				if (this.subjects.length > 0) {
					this.selectedSubjectValue = this.subjects[0].id;
					this.selectedSubject(this.selectedSubjectValue);
				} else {
					this.selectedSubjectValue = 0;
					this.selectedSubject(this.selectedSubjectValue);
				}
			});
		this.subscriptions.add(sub);
	}


	selectedSubject(id: number) {
		const sub = this.courseService.getAllCoursesBySubjectId(id).subscribe(responseResult => {
			this.courses = responseResult;
			if (this.courses.length > 0) {
				this.selectedCourseValue = this.courses[0].id;
				this.selectedCourse(this.selectedCourseValue);
			} else {
				this.selectedCourseValue = 0;
				this.selectedCourse(this.selectedCourseValue);
			}

		});
		this.subscriptions.add(sub);
	}

	selectedCourse(id: number) {
		const sub = this.examService.getAllExamsByCourseId(id).subscribe(responseResult => {
			this.examSource.data = responseResult;
		});
		this.subscriptions.add(sub);
	}

	openDialog() {

		this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = 'Confirm';
		this.dialogRef.componentInstance.contentMessage = this.makeContentText();
		this.dialogRef.componentInstance.confirmBtnText = "unpublish";

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				const selectedExams = this.selection.selected;
				const isUnpublished = true;
				this.subscriptions.add(
					this.examService.publishExams(selectedExams, isUnpublished).subscribe(
						data => this.onSuccess(data),
						error => this.onError(error)
					)
				);
			}
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}

	onSuccess(data: any) {
		const selectedExams = this.selection.selected;
		for (let exam of selectedExams) {
			this.examSource.data = this.examSource.data.filter(x => x.id != exam.id);
		}
		const successfulAmount = data.length;
		let successfulContentText = (successfulAmount !== 0) ? successfulAmount + ((successfulAmount == 1) ? " exam" : " exams") : "";
		let successfulServiceText = (successfulContentText.length !== 0) ? " got unpublished" : "";
		successfulServiceText = successfulContentText.concat(successfulServiceText);
		this.statusMessageService.showSuccessMessage(successfulServiceText);
		this.selection.clear();
		this.isAnyCheckboxSelected();
	}

	onError(error: HttpErrorResponse) {
		this.statusMessageService.showErrorMessage("Error", "Something went wrong\nError: " + error.statusText);
	}

	makeContentText() {
		const numberOfSelected = this.selection.selected.length;
		let serviceText = "Are you sure you want to unpublish" + "\n\n";
		let contentText = (numberOfSelected == 1) ? this.selection.selected[0].filename : numberOfSelected + " exams";

		return serviceText = serviceText.concat(contentText);
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.examSource.data.length;
		return numSelected === numRows;
	}

	convertToDate(date: Array<number>) {
		if (date.length >= 3)
			return date[0] + '-' + date[1] + '-' + date[2];
		else
			return 'No date avalible';
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ? this.selection.clear() : this.examSource.data.forEach(row => this.selection.select(row));
	}

	isAnyCheckboxSelected() {
		(this.selection.selected.length !== 0) ? this.isUnpublishButtonDisabled = false : this.isUnpublishButtonDisabled = true;
	}
}
