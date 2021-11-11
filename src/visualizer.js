import React from "react";
import * as d3 from "d3";

const Visualizer = (props) => {
  // console.log(props.data);

  let duration = props.data.track.duration;

  let segments = props.data.segments.map((segment) => {
    return {
      start: segment.start / duration,
      duration: segment.duration / duration,
      loudness: 1 - Math.min(Math.max(segment.loudness_max, -35), 0) / -35,
    };
  });

  let max = Math.max(...segments.map((s) => s.loudness));

  let levels = [];

  for (let i = 0.0; i < 1; i += 0.001) {
    let s = segments.find((segment) => {
      return i <= segment.start + segment.duration;
    });

    let loudness = Math.round((s.loudness / max) * 100);
    if (loudness === 0) loudness = 5;

    levels.push(loudness);
  }

  // console.log(levels.length);

  if (levels) {
    d3.select(".chart")
      .selectAll("circle")
      .data(levels)
      .join("circle")
      .attr("cx", function (d, i) {
        return i * 100;
      })
      .attr("cy", 50)
      .attr("r", function (d) {
        return 0.5 * d;
      })
      .style("fill", "blue");
  }

  return (
    <>
      <h1>Wave pattern</h1>
      <svg width="4000" height="100">
        <g className="chart" transform="translate(50, 0)"></g>
      </svg>
    </>
  );
};

export default Visualizer;
