import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import { Data } from '../data';

@Component({
  selector: 'pb-pie-chart',
  imports: [],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.scss'
})
export class PieChart {

  private svg: any;
  private width = 500 + 80 * 2;
  private height = 200 + 80 * 2;
  private radius = 140;
  private color = d3.scaleOrdinal<string>().range(['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19']);

  constructor(private http: HttpClient, public data: Data) {  }

  ngAfterViewInit(): void {
    this.createSvg();
    this.data.getBudget((data) => {
      this.drawChart(data);
    });

  }

  private createSvg(): void {
    this.svg = d3.select("#d3jsChart")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    // .attr('viewBox', `0 0 ${this.width} ${this.height}`)
    .append('g')
    .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    this.svg.append('g').attr('class', 'slices');
    this.svg.append('g').attr('class', 'labels');
    this.svg.append('g').attr('class', 'lines');
  }

  private drawChart(data: { label: string, value: number }[]): void {
    const pie = d3.pie<any>()
      .sort(null)
      .value((d: any) => d.value);

    const arc = d3.arc<d3.PieArcDatum<any>>()
      .outerRadius(this.radius)
      .innerRadius(0);

    const outerArc = d3.arc<d3.PieArcDatum<any>>()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);

    function midAngle(d: d3.PieArcDatum<any>) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    /* ------- PIE SLICES -------*/
    const slice = this.svg.select('.slices').selectAll('path.slice')
      .data(pie(data));

    slice.enter()
      .append("path")
      .attr("class", "slice")
      .attr("d", arc)
      .style("fill", (d: any) => this.color(d.data.label) as string);

    slice.exit().remove();

    /* ------- TEXT LABELS -------*/
    const text = this.svg.select('.labels').selectAll('text')
      .data(pie(data));

    text.enter()
      .append('text')
      .attr('dy', '.35em')
      .attr('font-size', '12px')
      .text((d: any) => d.data.label)
      .attr('transform', (d: d3.PieArcDatum<any>) => {
        const pos = outerArc.centroid(d);
        pos[0] = this.radius * 1.1 * (midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', (d: d3.PieArcDatum<any>) => midAngle(d) < Math.PI ? 'start' : 'end');

    text.exit().remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/
    const polyline = this.svg.select('.lines').selectAll('polyline')
      .data(pie(data));

    polyline.enter()
      .append('polyline')
      .attr('points', (d: d3.PieArcDatum<any>) => {
        const posA = arc.centroid(d);
        const posB = outerArc.centroid(d);
        const posC = [...posB] as [number, number];
        posC[0] = this.radius * (midAngle(d) < Math.PI ? 1 : -1);
        return [posA, posB, posC];
    });

    polyline.exit().remove();
  }



}
