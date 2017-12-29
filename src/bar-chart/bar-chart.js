const margin = { top: 10, right: 20, bottom: 60, left: 30 };
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
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

const data = [
  {score: 63, subject: 'Mathematics'},
  {score: 82, subject: 'Geography'},
  {score: 74, subject: 'Spelling'},
  {score: 97, subject: 'Reading'},
  {score: 52, subject: 'Science'},
  {score: 74, subject: 'Chemistry'},
  {score: 97, subject: 'Physics'},
  {score: 52, subject: 'ASL'}
];

const yScale = d3.scaleLinear()
  .domain([0, 100])
  .range([height, 0]);
const yAxis = d3.axisLeft(yScale);
svg.call(yAxis);

const xScale = d3.scaleBand()
  .padding(0.2)
  .domain(data.map(d => d.subject))
  .range([0, width]);

const xAxis = d3.axisBottom(xScale)
  .ticks(5)
  .tickSize(10)
  .tickPadding(5);
svg
  .append('g')
    .attr('transform', `translate(0, ${height})`)
  .call(xAxis)
  .selectAll('text')
  .style('text-anchor', 'end')
  .attr('transform', 'rotate(-45)');

svg.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', d => xScale(d.subject))
  .attr('y', d => yScale(d.score))
  .attr('width', d => xScale.bandwidth())
  .attr('height', d => height - yScale(d.score));
