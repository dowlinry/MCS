import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.css']
})
export class ScatterComponent implements OnInit, OnChanges {

  @Input() githubData?: any = [];
  @Input() firebaseData?: any = [];
  @Input() metric: any = "";

  public svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2)

  private data: any = [];

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
  }

  ngOnChanges(){
    setTimeout(() => {
      this.combineData();
      this.drawScatter()
      console.log(this.data)
    }, 3000);
  }

  private createSvg(): void {
    this.svg = d3.select('figure#scatter')
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
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
          this.data[key] = {date: date, engValue: this.data[key].engValue, moveValue: data.value}
        }
      }
      if(!dateExists){
        this.data.push({date: date, engValue: 0, moveValue: data.value})
      }
    }
    this.data.sort((a: any, b: any) => (a.date > b.date ? 1 : -1))
  }

  private drawScatter(){
    this.svg.selectAll("*").remove();

    const x = d3.scaleLinear()
      .domain(this.getXDomain())
      .range([ 0, this.width ]);

    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .domain(this.getYDomain())
      .range([ this.height, 0]);
    this.svg.append("g")
      .call(d3.axisLeft(y));

    this.svg.append('g')
      .selectAll("dot")
      .data(this.data)
      .enter()
      .append("circle")
        .attr("cx", (d: any) => { return x(d.engValue); } )
        .attr("cy", (d: any) => { return y(d.moveValue); } )
        .attr("r", 3)
        .style("fill", "#69b3a2")

    // Add Axis labels
    this.svg.append("text")
      .style("font", "14px open-sans")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (-this.margin / 1.5) + "," + (this.height / 2) + ")rotate(-90)")
      .text('Steps');

    this.svg.append("text")
      .style("font", "14px open-sans")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (this.width / 2) + "," + (this.height + (this.margin)) + ")")
      .text(`${this.getLabel()}`);
  }

  private getXDomain(){
    let max = 0;

    for(const x of this.data){
      if(x.engValue > max){
        max = x.engValue
      }
    }

    return [0, max]
  }

  private getYDomain(){
    let max = 0;

    for(const x of this.data){
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
