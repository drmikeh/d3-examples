const data = [
  {name: 'Alice', math: 37,   science: 62,   language: 54},
  {name: 'Billy', math: null, science: 34,   language: 85},
  {name: 'Cindy', math: 86,   science: 48,   language: null},
  {name: 'David', math: 144,  science: null, language: 65},
  {name: 'Emily', math: 59,   science: 55,   language: 29}
];

const margin = { top: 10, right: 10, bottom: 30, left: 30 };
const FULL_WIDTH = 600;
const FULL_HEIGHT = 400;
const width = FULL_WIDTH - margin.left - margin.right;
const height = FULL_HEIGHT - margin.top - margin.bottom;

const svg = d3.select('.chart')
  .append('svg')
    .attr('width', FULL_WIDTH)
    .attr('height', FULL_HEIGHT)
    .call(responsivefy)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xScale = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([0, width])
  .padding(0.2);
svg
  .append('g')
    .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScale));

const yScale = d3.scaleLinear()
  .domain([0, 100])
  .range([height, 0]);
const yAxis = svg
  .append('g')
  .call(d3.axisLeft(yScale));

function render (subject = 'math', scaleYAxisToData = true) {
  const animationDelay = 500;
  const transition = d3.transition().duration(animationDelay);

  const update = svg.selectAll('rect')
    .data(data.filter(d => d[subject]), d => d.name);

  update.exit()
    .transition(transition)
    .attr('y', height)
    .attr('height', 0)
    .remove();

  if (scaleYAxisToData) {
    yScale.domain([0, d3.max(data, d => d[subject])]);
    yAxis
      .transition(transition)
      // .delay(animationDelay)
      .call(d3.axisLeft(yScale));
  }

  update
    .transition(transition)
    // .delay(update.exit().size() ? (2*animationDelay) : 0)
    .attr('y', d => yScale(d[subject]))
    .attr('height', d => height - yScale(d[subject]));

  update
    .enter()
    .append('rect')
    .attr('y', height)
    .attr('height', 0)
    .attr('x', d => xScale(d.name))
    .attr('width', d => xScale.bandwidth())
    .transition(transition)
    // .delay(update.exit().size() ? animationDelay : 0)
    .attr('y', d => yScale(d[subject]))
    .attr('height', d => height - yScale(d[subject]));

  d3.selectAll('button')
    .classed('selected', false);
  d3.select(`#${subject}-button`)
    .classed('selected', true);
}

render();
