import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from 'src/app/service/exam.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  name = 'Filename';
  data = [];
  url = ''; //Här ska urlen för att ladda ner pdf:en vara! 

  constructor(private route: ActivatedRoute, private service: ExamService) { }

  ngOnInit() {
    this.subscriptions.add(this.route.paramMap.subscribe(params => {
      const courseId = parseInt(params.get('id'), 10);
      this.setExamsByCourseId(courseId);
    }));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  setExamsByCourseId(courseId) {
    this.service.getAllExamsByCourseId(courseId).subscribe(exams => {
      this.data = [];
      exams.forEach(exam => {
        console.log(exam.fileName);
        
        this.data.push({
          id: exam.id,
          name: exam.fileName,
          shortDesc: ""
        });
      });
    });
  }
}