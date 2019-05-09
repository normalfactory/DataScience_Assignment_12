/*
Functionality to build the custom gauge chart using Plotly.js

Scott McEachern
May 8, 2019
*/



function createScrubsGauge(numWeeklyScrubs){
/* Create the scrube gauge; customized from online example: https://plot.ly/javascript/gauge-charts/

Accepts : numWeeklyScrubs (int) number of weekly scrubs; used to display in gauge

Returns : undefined
*/

    console.log(`Start scrubs gague; num weekly scrubs: ${numWeeklyScrubs}`);


    //-- Create Path for needle

    //- Map to scrubs (0 to 9) to 180 degrees
    var level = numWeeklyScrubs * 20;


    //- Trig to calc meter point
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);


    //- Create Path
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);


    //-- Prepare Data
    var data = [{ 
        type: 'scatter',
        x: [0], 
        y: [0],
        marker: {
            size: 18, 
            color:'rgba(0,0,0,1)'},
        showlegend: false,
        name: 'Weekly scrubs',
        text: numWeeklyScrubs,
        hoverinfo: 'text+name'},
            { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
                rotation: 90,
                text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3',
                    '1-2', '0-1', ''], 
                textinfo: 'text',
                textposition:'inside',
                marker: {colors:[
                    'rgba(79, 138, 15, .8)',        //8-9
                    'rgba(102, 150, 31, .8)',     //7-8
                    'rgba(126, 162, 50, .8)',   // 6-7
                    'rgba(150, 174, 72, .8)',   // 5-6
                    'rgba(172, 187, 96, .8)',   // 4-5
                    'rgba(193, 199, 123, .8)',  // 3-4
                    'rgba(211, 211, 152, .8)',  // 2-3
                    'rgba(223, 220, 183, .8)',  // 1-2
                    'rgba(236, 233, 218, .8)',  //0-1
                    'rgba(0, 0, 0, 0)']},    // bottom part of pie
                labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '4-3', '3-4', '2-3', '1-2', ''],
                hoverinfo: 'label',
                hole: .5,
                type: 'pie',
                showlegend: false
        }];


    var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: 'rgba(0,0,0,1)',
            line: {
                color: 'rgba(0,0,0,1)'
            }
        }],
        title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
        xaxis: {
            zeroline:false, 
            showticklabels:false,
            showgrid: false, 
            range: [-1, 1]},
        yaxis: {
            zeroline:false, 
            showticklabels:false,
            showgrid: false, 
            range: [-1, 1]}
    };


    //- Display Chart
    Plotly.newPlot('gauge', data, layout);
}