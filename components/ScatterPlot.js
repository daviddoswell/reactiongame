import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const ScatterPlot = ({ data, width = 500, height = 500, padding = 50 }) => {
  const ref = useRef();

  const additionalPadding = 30;

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const innerWidth = width - 2 * padding;
    const innerHeight = height - 2 * padding;

    const xScale = d3
      .scaleLinear()
      .domain([25, 105])
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.score)])
      .range([innerHeight, 0]);

    console.log(data, xScale, yScale); // Log data and scales

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(8);

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
      .attr("cx", (d) => xScale(d.age))
      .attr("cy", (d) => yScale(d.score))
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
