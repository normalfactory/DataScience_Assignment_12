/*
Functionality to build the charts using Plotly.js

Scott McEachern
May 8, 2019
*/


function buildMetadata(sample) {
/* Updates metadata information displayed; gets information from endpoint and then updates div

  Accepts : sample (string) unique identifier of the sample to get display the metadata for

  Returns : undefined
*/

    console.log("--> buildMetadata");


    d3.json(`/metadata/${sample}`).then((sourceMetadata) => {

      console.log('Received metadata from endpoint');


      //- Reference Div to Update
      var metadataDiv = d3.select("#sample-metadata");

      //- Clear Existing HTML
      metadataDiv.html("");


      //- Insert Metadata
      Object.entries(sourceMetadata).forEach(([key, value]) => {
          
          metadataDiv.append("p").text(`${key}: ${value}`)
      });


      //- Update Frequency Chart
      createScrubsGauge(sourceMetadata.WFREQ)
    });
}


function buildCharts(sample) {
/* Create the charts based on the sample ID provided

  Accepts : sample (string) unique identifier of the sample to display chart for

  Returns : undefined
*/

  console.log("--> buildCharts");


  d3.json(`/samples/${sample}`).then((sourceData) => {

    console.log("Received data from endpoint");

    //- Create Pie Chart
    createPieChart(sourceData);

    //- Create Bubble Chart
    createBubbleChart(sourceData);
  });
}


function createPieChart(sourceData) {
/* Creates a pie chart that contains the top 10 samples

Accepts : sourceData (Dictionary) Contains data for sample from endpoint
              "otu_ids": (int) list of IDs used as labels
              "otu_labels": (string) list of descriptive hovertext for charts
              "sample_values": (int) list of values

Returns : undefined
*/

  //-- Get Top Samples
  //- Combine Arrays into Object
  let combinedSourceData = [];

  for (let counter = 0; counter < sourceData["otu_ids"].length; counter++)
  {
    combinedSourceData.push(
      {"otu_ids": sourceData["otu_ids"][counter],
      "otu_labels": sourceData["otu_labels"][counter],
      "sample_values": sourceData["sample_values"][counter]
      });
  }

  //- Sort
  combinedSourceData.sort((a, b) => parseFloat(b.sample_values) - parseFloat(a.sample_values));

  //- Get Top 10
  let topCombinedSourceData = combinedSourceData.slice(0, 10);


  //-- Display Chart
  let trace = {
    labels: topCombinedSourceData.map(item => item.otu_ids),
    values: topCombinedSourceData.map(item => item.sample_values),
    hovertext: topCombinedSourceData.map(item => item.otu_labels),
    type: "pie",
    hoverinfo: "label+hovertext+percent+value"
  };

  let layout ={
    title: "Top 10 Samples"
  };

  Plotly.newPlot("pie", [trace], layout);


  console.log("Completed pie chart");
}


function createBubbleChart(sourceData){
/* Creates a bubble chart that contains all of the values provided

Accepts : sourceData (Dictionary) Contains data for sample from endpoint
              "otu_ids": (int) list of IDs used as labels
              "otu_labels": (string) list of descriptive hovertext for charts
              "sample_values": (int) list of values

Returns : undefined
*/

  //- Prepare Hover Text
  let hoverTextValues = [];

  for (let counter = 0; counter < sourceData.otu_ids.length; counter++){
    hoverTextValues.push(sourceData.otu_labels[counter]);
  }


  //- Prepare Data For Chart
  let trace = {
    x : sourceData.otu_ids,
    y : sourceData.sample_values,
    text : hoverTextValues,
    mode : "markers",
    marker :
    {
      size : sourceData.sample_values,
      color : sourceData.otu_ids,
      colorscale : 'Earth'
    }
  };

  let layout = {
    title : "Sample Information",
    showlegend : false,
    xaxis : {
      title : "OTU ID"
    },
    yaxis : {
      title : "Sample Values"
    }
  };


  //- Display Chart
  Plotly.newPlot("bubble", [trace], layout);

  console.log("Completed bubble chart")
}


function init() {
  /* Prepares page; loads the selDataset based on information from Names endpoint and then
  creates the charts.

    Accepts : nothing

    Returns : undefined
  */

  console.log("--> init");

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];

    console.log(`Create initial plots with first sample: ${firstSample}`);


    //- Update Charts/Metadata
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


function optionChanged(newSample) {
  /* User interactively changes the option dropdown within the UI; update the chants/metadata
  based on the sample provided.

    Accepts : newSample (string) unique identifier of the sample that was selected
  */

  console.log("--> optionChanged");
  console.log(`New sample value: ${newSample}`);


  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}



//- Initialize the dashboard
init();
