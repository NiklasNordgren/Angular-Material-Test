import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { shareReplay, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AcademyService } from '../../service/academy.service';
import { Academy } from '../../model/academy.model';
import { faUsersCog, faUpload, IconDefinition, faCog, faTrash,
	faScroll, faBook, faBookOpen, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../service/user.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	faUsersCog: IconDefinition = faUsersCog;
	faUpload: IconDefinition = faUpload;
	faCog: IconDefinition = faCog;
	faTrash: IconDefinition = faTrash;
	faScroll: IconDefinition = faScroll;
	faBook: IconDefinition = faBook;
	faBookOpen: IconDefinition = faBookOpen;
	faGraduationCap: IconDefinition = faGraduationCap;

	academies: Academy[] = [];
	isSuperUser: boolean;

	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe(Breakpoints.Handset)
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	constructor(
		private breakpointObserver: BreakpointObserver,
		private router: Router,
		private academyService: AcademyService,
		private userService: UserService
	) {}

	ngOnInit() {
		this.subscriptions.add(
			this.academyService.getAllAcademies().subscribe(academies => {
				this.academies = academies;
			})
		);

		this.subscriptions.add(
			this.userService.isUserLoggedInAsSuperUser().subscribe(isSuperUser => {
				this.isSuperUser = Boolean(isSuperUser);
			})
		);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	logout() {
		// this.oauthService.logout();
		this.router.navigateByUrl('login');
	}
}
