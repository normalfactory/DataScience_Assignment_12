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

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


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
    });
}


function buildCharts(sample) {
/*

  Accepts : sample (string) unique identifier of the sample to display chart for

  Returns : undefined
*/

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  console.log("--> buildCharts");


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
