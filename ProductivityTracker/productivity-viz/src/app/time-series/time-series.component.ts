import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Array from 'd3-array';

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.component.html',
  styleUrls: ['./time-series.component.css']
})
export class TimeSeriesComponent implements OnInit, OnChanges {

  @Input() githubData?: any = [];
  @Input() firebaseData?: any = [];
  @Input() metric: any = "";

  public svg: any;
  private scale = 1000;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2)

  private data: any = [];

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
  }

  ngOnChanges(): void {
    setTimeout(() => {
      this.combineData();
      this.drawTimeSeries()
    }, 3000);
  }

  private combineData(){
    this.data = [];

    for(const data of this.githubData){
      this.data.push({date: data.date, engValue: data.value, moveValue: 0})
    }

    const keys = Object.keys(this.data);
    
    for(const data of this.firebaseData){
      let dateExists = false;
      const date = data.date

      for(const key of keys){
        if(this.data[key].date === date){
          dateExists = true;
          this.data[key] = {date: date, engValue: this.data[key].engValue, moveValue: (data.value / this.scale)}
        }
      }
      if(!dateExists){
        this.data.push({date: date, engValue: 0, moveValue: (data.value / this.scale)})
      }
    }
    this.data.sort((a: any, b: any) => (a.date > b.date ? 1 : -1))
  }

  private createSvg(): void {
    this.svg = d3.select('figure#time-series')
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawTimeSeries(){
    this.svg.selectAll("*").remove();

    const x = d3.scaleTime()
    .range([0, this.width])
    .domain(this.getXDomain())

    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x));

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain(this.getYDomain())
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .call(d3.axisLeft(y));

    this.svg.append("path")
    .datum(this.data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x((d: any) => { return x(new Date(d.date))! })
      .y((d: any) => { return y(d.moveValue) })
    )

    this.svg.append("path")
    .datum(this.data)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x((d: any) => { return x(new Date(d.date))! })
      .y((d: any) => { return y(d.engValue) })
    )

    // Add Axis labels
    this.svg.append("text")
      .style("font", "14px open-sans")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (-this.margin / 1.5) + "," + (this.height / 2) + ")rotate(-90)")
      .text(`Steps (${this.scale}s) / ${this.getLabel()}`);

    this.svg.append("text")
      .style("font", "14px open-sans")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (this.width / 2) + "," + (this.height + (this.margin)) + ")")
      .text("Date");

    // // Add legend

    // const legend = this.svg.selectAll("g")
    //   .data(this.data)
    //   .enter().append("g")
    //   .attr("class", "legend");

    // // draw legend colored rectangles
    // legend.append("rect")
    //   .attr("x", this.width - 18)
    //   .attr("width", 18)
    //   .attr("height", 18)
    //   .style("fill", "steelblue");

    // // draw legend text
    // legend.append("text")
    //   .style("font", "14px open-sans")
    //   .attr("x", this.width - 24)
    //   .attr("y", 9)
    //   .attr("dy", ".35em")
    //   .style("text-anchor", "end")
    //   .text("Steps");

    // legend.append("rect")
    //   .attr("x", this.width - 18)
    //   .attr("y", 18)
    //   .attr("width", 18)
    //   .attr("height", 18)
    //   .style("fill", "red");

    // // draw legend text
    // legend.append("text")
    //   .style("font", "14px open-sans")
    //   .attr("x", this.width - 24)
    //   .attr("y", 18)
    //   .attr("dy", ".35em")
    //   .style("text-anchor", "end")
    //   .text(`${this.metric}`);
  }

  private getXDomain(){
    let min =  this.data[0].date;
    let max = this.data[0].date;

    for(const x of this.data){
      if(x.date < min){
        min = x.date;
      }

      if(x.date > max){
        max = x.date
      }
    }

    return [new Date(min), new Date(max)]
  }

  private getYDomain(){
    let max = 0;

    for(const x of this.data){
      if(x.engValue > max){
        max = x.engValue
      }
      if(x.moveValue > max){
        max = x.moveValue
      }
    }

    return [0, max];
  }

  private getLabel(){
    if(this.metric === "commits"){
      return "Commits"
    }
    else if(this.metric === "adds"){
      return "Line Additions"
    }
    else if(this.metric === "deletes"){
       return "Line Deletions"
    }
    else if(this.metric === "addsAndDeletes"){
      return "Total Line Additions & Deletions"
    }

    else return "";
  }
  
}
