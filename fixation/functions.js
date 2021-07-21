let conf = {
  //   lineNumber: 10,
  popSize: 100,
  haploidGenomicMutationRate: 1,
  nCycles: 1000,
};

let vars = {
  lastMutationID: 0,
  fixedMutations: 0,
};

let chromosomes, IDs;

function refreshVars() {
  chromosomes = [...Array(conf.popSize * 2)].map(() => []);
  IDs = [...Array(conf.popSize * 2).keys()];
  vars.lastMutationID = 0;
}

refreshVars();

function checkIfFixation(IDs) {
  let first = IDs[0];
  for (const ID of IDs) {
    if (ID !== first) return false;
  }
  return true;
}

function getMutationIDs(howMany) {
  let IDs = [];
  for (let i = 0; i < howMany; i++) {
    IDs.push(vars.lastMutationID);
    vars.lastMutationID += 1;
  }
  return IDs;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getProportions(chromosomes) {
  let counts = {};
  chromosomes.forEach((chromosome) =>
    chromosome.forEach(
      (mutationID) => (counts[mutationID] = (counts[mutationID] || 0) + 1)
    )
  );
  let proportions = Object.values(counts).map((v) => v / (conf.popSize * 2));
  return proportions;
}

for (let i = 0; i <= conf.nCycles; i++) {

    if(i % 100 === 0) console.log(i, chromosomes[0].length, vars);
  //   document.querySelector("span.progress").innerHTML = `${i}/${conf.nCycles}`;

  // Add mutations
  chromosomes.forEach((chromosome) =>
    chromosome.push(...getMutationIDs(conf.haploidGenomicMutationRate))
  );
  // Next gen
  let newChromosomes = [],
    newIDs = [];
  for (const _ in chromosomes) {
    let randomInt = getRandomInt(conf.popSize * 2);
    let ID = IDs[randomInt];
    newChromosomes.push([...chromosomes[randomInt]]);
    newIDs.push(ID);
  }
  chromosomes = newChromosomes;
  IDs = newIDs;


  if (checkIfFixation(IDs)) {
    vars.fixedMutations += chromosomes[0].length;
    refreshVars();
  }
}

console.log("Get proportions");
let proportions = getProportions(chromosomes);
proportions.push(...Array(vars.fixedMutations).fill(1));
console.log(proportions);

console.log("Draw proportions");
drawProportions(proportions);

console.log("Done")

function drawProportions(data) {
  // D3js histogram

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // X axis: scale and draw:
  var x = d3
    .scaleLinear()
    .domain([0, 1.1]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3
    .histogram()
    .value(function (d) {
      return d;
    }) // I need to give the vector of value
    .domain(x.domain()) // then the domain of the graphic
    .thresholds(x.ticks(70)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear().range([height, 0]);
  y.domain([
    0,
    d3.max(bins, function (d) {
      return d.length;
    }),
  ]); // d3.hist has to be called before the Y axis obviously
  svg.append("g").call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", function (d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    })
    .attr("width", function (d) {
      return x(d.x1) - x(d.x0);
    })
    .attr("height", function (d) {
      return height - y(d.length);
    })
    .style("fill", "#69b3a2");
}
