// first lets learn how to map abstract data values to a visual representation
// Let's use a linear scale to normalize scores from 0 to 100 to values from 0 to 600 (pixels) using a linear mapping
const linearScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 600])
  .clamp(true);               // clip any values outside our scale

const normalizedScores = [
  linearScale(-20),           // note that this value is outside our scale
  linearScale(0),
  linearScale(50),
  linearScale(100),
  linearScale(108)            // note that this value is outside our scale
];
console.log(normalizedScores);
console.log(linearScale.invert(500));

// now let's look at time scaling
const timeScale = d3.scaleTime()
  .domain([new Date(2017, 0, 1), new Date(2017, 11, 31)])
  .range([0, 100]);

const times = [
  timeScale(new Date(2017, 0, 1)),
  timeScale(new Date(2017, 6, 9)),
  timeScale(new Date(2017, 10, 13)),
  timeScale(new Date(2017, 11, 25)),
  timeScale(new Date(2017, 11, 31))
];
console.log(times);
console.log(timeScale.invert(50));

// discrete / quantized scaling
const quantizeScale = d3.scaleQuantize()
  .domain([0, 100])
  .range(['red', 'green', 'blue']);
const qValues = [
  quantizeScale(0),
  quantizeScale(33),
  quantizeScale(45),
  quantizeScale(76),
  quantizeScale(50),
  quantizeScale(1)
];
console.log(qValues);
console.log(quantizeScale.invertExtent('green'));

// discrete to discrete mapping (domain has quantized values)
const ordinalScale = d3.scaleOrdinal()
  .domain(['poor', 'good', 'great'])
  .range(['red', 'green', 'purple']);

const oValues = [
  ordinalScale('good'),
  ordinalScale('great'),
  ordinalScale('poor')
];
console.log(oValues);


// Loading and inspecting data
d3.json(`${getBaseUrl()}/data/ex1.json`, (err, data) => {
  console.log(data);
  console.log('min age:', d3.min(data, (d) => d.age));
  console.log('max age:', d3.max(data, (d) => d.age));

  // we can use `extent` to get the min and max values in an array
  const extent = d3.extent(data, (d) => d.age);  // [13, 38]
  console.log('extent of age:', extent);
  const scale = d3.scaleLinear()
    .domain(extent)
    .range([0, 600]);
  console.log(scale(24), scale(37));   // 264, 576

  // we can easily build a set of the unique age values:
  const ages = d3.set(data, (d) => d.age);
  console.log(ages.values());
});


// Selecting DOM elements in D3
const firstLink = d3.select('a');
console.log('firstLink:', firstLink.nodes());

const allLinks = d3.selectAll('a');
console.log('allLinks:', allLinks.nodes());

const div = d3.select('div');
const divLinks = div.selectAll('a');
console.log('divLinks:', divLinks.nodes());

// You can also use CSS descendant selector syntax:
console.log('divLinks using CSS descenant selector:', d3.selectAll('div a').nodes());

// You can also use class, id, and any other CSS selectors
const actionLink = d3.select('.action');
console.log('actionLink:', actionLink.nodes());

// Finally you can convert native JavaScript DOM nodes into D3 nodes using select and selectAll:
const domLinks = document.links;
const d3Links = d3.selectAll(domLinks);
console.log('d3Links:', d3Links.nodes());

// ### Modifying DOM elements ###
d3.select('a:nth-child(2)')               // on the 2nd link
  .attr('href', 'http://google.com')      // set the href attribute
  .classed('red', true)                   // and add a class value
  .html('Inventory <b>SALE</b>');         // and set the HTML content
// console.log('updated href:', secondLink.attr('href'));

// Adding DOM elements
d3.select('.title')                       // get the main div
  .append('div')                          // add a div
    .html('Details')                      // put text inside the div (append changes the selection)
    .style('color', 'green')              // style the div
    .append('button')                     // add a button inside the inner div
      .html('Search Here');               // put text inside the button

// Remove DOM elements
// d3.select('.action').remove();

// Visualizing Data Driven Documents
const scores = [
  {id: 1, name: 'Alice', score: 96 },
  {id: 2, name: 'Billy', score: 83 },
  {id: 3, name: 'Cindy', score: 91 },
  {id: 4, name: 'David', score: 96 },
  {id: 5, name: 'Emily', score: 88 },
];

const chartScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 600])
  .clamp(true);

const update = d3.select('.chart')
  .selectAll('div')    // any missing divs will get generated
  .data(scores, function(d) { return d ? d.name : this.innerText })
  .text((d) => d.name + ' ' + d.score)
  .style('color', 'blue');

const enter = update.enter()
  .append('div') // tell d3 to create and append a div for every data item that doesn't have a DOM element.
  .text((d) => d.name + ' ' + d.score)
  .style('color', 'green');

update.exit().remove();  // removes Walter div since there is no data for Walter

update.merge(enter)
  .style('width', d => chartScale(d.score) + 'px')
  .attr('class', 'bar');

/* Understanding D3 data joins: Enter/Update/Exit
     Enter selection: data with no DOM elements
     Update selection: data with DOM elements
     Exit selection: DOM elements with no data

     See: https://bost.ocks.org/mike/join/
*/

// Let's redraw this chart using SVG
const svgBar = d3.select('.svg-chart')
  .append('svg')
    .attr('width', 625)
    .attr('height', 300)
    .selectAll('g')
      .data(scores)
      .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(0, ${i * 33})`);

function fade(selection, opacity) {
  selection.style('fill-opacity', opacity);
}

function setFill(selection, color) {
  selection.style('fill', color);
}

svgBar.append('rect')
  .style('width', d => chartScale(d.score))
  .attr('class', 'svg-bar')
  .on('mouseover', function(d, i, elements) {
    d3.select(this)
      .call(setFill, 'orange');
    d3.selectAll(elements)
      .filter(':not(:hover)')
      .call(fade, 0.5);
  })
  .on('mouseout', function(d, i, elements) {
    d3.select(this)
      .call(setFill, 'lightgreen');
    d3.selectAll(elements)
      .call(fade, 1.0);
  });

svgBar.append('text')
  .attr('y', 20)
  .text( (d) => d.name + ' ' + d.score );

// add some interactivity
