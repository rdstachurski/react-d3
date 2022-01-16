import React from "react";
import { select, csv, scaleLinear, axisLeft, axisBottom, extent } from "d3";

export default function ScatterPlot() {
  <svg width="1280" height="700"></svg>;
  const svg = select("svg");
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const render = (data) => {
    const xValue = (d) => d.hwy;
    const yValue = (d) => d.displ;
    const margin = { top: 80, right: 50, bottom: 100, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const circleRadius = 10;
    const xAxisLabel = "Highway MPG";
    const yAxisLabel = "Engine Displacement";
    const Title = `${yAxisLabel} vs ${xAxisLabel}`;
    const xScale = scaleLinear()
      .domain(extent(data, xValue))
      .range([0, innerWidth])
      .nice();

    const yScale = scaleLinear()
      .domain(extent(data, yValue))
      .range([innerHeight, 0])
      .nice();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    const xAxis = axisBottom(xScale).tickSize(-innerHeight).tickPadding(15);
    const yAxis = axisLeft(yScale).tickSize(-innerWidth).tickPadding(10);
    const yAxisG = g.append("g").call(yAxis);
    yAxisG
      .selectAll(".domain") // removes the ticks on the y axis
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
      .attr("y", 75)
      .attr("x", innerWidth / 2)
      .text(xAxisLabel)
      .attr("fill", "black");
    yAxisG
      .append("text")
      .attr("class", "axis-title")
      .attr("y", -60)
      .attr("x", -innerHeight / 2)
      .text(yAxisLabel)
      .attr("fill", "black")
      .attr("transform", `rotate(-90)`)
      .attr("text-anchor", "middle");

    g.selectAll("cirlce")
      .data(data)
      .enter()
      .append("circle")
      .attr("cy", (d) => yScale(yValue(d)))
      .attr("cx", (d) => xScale(xValue(d)))
      .attr("r", circleRadius);

    g.append("text").attr("class", "title").text(Title).attr("y", -30);
  };

  csv("data/cars.csv").then((cars) => {
    cars.forEach((car) => {
      car.hwy = +car.hwy;
      car.displ = +car.displ;
    });
    console.log(cars);
    render(cars);
  });
  return svg;
}
