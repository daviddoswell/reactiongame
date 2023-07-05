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
  const tooltipRef = useRef(); // Adding tooltipRef here
  const additionalPadding = 30;

  useEffect(() => {
    const svg = select(ref.current);
    svg.selectAll("*").remove();

    const tooltip = select(tooltipRef.current); // Using tooltipRef here
    tooltip.style("opacity", 0);

    data.forEach((d) => {
      d.age = Number(d.age); // Parse age from string to number
      d.score = Math.round(Number(d.score)); // Parse score from string to number and round it
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
    const allScores = [...maleScores, ...femaleScores];
    const thresholds = d3Bin().thresholds(allScores.length)(allScores);
    const kdeEstimator = kde(kernel, thresholds);
    const maleDensity = kdeEstimator(maleScores);
    const femaleDensity = kdeEstimator(femaleScores);

    const innerWidth = width - 2 * padding;
    const innerHeight = height - 2 * padding;

    const xScale = scaleLinear()
      .domain([25, 115])
      .range([0, innerWidth])
      .nice();
    const yScale = scaleLinear().domain([2000, 5000]).range([innerHeight, 0]);

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
    // KDE curves
    const minAge = min(data, (d) => d.age);
    const maxAge = max(data, (d) => d.age);

    const xScaleKde = xScale;
    const yScaleKde = scaleLinear()
      .domain([0, max([maleDensity, femaleDensity], (d) => d[1])])
      .range([innerHeight, 0]);

    const lineGenerator = line()
      .x((d) => xScaleKde(d[0]))
      .y((d) => yScaleKde(d[1]));

    // Draw path
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

    // Scatter plot with tooltip
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.age))
      .attr("cy", (d) => yScale(d.score))
      .attr("r", 4)
      .attr("fill", (d) => (d.gender === "male" ? "#0000ff" : "#ff1493"))
      .on("mouseover", function (event, d) {
        const html = `User: ${d.username}<br/>Score: ${d.score}<br/>Age: ${d.age}`;
        tooltip
          .html(html)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`)
          .style("opacity", 1);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });

    // X-axis label
    g.append("text")
      .style("font-size", "20px")
      .attr("fill", "white")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + padding)
      .attr("text-anchor", "middle")
      .text("Age");

    // Y-axis label
    g.append("text")
      .style("font-size", "20px")
      .attr("fill", "white")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -padding * 1.3)
      .attr("text-anchor", "middle")
      .text("Reaction Time (milliseconds)");
  }, [data, width, height, padding]);

  return (
    <>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          padding: "10px",
          background: "#f9f9f9",
          border: "1px solid #c0c0c0",
          borderRadius: "5px",
          pointerEvents: "none",
          color: "black",
        }}
      />
      <svg
        ref={ref}
        width={width + 2 * padding}
        height={height + 2 * padding}
      />
    </>
  );
};

export default ScatterPlot;
