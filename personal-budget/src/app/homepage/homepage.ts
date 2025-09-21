import { Component } from '@angular/core';
import { Article } from "../article/article";
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'pb-homepage',
  imports: [Article],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss'
})
export class Homepage {

  public dataSource: {
  datasets: { data: number[]; backgroundColor: string[] }[];
  labels: string[];
}  = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
        ]
      }
    ],
    labels: []
  };

  constructor(private http: HttpClient) {  }

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
      }
      this.createChart();
    }
    )
  }

  createChart() {
    // var ctx = document.getElementById('myChart').getContext('2d');
      var ctx = document.getElementById('myChart') as HTMLCanvasElement;
      var myPieChart = new Chart(ctx, {
          type: 'pie',
          data: this.dataSource
      });
  }

}
