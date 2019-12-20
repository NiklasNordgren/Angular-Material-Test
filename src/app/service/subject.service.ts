import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from '../model/subject.model';

@Injectable({
	providedIn: 'root'
})
export class SubjectService {

	constructor(private http: HttpClient) { }

	getAllSubjectsByAcademyId(id: any) {
		return this.http.get<Subject[]>('/api/subjects/academy/' + id);
	}

}
