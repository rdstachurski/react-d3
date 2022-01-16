import "./barGraph.css";
import React from "react";
import {
  select,
  csv,
  scaleLinear,
  max,
  scaleBand,
  axisLeft,
  axisBottom,
} from "d3";

export default function BarGraph() {
  const svg = select("svg");
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const render = (data) => {
    const xValue = (d) => d.hwy;
    const yValue = (d) => d.manufacturer;
    const margin = { top: 50, right: 20, bottom: 80, left: 200 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xScale = scaleLinear()
      .domain([0, max(data, xValue)])
      .range([0, innerWidth]);

    const yScale = scaleBand()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.1);
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    const xAxis = axisBottom(xScale).tickSize(-innerHeight);
    g.append("g")
      .call(axisLeft(yScale))
      .selectAll(".domain, .tick line") // removes the ticks on the y axis
      .remove();
    const xAxisG = g
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${innerHeight})`);

    xAxisG
      .select(".domain") // removes the ticks on the y axis
      .remove();
    xAxisG
      .append("text")
      .attr("class", "axis-title")
      .attr("y", 60)
      .attr("x", innerWidth / 2)
      .text("Highway Speed")
      .attr("fill", "black");

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", (d) => yScale(yValue(d)))
      .attr("width", (d) => xScale(xValue(d)))
      .attr("height", yScale.bandwidth());
    g.append("text")
      .attr("class", "title")
      .text("Car manufactors vs highest hwy spd")
      .attr("y", -10);
  };

  csv("data/cars.csv").then((cars) => {
    cars.forEach((car) => {
      car.year = +car.year;
    });
    console.log(cars);
    render(cars);
  });
  return svg;
}
