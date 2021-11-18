import { useD3 } from "./hooks/useD3";
import React, { useEffect } from "react";
import * as d3 from "d3";

function BarChart(props) {
  console.log(props);

  if (props) {
    let dataSet = [
      { subject: "acousticness", count: props.data.acousticness * 100 },
      { subject: "danceability", count: props.data.danceability * 10 },
      { subject: "energy", count: props.data.energy * 10 },
      { subject: "speechiness", count: props.data.speechiness * 100 },
    ];

    const margin = { top: 0, bottom: 100, left: 50, right: 0 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand().domain([0, 10]).range([0, width]).padding(0.2);

    const yScale = d3.scaleLinear().domain([0, 10]).range([height, 0]);

    const xaxis = d3.axisBottom().scale(xScale);
    const drawXaxis = g.append("g").attr("class", "x-as");

    const yaxis = d3.axisLeft().scale(yScale);
    const drawYaxis = g.append("g").attr("class", "y-as");

    yScale.domain([0, d3.max(dataSet, (d) => d.count)]);
    xScale.domain(dataSet.map((d) => d.subject));

    drawXaxis
      .attr("transform", "translate(0," + height + ")")
      .transition()
      .call(xaxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("font-size", "16");

    drawYaxis.transition().call(yaxis);

    // DATA JOIN
    const rect = g
      .selectAll("rect")
      .data(dataSet)
      .join(
        (enter) => {
          const rect = enter.append("rect").attr("x", 0);
          rect.append("title");
          return rect;
        },
        (update) => update,
        (exit) => exit.remove()
      );

    rect
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.subject))
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.count));

    rect.select("title").text((d) => d.subject + ": " + d.count);
  }

  return (
    <>
      {/* <div id="pgraphs"></div> */}
      <div id="BarChart"></div>
      <div id="chart"></div>
    </>
  );
}

export default BarChart;
