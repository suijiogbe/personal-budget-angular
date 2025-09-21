import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';

import { Article } from "../article/article";
import { Breadcrumbs } from "../breadcrumbs/breadcrumbs";
import { PieChart } from '../pie-chart/pie-chart';
import { Data } from '../data';


@Component({
  selector: 'pb-homepage',
  imports: [Article, Breadcrumbs, PieChart],
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

  public budgetData: { label: string; value: number }[] = [];

  constructor(public data: Data) {  }

  ngAfterViewInit(): void {
    this.data.getBudget((data) => {
      this.budgetData = data;
      this.dataSource.datasets[0].data = data.map(d => d.value);
      this.dataSource.labels = data.map(d => d.label);

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
