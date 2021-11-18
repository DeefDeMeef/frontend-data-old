import { useD3 } from "./hooks/useD3";
import React, { useEffect } from "react";
import * as d3 from "d3";

function BarChart(props) {
  console.log(props);
  let dataSet = [
    { subject: "acousticness", count: props.data.acousticness * 1000 },
    { subject: "danceability", count: props.data.danceability * 1000 },
    { subject: "energy", count: props.data.energy * 1000 },
    { subject: "speechiness", count: props.data.speechiness * 1000 },
  ];
  // let data = props.data.segments;
  useEffect(() => {
    // Create a dataset of pets and the amount of people that own them
    let dataSet = [
      { subject: "acousticness", count: props.data.acousticness * 100 },
      { subject: "danceability", count: props.data.danceability * 10 },
      { subject: "energy", count: props.data.energy * 10 },
      { subject: "speechiness", count: props.data.speechiness * 100 },
    ];
    // Generate a p tag for each element in the dataSet with the text: Subject: Count
    d3.select("#pgraphs")
      .selectAll("p")
      .data(dataSet)
      .enter()
      .append("p")
      .text((dt) => dt.subject + ": " + dt.count);

    // Bar Chart:
    const getMax = () => {
      // Calculate the maximum value in the DataSet
      let max = 0;
      dataSet.forEach((dt) => {
        if (dt.count > max) {
          max = dt.count;
        }
      });
      return max;
    };

    // Create each of the bars and then set them all to have the same height(Which is the max value)
    d3.select("#BarChart")
      .selectAll("div")
      .data(dataSet)
      .enter()
      .append("div")
      .classed("bar", true)
      .style("height", `${getMax()}px`);

    //Transition the bars into having a height based on their corresponding count value
    d3.select("#BarChart")
      .selectAll(".bar")
      .transition()
      .duration(1000)
      .style("height", (bar) => `${bar.count}px`)
      .style("width", "80px")
      .style("margin-right", "10px")
      .delay(300); // Fix their width and margin
  }, [props.data]);

  const margin = { top: 40, bottom: 140, left: 150, right: 20 };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // Creates sources <svg> element
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Group used to enforce margin
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  // transformeer de getekende chart en verplaats hem x stappen van links en x stappen van de top (in dit geval 150 en 40)

  const xScale = d3.scaleBand().domain([0, 10]).range([0, width]).padding(0.2);

  //maak een scale met een range van 0 tot 100.

  const yScale = d3.scaleLinear().domain([0, 10]).range([height, 0]); //van height naar 0 zodat op de y-as de hoogte bovenaan staat

  const xaxis = d3.axisBottom().scale(xScale); // De data wordt aan de onderkant van de x-as geplaatst
  const drawXaxis = g.append("g").attr("class", "x-as"); // teken een x as

  const yaxis = d3.axisLeft().scale(yScale); // De data wordt aan de linkerkant van de as geplaatst
  const drawYaxis = g.append("g").attr("class", "y-as"); //teken een y as

  d3.json("https://api.punkapi.com/v2/beers?page=1&per_page=11").then((json) => {
    // Verzendt http-request naar de opgegeven url om .json-bestand of gegevens te laden
    let data = json;

    console.log(data);

    updateMe(dataSet);
  });

  function updateMe(new_data) {
    // update de schalen
    yScale.domain([0, d3.max(new_data, (d) => d.count)]);
    xScale.domain(new_data.map((d) => d.subject));

    //maak de assen
    drawXaxis
      .attr("transform", "translate(0," + height + ")")
      .transition()
      .call(xaxis)
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .attr("font-size", "16");

    drawYaxis.transition().call(yaxis);

    // DATA JOIN
    const rect = g
      .selectAll("rect")
      .data(new_data)
      .join(
        // ENTER
        // nieuwe elementen
        (enter) => {
          const rect_enter = enter.append("rect").attr("x", 0);
          rect_enter.append("title");
          return rect_enter;
        },
        // UPDATE
        // Update de bestaande elementen
        (update) => update,
        // EXIT
        // de elementen die die niet geassocieert zijn met de data
        (exit) => exit.remove()
      );

    rect
      .transition()
      .ease(d3.easeBounceOut)
      .duration(1000)
      .attr("x", (d) => xScale(d.subject))
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth()) //bandwidth wordt gebruik om de bandbreedte van de X schaal te vinden
      .attr("height", (d) => height - yScale(d.count)); // de hoogte van een rectangle(bar) is de hoogte per object min de y schaal van het alcohol percentage

    rect.select("title").text((d) => d.subject + ": " + d.count); //geef de rectangles een title van de naam van het biertje en het alcohol permilage

    // rect
    //   .append("a")
    //   .attr("href", (d) => d.image_url)
    //   .text((d) => d.subject); // voeg een a tag toe met een href met de gegevens van image_url en geef de tekst de naam

    rect.on(
      "click",
      (e) => window.open(e.target.childNodes[1].getAttribute("href")) // Als er geklikt wordt op de bar open dan de link binnen in de rectangle
    );
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
