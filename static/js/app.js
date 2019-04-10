// ===================================
// Inital SVG chart setup
// ===================================
var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("id", "scatter-plot")
  .attr("preserveAspectRatio", `xMinYMin meet`) // necessary for responsive display
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`) // necessary for responsive display

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// default variables
var selectedXAxis = "poverty";
var selectedYAxis = "healthcare";

// ===================================
// Functions
// ===================================
// X Scale function
function xScale(data, selectedXAxis) {
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(data, d => d[selectedXAxis]) * .85, d3.max(data, d => d[selectedXAxis]) * 1.15])
  .range([0, width]);

  return xLinearScale;
}

// Y scale function
function yScale(data, selectedYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[selectedYAxis]) * .85, d3.max(data, d => d[selectedYAxis]) * 1.15])
    .range([height, 0]);
   
  return yLinearScale;
}

// X Axis function
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
 
  return xAxis;
}

//  Y Axis function
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
   
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
 
  return yAxis;
}

//  New markers function
function renderMarkers(markersGroup, newXScale, newYScale, selectedXAxis, selectedYAxis) {
  markersGroup.transition()
    .duration(1000)
    .attr("transform", d => {
      return `translate(${newXScale(d[selectedXAxis])}, ${newYScale(d[selectedYAxis])})`;
    });
 
  return markersGroup;
}

// Tool tip updater
function updateToolTip(selectedXAxis, selectedYAxis, markersGroup) {
  // X Axis Updater
  if (selectedXAxis === "poverty") {
    var xLabel1 = "Poverty:";
    var xLabel2 = "%";
    var xLabel3 = "";
  }
  else if (selectedXAxis === "age") {
    var xLabel1 = "Age:";
    var xLabel2 = "";
    var xLabel3 = "";
  }
  else {
    var xLabel1 = "Income:";
    var xLabel2 = "";
    var xLabel3 = "$";
  }

  // Y Axis Updater
  if (selectedYAxis === "healthcare") {
    var yLabel = "Lacks Healthcare:";
  }
  else if (selectedYAxis === "smokes") {
    var yLabel = "Smokes:";
  }
  else {
    var yLabel = "Obese:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    // .offset([20, 20])
    .html(function(d) {
      return (`${d.state}<br>
              ${yLabel} ${d[selectedYAxis]}%<br>
              ${xLabel1} ${xLabel3}${d[selectedXAxis]}${xLabel2}`);
    });

  markersGroup.call(toolTip);

  markersGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return markersGroup;
}

// ===================================
// Read CSV and plot
// ===================================
d3.csv("https://wbrueske.github.io/Health-Risks-vs-Demographics/static/data/data.csv").then(function(data) {

  // Convert data from select columns to numerical values
  // for use in functions and plotting
  data.forEach(function(d) {
    // X values
    d.poverty = +d.poverty;
    d.age = +d.age;
    d.income = +d.income;
    // Y values
    d.healthcare = +d.healthcare;
    d.obesity = +d.obesity;
    d.smokes = +d.smokes;

  });

  // ===================================
  // Axes
  // ===================================
  var xLinearScale = xScale(data, selectedXAxis);
  var yLinearScale = yScale(data, selectedYAxis);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  var titleGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, 0)`)
    .append("text")
    .classed("active", true)
    .text("Health Risks vs Demographics (2014)")

  // X Axis Labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 15})`);

  var poverty = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var age = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");
  
  var income = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");  

  // Y Axis Labels
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(0, ${height / 2}) rotate(-90)`);
  
  var healthcare = yLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -30)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");
  
  var smokes = yLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -50)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");
  
  var obesity = yLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -70)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");

  // ===================================
  // ===================================
  // Initial data point plotting
  // ===================================
  // Marker Group
  // I had to append a new "g" rather than use the original chartGroup "g" in order to append more "g"s.
  // If I don't do it this way, it only plots data starting at line 28 in the CSV.  I can only assume that's because
  // of the `.selectAll("g")` portion.  So the below mess is necessary.
  var markersGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`).selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", d => {
      return `translate(${xLinearScale(d[selectedXAxis])}, ${yLinearScale(d[selectedYAxis])})`;
  });

  // Circle Labels
  // I appended the labels first in order to make them appear behind
  // the circles (the circles are transparent), otherwise the mouseover
  // events would trigger on the circles *and* the text, which would
  // cause the tooltip to shift down slightly and remove the stroke
  // emphasis on the circle.
  var circleLabels = markersGroup.append("text")
  .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("y", "4")
    .html(d => d.abbr);
    
  // Circles
  var circlesGroup = markersGroup.append("circle")
    .attr("r", 12)
    .attr("fill", "darkcyan")
    .attr("stroke", "black")
    .attr("opacity", .5);

  circlesGroup.on("mouseover", function(d) {
    d3.select(this).attr("stroke-width", "3px");
  })
    .on("mouseout", function(d) {
      d3.select(this).attr("stroke-width", "1px");
    });

  // toolTips applied to markersGroup
  markersGroup = updateToolTip(selectedXAxis, selectedYAxis, markersGroup);

  // ===================================
  // End datapoint plotting
  // ===================================
  // ===================================


  // ===================================
  // Event Listeners
  // ===================================
  // X axis event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xValue = d3.select(this).attr("value");
      if (xValue !== selectedXAxis) {

        // replaces chosenXAxis with value
        selectedXAxis = xValue;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, selectedXAxis);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        markersGroup = renderMarkers(markersGroup, xLinearScale, yLinearScale, selectedXAxis, selectedYAxis);

        // updates tooltips with new info
        markersGroup = updateToolTip(selectedXAxis, selectedYAxis, markersGroup);

        // changes classes to change bold text
        if (selectedXAxis === "poverty") {
          poverty
            .classed("active", true)
            .classed("inactive", false);
          age
            .classed("active", false)
            .classed("inactive", true);
          income
            .classed("active", false)
            .classed("inactive", true)
        }
        else if (selectedXAxis === "age") {
          poverty
            .classed("active", false)
            .classed("inactive", true);
          age
            .classed("active", true)
            .classed("inactive", false);
          income
            .classed("active", false)
            .classed("inactive", true)
        }
        else {
          poverty
            .classed("active", false)
            .classed("inactive", true);
          age
            .classed("active", false)
            .classed("inactive", true);
          income
            .classed("active", true)
            .classed("inactive", false)
        }
      }
  });

  // Y Axis event listener
  yLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yValue = d3.select(this).attr("value");
      if (yValue !== selectedYAxis) {

        // replaces selectedYAxis with value
        selectedYAxis = yValue;

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(data, selectedYAxis);

        // updates y axis with transition
        yAxis = renderYAxis(yLinearScale, yAxis);

        // updates circles with new y values
        markersGroup = renderMarkers(markersGroup, xLinearScale, yLinearScale, selectedXAxis, selectedYAxis);

        // updates tooltips with new info
        markersGroup = updateToolTip(selectedXAxis, selectedYAxis, markersGroup);

        // changes classes to change bold text
        if (selectedYAxis === "healthcare") {
          healthcare
            .classed("active", true)
            .classed("inactive", false);
          smokes
            .classed("active", false)
            .classed("inactive", true);
          obesity
            .classed("active", false)
            .classed("inactive", true)
        }
        else if (selectedYAxis === "smokes") {
          healthcare
            .classed("active", false)
            .classed("inactive", true);
          smokes
            .classed("active", true)
            .classed("inactive", false);
          obesity
            .classed("active", false)
            .classed("inactive", true)
        }
        else {
          healthcare
            .classed("active", false)
            .classed("inactive", true);
          smokes
            .classed("active", false)
            .classed("inactive", true);
          obesity
            .classed("active", true)
            .classed("inactive", false)
        }
      }
  });

});