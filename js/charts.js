d3.json("../data/samples.json").then(function(data){
  console.log(data);
});

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("../data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("../data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("../data/samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var bbSamples = data.samples; 
    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = bbSamples.filter(sampleObj => sampleObj.id == sample); 
    // DELIVERABLE 3 part 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata; 
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);


    //  Create a variable that holds the first sample in the array.
    var sampleResult = sampleArray[0]; 

    //DELIVERABLE 3 part 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];


    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = sampleResult.otu_ids; 
    var otuLabels = sampleResult.otu_labels;
    var sampleValues = sampleResult.sample_values; 

    // DELIVERABLE 3 part 3. Create a variable that holds the washing frequency
    var wfreq = parseFloat(result.wfreq);


    // Create the yticks for the bar chart.
    var yticks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse(); 

    // Create the trace for the bar chart. 
    var barData = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    // Create the trace for the bubble chart.
    var bubbleData = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIds, 
        colorscale: 'Portland',
        size: sampleValues,
        opacity: [0.6, 0.7, 0.8, 0.9],
      type: "scatter"
  }
};
  
    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID"}, 
      showlegend: false,
      height: 600,
      width: 1200
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 

    // DELIVERABLE 3 part 4. Create the trace for the gauge chart.
    var gaugeData = {
      domain: { x: [0, 1], y: [0, 1] },
		  value: wfreq,
		  title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week"},
		  type: "indicator",
		  mode: "gauge+number",
        gauge: { axis: { range: [null, 10]},
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "#20cc16" },
          { range: [8, 10], color: "green" },
      ]}
    };
  
    // DELIVERABLE 3 part 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600,
      height: 400
    };
    console.log(wfreq);
    //DELIVERABLE 3 part 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
});
}

