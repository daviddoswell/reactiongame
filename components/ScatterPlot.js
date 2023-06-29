import React, { useRef, useEffect } from "react";
import {
  select,
  scaleLinear,
  max,
  axisBottom,
  axisLeft,
  bin as d3Bin,
  mean,
} from "d3";

function kdeKernelEpanechnikov(k) {
  return function (v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}

function kde(kernel, thresholds) {
  return function (values) {
    return thresholds.map((t) => [t, mean(values, (d) => kernel(t - d))]);
  };
}

const ScatterPlot = ({ data, width = 500, height = 500, padding = 50 }) => {
  const ref = useRef();
  const additionalPadding = 30;

  useEffect(() => {
    const svg = select(ref.current);
    svg.selectAll("*").remove();

    const maleScores = data
      .filter((d) => d.gender === "male")
      .map((d) => d.score);
    const femaleScores = data
      .filter((d) => d.gender === "female")
      .map((d) => d.score);

    const kernel = kdeKernelEpanechnikov(7);
    const thresholds = d3Bin().thresholds(maleScores.length)(maleScores);
    const kdeEstimator = kde(kernel, thresholds);
    const maleDensity = kdeEstimator(maleScores);
    const femaleDensity = kdeEstimator(femaleScores);

    // Your density drawing logic here...

    const innerWidth = width - 2 * padding;
    const innerHeight = height - 2 * padding;

    const xScaleScatter = scaleLinear()
      .domain([25, 105])
      .range([0, innerWidth])
      .nice();

    const yScaleScatter = scaleLinear()
      .domain([0, max(data, (d) => d.score)])
      .range([innerHeight, 0]);

    const xAxis = axisBottom(xScaleScatter);
    const yAxis = axisLeft(yScaleScatter).ticks(8);

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${padding + additionalPadding}, ${padding})`
      );
    g.append("g").attr("transform", `translate(0, ${innerHeight})`).call(xAxis);
    g.append("g").call(yAxis);

    g.append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScaleScatter(d.age))
      .attr("cy", (d) => yScaleScatter(d.score))
      .attr("r", 5)
      .style("fill", (d) => {
        if (d.gender) {
          return d.gender.toLowerCase() === "male" ? "#0000ff" : "#ff1493";
        } else {
          return "#808080"; // Grey for undefined gender
        }
      });

    svg
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height - 5})`)
      .style("text-anchor", "middle")
      .text("Age (Years)");
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Reaction Time (ms)");
  }, [data, width, height, padding]);

  return <svg ref={ref} width={width} height={height + additionalPadding} />;
};

export default ScatterPlot;
