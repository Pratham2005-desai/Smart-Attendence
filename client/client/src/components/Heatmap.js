import React, { useEffect, useRef } from 'react';
import { select, scaleBand, scaleSequential, max, axisBottom, axisLeft, interpolateYlOrRd } from 'd3';

const Heatmap = ({ data, width = 600, height = 400, margin = { top: 20, right: 20, bottom: 30, left: 40 } }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = scaleBand()
      .domain(data.map(d => d.x))
      .range([0, innerWidth])
      .padding(0.05);

    const yScale = scaleBand()
      .domain(data.map(d => d.y))
      .range([0, innerHeight])
      .padding(0.05);

    const colorScale = scaleSequential()
      .interpolator(interpolateYlOrRd)
      .domain([0, max(data, d => d.value)]);

    // Create group container
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Draw squares
    g.selectAll()
      .data(data, d => d.x + ':' + d.y)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .style('fill', d => colorScale(d.value));

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(axisBottom(xScale));

    // Add Y axis
    g.append('g')
      .call(axisLeft(yScale));

  }, [data, height, margin.bottom, margin.left, margin.right, margin.top, width]);

  return (
    <svg ref={svgRef} width={width} height={height} />
  );
};

export default Heatmap;
