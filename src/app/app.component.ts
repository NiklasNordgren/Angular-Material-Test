import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { map, shareReplay } from "rxjs/operators";
import { AcademyService } from "src/app/service/academy.service";
import { Router } from "@angular/router";
import {
	MAT_TOOLTIP_DEFAULT_OPTIONS,
	MatTooltipDefaultOptions
} from "@angular/material/tooltip";

/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
	showDelay: 250,
	hideDelay: 50,
	touchendHideDelay: 1000
};

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
	providers: [
		{
			provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
			useValue: myCustomTooltipDefaults
		}
	]
})
export class AppComponent implements OnInit, OnDestroy {
	constructor(
		private breakpointObserver: BreakpointObserver,
		private service: AcademyService,
		private router: Router
	) {}

	subscriptions: Subscription = new Subscription();
	academies = [];

	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe(Breakpoints.Handset)
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	ngOnInit() {
		const sub = this.service.getAllAcademies().subscribe(responseAcademies => {
			this.convertAndSetAcademies(responseAcademies);
		});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	convertAndSetAcademies(responseAcademies) {
		this.academies = [];
		responseAcademies.forEach(academy => {
			this.academies.push({
				name: academy.name,
				shortDesc: academy.abbreviation,
				id: academy.id
			});
		});
	}
	goToPage(pageName: string) {
		this.router.navigate([`${pageName}`]);
	}
	goToHomePage() {
		this.goToPage("/");
	}
}

/**
 * @title Basic tooltip
 */
@Component({
	selector: "app",
	templateUrl: "app.component.html"
})
export class TooltipOverviewExample {}
