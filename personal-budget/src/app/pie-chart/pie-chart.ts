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
    .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    this.svg.append('g').attr('class', 'slices');
    this.svg.append('g').attr('class', 'labels');
    this.svg.append('g').attr('class', 'lines');
  }

  private drawChart(data: { label: string, value: number }[]): void {
  var pie = d3.pie<any>().value((d: any) => d.value);

  var arc = d3.arc<d3.PieArcDatum<any>>()
    .outerRadius(this.radius * 0.8)
    .innerRadius(0);

  var outerArc = d3.arc<d3.PieArcDatum<any>>()
    .innerRadius(this.radius * 0.9)
    .outerRadius(this.radius * 0.9);

  var key = (d: any) => d.data.label;
  function midAngle(d: d3.PieArcDatum<any>) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  /* ------- PIE SLICES -------*/
  var slice = this.svg.select('.slices').selectAll('path.slice')
    .data(pie(data), key);

  slice.enter()
    .append("path")
    .attr("class", "slice")
    .style("fill", (d: any) => this.color(d.data.label) as string)
    .attr("d", arc)
    .each(function(this: any, d: any) { this._current = this._current || d; });

  slice.transition().duration(1000)
    .attrTween("d", function(this: any, d: any) {
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return (t: number) => arc(interpolate(t))!;
    });

  slice.exit().remove();

  /* ------- TEXT LABELS -------*/
  var text = this.svg.select('.labels').selectAll('text')
    .data(pie(data), key);

  text.enter()
    .append('text')
    .attr('dy', '.35em')
    .attr('font-size', '12px')
    .text((d: any) => d.data.label)
    .merge(text)
    .transition()
    .duration(1000)
    .attr('transform', (d: d3.PieArcDatum<any>) => {
      var pos = outerArc.centroid(d);           // start at outer arc
      pos[0] = this.radius * 1.1 * (midAngle(d) < Math.PI ? 1 : -1); // move to left/right
      return `translate(${pos})`;
    })
    .style('text-anchor', (d: d3.PieArcDatum<any>) => midAngle(d) < Math.PI ? 'start' : 'end');

  text.exit().remove();

  /* ------- SLICE TO TEXT POLYLINES -------*/
  var polyline = this.svg.select('.lines').selectAll('polyline')
    .data(pie(data), key);

  polyline.enter()
    .append('polyline')
    .merge(polyline)
    .transition()
    .duration(1000)
    .attr('points', (d: d3.PieArcDatum<any>) => {
      var sliceCen = arc.centroid(d);
      var pos = outerArc.centroid(d);
      var position = this.radius * 1.1 * (midAngle(d) < Math.PI ? 1 : -1);
      var label: [number, number] = [position, pos[1]];

      return [sliceCen, pos, label];
    });

  polyline.exit().remove();
  }



}
