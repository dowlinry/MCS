import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {


  @Input() firebaseData: any = [];
  @Input() githubData: any = [];
  combinedData = [];

  private svgTS: any;
  private svgSC: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2)

  constructor() { }

  async ngOnInit() {
    this.combinedData = await this.combineData(await this.githubData, await this.firebaseData);

    this.createSvg(this.svgTS, "time-series");
    this.createSvg(this.svgSC, "scatter")
  }

  private async combineData(githubData: any, firebaseData: any){
    let data: any = [];
    const commitDates = Object.keys(githubData);

    for await (const date of commitDates){
      data[date] = {
        stats: githubData[date].stats,
        commits: githubData[date].commits,
        steps: 0
      }
    }

    const movementDates = Object.keys(firebaseData)

    for await (const date of movementDates){
      if(data[date]){
        data[date] = {
          stats: data[date].stats,
          commits: data[date].stats,
          steps: firebaseData[date].value
        }
      }
      else{
        data[date] = {
          stats: {
            additions: 0,
            deletions: 0,
            total: 0
          },
          commits: 0,
          steps: firebaseData[date].value
        }
      }
    }
    return await data;
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
