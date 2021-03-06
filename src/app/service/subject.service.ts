import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from '../model/subject.model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SubjectService {
	constructor(private http: HttpClient) { }

	getSubjectById(id: number) {
		return this.http.get<Subject>('api/subjects/' + id);
	}

	getAllSubjectsByAcademyId(academyId: number) {
		return this.http.get<Subject[]>('api/subjects/academy/' + academyId);
	}


	getUnpublishedSubjects() {
		return this.http.get<Subject[]>('api/subjects/unpublished');
	}

	getAllPublishedSubjectsByAcademyId(academyId: number) {
		return this.http.get<Subject[]>(
			'api/subjects/published/academy/' + academyId
		);
	}

	getAllSubjects() {
		return this.http.get<Subject[]>('api/subjects/all');
	}

	saveSubject(subject: Subject) {
		return this.http.post<Subject>('/api/subjects/', subject);
	}

	deleteSubject(id: number) {
		return this.http.delete('/api/subjects/' + id);
	}

	deleteSubjects(subjects: Subject[]) {
		const options = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
			body: subjects
		};
		return this.http.delete('/api/subjects/', options);
	}

	publishSubject(subject: Subject) {
		return this.http.post('/api/subjects/unpublish', subject);
	}

	publishSubjects(subjects: Subject[], isUnPublished: boolean) {
		this.setSubjectsIsUnpublished(subjects, isUnPublished);
		return this.http.post<Subject[]>('/api/subjects/unpublishList/', subjects);
	}

	private setSubjectsIsUnpublished(subjects: Subject[], isUnPublished: boolean) {
		subjects.forEach(subject => {
			subject.unpublished = isUnPublished;
		});
	}
}
