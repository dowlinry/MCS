import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ApiServiceService } from '../api-service/api-service.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {


  @Input() firebaseData: any = [];
  @Input() githubData: any = [];

  private svgTS: any;
  private svgSC: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2)

  constructor(private ApiService: ApiServiceService) { }

  async ngOnInit() {
    console.log(await this.firebaseData);
    console.log(await this.githubData)

    this.createSvg(this.svgTS, "time-series");
    this.createSvg(this.svgSC, "scatter")
  }

  private createSvg(svg: any, id: any): void {
    svg = d3.select(`figure#${id}`)
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawScatter(svg: any, data: any){

  }

  private drawTimeSeries(svg: any, data: any) {
    // Create the X-axis band scale
    const x = d3.scaleBand()
    .range([0, this.width])
    .domain(data.map((d:any) => d.key))
    .padding(0.2);

    // Draw the X-axis on the DOM
    svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, 200000])
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    svg.append("g")
    .call(d3.axisLeft(y));

    // Create and fill the bars
    svg.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d: any) => x(d.key))
    .attr("y", (d: any) => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", (d: any) => this.height - y(d.Stars))
    .attr("fill", "#d04a35");
}

}
