import React from "react";
import * as d3 from "d3";

import cleanDataFunctions from "./cleanDataFunctions";

const Visualizer = (props) => {
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

    levels.push({ loudness, fill: "green" });
  }

  if (levels) {
    d3.select(".chart")
      .selectAll("rect")
      .data(levels)
      .join("rect")
      .attr("x", function (d, i) {
        return i * 1.5;
      })
      .attr("y", function (d) {
        let pos = d.loudness / 2;
        return 100 - pos;
      })
      .transition()
      .attr("height", function (d) {
        return 0.5 * d.loudness;
      })
      .attr("width", function (d) {
        return 0.75;
      })
      .style("fill", "#191414");
  }

  let key = cleanDataFunctions.getKeyPitch(props.data.track);

  return (
    <section className="wave-section">
      <h1>Wave pattern</h1>
      <div className="wave-container">
        <svg height="100">
          <g className="chart" transform="translate(0, 0)"></g>
        </svg>
      </div>
      <p>Het nummer is in key: "{key.pitch}" gespeeld</p>
    </section>
  );
};

export default Visualizer;
