import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Navigator } from 'src/app/util/navigator';
import { User } from '../../../model/user.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationAckDialogComponent } from '../../confirmation-ack-dialog/confirmation-ack-dialog.component';
import { StatusMessageService } from 'src/app/service/status-message.service';

export interface CustomBooleanArray {
	value: boolean;
	viewValue: string;
}

@Component({
	selector: 'app-address-form',
	templateUrl: './admin-form.component.html',
	styleUrls: ['./admin-form.component.scss'],
	providers: [Navigator]
})
export class AdminFormComponent implements OnInit, OnDestroy {
	boolean: CustomBooleanArray[] = [
		{ value: false, viewValue: 'False' },
		{ value: true, viewValue: 'True' }
	];

	form: FormGroup;
	private subscriptions = new Subscription();
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;

	FORM_TYPE = { CREATE: 0 };
	isCreateForm: boolean;
	user: User = new User();
	id: number;

	isSuperUserSelector = false;
	titleText: string;
	buttonText: string;

	constructor(
		private formBuilder: FormBuilder, private route: ActivatedRoute, private service: UserService,
		public navigator: Navigator, private statusMessageService: StatusMessageService
	) { }

	ngOnInit() {
		this.form = this.formBuilder.group({
			name: '',
			isSuperUser: ''
		});
		this.subscriptions.add(
			this.route.paramMap.subscribe(params => {
				this.id = parseInt(params.get('id'), 10);
				this.createForm(this.id);
			})
		);
	}

	createForm(id: number) {
		if (id === this.FORM_TYPE.CREATE) {
			this.isCreateForm = true;
			this.setCreateFormText();
		} else {
			this.isCreateForm = false;
			this.setEditFormText();
			const sub = this.service.getUserById(id).subscribe(user => {
				this.user = user;
				this.isSuperUserSelector = user.isSuperUser;
				this.form = this.formBuilder.group({
					name: user.name,
					isSuperUser: user.isSuperUser
				});
			});
			this.subscriptions.add(sub);
		}
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	onSubmit() {
		if (this.form.valid) {
			if (this.isCreateForm) {
				this.saveUser();
			} else {
				this.isLastSuperUser();
			}
		}
	}

	saveUser() {
		if (this.isCreateForm) {
			this.user = new User();
		}
		this.user.name = this.form.controls.name.value;
		this.user.isSuperUser = this.form.controls.isSuperUser.value;

		const sub = this.service.saveUser(this.user).subscribe(
			data => this.onSuccess(data),
			error => this.onError(error)
		);
		this.subscriptions.add(sub);

	}

	isLastSuperUser() {
		if (this.user.isSuperUser == true && this.form.controls.isSuperUser.value == false) {
			let users: User[];
			const sub = this.service.getAllUsers().subscribe(
				data => users = data,
				error => this.onError(error),
				() => {
					const superUsers = users.filter(x => x.isSuperUser == true);
					if (superUsers.length == 1) {
						this.statusMessageService.showErrorMessage('Cannot demote the last super user administatrator account.', 'Error');
					} else {
						this.saveUser();
					}
				}
			);
			this.subscriptions.add(sub);
		} else {
			this.saveUser();
		}
	}

	onSuccess(data: any) {
		this.form.reset();
		this.navigator.goToPage('/admin/admin-handler');
		let suffixText: string;
		(this.isCreateForm) ? suffixText = " was added" : suffixText = " was updated";
		this.statusMessageService.showSuccessMessage('success', data.name + suffixText);
	}

	onError(error) {
		if (error.status === 401) {
			this.statusMessageService.showErrorMessage('Not authorized. Please log in and try again', 'Error');
			this.navigator.goToPage('/login');
		} else if (error.status === 409) {
			this.statusMessageService.showErrorMessage('The name already exists as an admin.', 'Error');
		} else {
			throw (error);
		}
	}
	
	setCreateFormText() {
		this.titleText = 'Create Admin';
		this.buttonText = 'Create';
	}

	setEditFormText() {
		this.titleText = 'Edit Admin';
		this.buttonText = 'Save';
	}
}
