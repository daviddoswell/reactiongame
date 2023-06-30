import React, { useRef, useEffect } from "react";
import {
  select,
  scaleLinear,
  min,
  max,
  axisBottom,
  axisLeft,
  bin as d3Bin,
  mean,
  line,
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

    data.forEach((d) => {
      d.age = Number(d.age); // Parse age from string to number
    });

    const maleScores = data
      .filter((d) => d.gender === "male")
      .map((d) => d.score);
    const femaleScores = data
      .filter((d) => d.gender === "female")
      .map((d) => d.score);

    const maleAverageScore =
      maleScores.reduce((a, b) => a + b, 0) / maleScores.length;
    const femaleAverageScore =
      femaleScores.reduce((a, b) => a + b, 0) / femaleScores.length;

    const kernel = kdeKernelEpanechnikov(7);
    const thresholds = d3Bin().thresholds(maleScores.length)(maleScores);
    const kdeEstimator = kde(kernel, thresholds);
    const maleDensity = kdeEstimator(maleScores);
    const femaleDensity = kdeEstimator(femaleScores);

    const innerWidth = width - 2 * padding;
    const innerHeight = height - 2 * padding;

    const xScale = scaleLinear()
      .domain([25, 105])
      .range([0, innerWidth])
      .nice();
    const yScale = scaleLinear()
      .domain([0, max(data, (d) => d.score)])
      .range([innerHeight, 0]);

    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale).ticks(8);

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${padding + additionalPadding}, ${padding})`
      );
    g.append("g").attr("transform", `translate(0, ${innerHeight})`).call(xAxis);
    g.append("g").call(yAxis);

    // KDE curves
    const minAge = min(data, (d) => d.age);
    const maxAge = max(data, (d) => d.age);
    
    const xScaleKde = scaleLinear()
      .domain([0, max([maleScores, femaleScores])])
      .range([0, innerWidth]);

    const yScaleKde = scaleLinear()
      .domain([0, max([maleDensity, femaleDensity], (d) => d[1])])
      .range([innerHeight, 0]);

    const lineGenerator = line()
      .x((d) => xScaleKde(d[0]))
      .y((d) => yScaleKde(d[1]));

    // X-axis label
    g.append("text")
      .style("font-size", "14px")
      .attr("fill", "black")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + padding)
      .attr("text-anchor", "middle")
      .text("Age");

    // Y-axis label
    g.append("text")
      .style("font-size", "14px")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -padding * 1)
      .attr("text-anchor", "middle")
      .text("Reaction Time (millisconds)");

    g.append("path")
      .datum(maleDensity)
      .attr("fill", "none")
      .attr("stroke", "#0000ff")
      .attr("stroke-width", 1.5)
      .attr("d", lineGenerator);

    g.append("path")
      .datum(femaleDensity)
      .attr("fill", "none")
      .attr("stroke", "#ff1493")
      .attr("stroke-width", 1.5)
      .attr("d", lineGenerator);

    // Draw average line for male scores
    g.append("line")
      .style("stroke", "blue")
      .style("stroke-width", 5)
      .style("stroke-dashoffset", 5)
      .attr("x1", xScale(minAge))
      .attr("y1", yScale(maleAverageScore))
      .attr("x2", xScale(maxAge))
      .attr("y2", yScale(maleAverageScore));

    // Draw average line for female scores
    g.append("line")
      .style("stroke", "pink")
      .style("stroke-width", 5)
      .style("stroke-dashoffset", 5)
      .attr("x1", xScale(minAge))
      .attr("y1", yScale(femaleAverageScore))
      .attr("x2", xScale(maxAge))
      .attr("y2", yScale(femaleAverageScore));

    // Scatter plot
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.age))
      .attr("cy", (d) => yScale(d.score))
      .attr("r", 4)
      .attr("fill", (d) => (d.gender === "male" ? "#0000ff" : "#ff1493"));
  }, [data, width, height, padding]);

  return (
    <svg ref={ref} width={width + 2 * padding} height={height + 2 * padding} />
  );
};

export default ScatterPlot;
