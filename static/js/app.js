
// Creating intial function 
// Creates dropdown menu and sets graphs and demographic panel with an initial value
function init() {
    // Using D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // Using D3 library to read the samples.json file
    d3.json("../samples.json").then((data) => {
        console.log(data);
        // accessing the patient ids through the key "names"
        var ids = data.names;
        // logging the ids to check - get a 153 term long array of the ids
        //console.log(ids);

        // appending the values to the dropdown menu
        ids.forEach(function(x) {
            dropdownMenu.append("option").text(x).property("value", x);
          });       
    });

    // setting an intial index value for the first sample
    // running each function with that value
    var initialIndex = 0;
    demographic(initialIndex);
    startingPlots(initialIndex);
    extra(initialIndex);
};
// running the innit function
init();


// creating a function for the dempgrapic panel
// having a variable 'index', because this will reference the specific id selected in the dropdown menu and the index it relates to
function demographic(index) {
    d3.json("../samples.json").then((data) => {
       
        // obtaining the metadata section
        var metadata = data.metadata;
        //console.log(metadata);

        // obtaining a specific javascrip object from within the array using the index
        var idMetadata = metadata[index];
        //console.log(idMetadata);        

        //obtaining the location of the dempgraphic panel in the html file
        var panelBody = d3.select("#sample-metadata")

        // using object.entries to obtain the values to be printed in the panel as this looks at key/value pairs
        // adding the key value pairs to the panel with a h5 tag
        Object.entries(idMetadata).forEach(([key, value]) => {
            panelBody.append("h5").text(`${key}: ${value}`);
        })

})
};

//demographic();

// creating a function for the bar graph and the bubble chart.
// will be using variable index again as this will relate to the selected id in the dropdown menu and reference the index of the object needed from the sampleData array
function startingPlots(index){
    d3.json("../samples.json").then((data) => {

        // need to access the sample data section
        var sampleData = data.samples;
        // console.log(sampleData);

        // obtaining particular section using index
        var section = sampleData[index];

        //BAR CHART

        // obtaining the top ten values for the bar chart.
        var values = section.sample_values.slice(0, 10);
        // reversing the top ten values to accomodate the plotly graph set up
        var sample_values = values.reverse();
        // console.log(sample_values); //test

        // obtaining the top 10 labels for the bar chart.
        var ids = section.otu_ids.slice(0, 10);
        // reversing the top ten labels to accomodate the plotly graph set up
        var reverse_ids = ids.reverse();
        // using map to add 'OTU' before each label
        let otu_ids = reverse_ids.map((a) => {
            return `OTU ${a}`;
          })
        // console.log(otu_ids); //test

        // Obtaining the top ten hovertext values for the bar chart.
        var labels = section.otu_labels.slice(0, 10) ;
        // reversing the top ten hovertext values to accomodate the plotly graph set up
        var otu_labels = labels.reverse();
        // console.log(otu_labels ); //test

        // creating the trace for the bar chart
        var trace1 = [{
            type: 'bar',
            x: sample_values,
            y: otu_ids,
            text: otu_ids, 
            orientation: 'h',
            hoverinfo: otu_labels
          }];

        // creating the layout for the bar chart
        var layout = {
            title: "Sample Value of Top 10 OTUs",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
            };
        
        // plotting the bar chart
        Plotly.newPlot('bar', trace1, layout);

        // BUBBLE CHART

        // The bubble chart will plot all OTUs (not just top 10), so accessing the values again 
        var sample_values_bubble = section.sample_values
        var otu_ids_bubble = section.otu_ids
        var out_labels_bubble = section.otu_labels

        // creating the trace for the bubble chart
        var trace2 = [{
            x: otu_ids_bubble,
            y: sample_values_bubble,
            type: 'scatter',
            mode: 'markers',
            marker: {
                size: sample_values_bubble,
                color: otu_ids_bubble
            },
            text: out_labels_bubble

        }];
        
        // creating the layout for the bubble chart
        var layout2 = {
            title: 'Sample Value of All OTUs',
                showlegend: false,
                //height: 600,
                //width: 1000,
                xaxis:{title: "OTU ID"}            
        };

        // plotting the bubble chart
        Plotly.newPlot('bubble', trace2, layout2);
    })  
};

// Creating a function for the advanced challenge
function extra(index){

    d3.json("../samples.json").then((data) => {
        console.log(data);
        
        // accessing the metadata section as this is where the required key wfreq is located for each subject
        var metadata = data.metadata;
       
        // obtaining a specific javascript object from within the metadata array using the index
        var idMetadata = metadata[index];
        //console.log(idMetadata); 

        // selecting the variable 'number' as the number of washes for that subject
        // number will be between 0 and 9
        var number = parseInt(idMetadata.wfreq)
        // console.log(number);         

        // scaling'number'
        var scaledNumber = number * 20;
        // will be using trig to calculate the position of the arrow
        // number for the arrow position needs to be in degrees. So need to have 180 - scaledNumber indicating angle the arrow points to
        // therefore need to scale the number of washes for it to make sense in terms of the maximum value being 180 not 9
        // to scale from 9 to 180 need to multiply by 20, therefore will multiply all wash numbers by 20

        // Trig to calc the point of the arrow
        var degrees = 180 - scaledNumber,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path for the arrow
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        // creating the trace for the graph
        var trace3 = [{ type: 'scatter',
            x: [0], y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            text: scaledNumber,
            hoverinfo: 'text+name'},
            { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50], // setting the sections
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3', '1-2', '0-1', ''], // setting the text for the graph
            textinfo: 'text',
            textposition:'inside',	  
            marker: {colors:['rgba(23, 130, 50 .7)', 'rgba(14, 127, 0, .6)',
                                'rgba(14, 140, 0, .5)', 'rgba(110, 154, 22, .5)',
                                'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                                'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)', 
                                'rgba(232, 226, 202, .3)', 'rgba(255, 255, 255, 0)',]}, // setting the colours
            labels: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3', '1-2', '0-1', ''], // setting the text for the hover element
            hoverinfo: 'label', 
            hole: .5,
            type: 'pie',
            showlegend: false
        }];

        // defining the layout
        var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
            }],
        title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
        height: 500,
        width: 500,
        xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]}
        };

        // ploting the chart
        Plotly.newPlot('gauge', trace3, layout);    
    })
};


//UPDATING

// Calling optionChanged function when a change takes place to the DOM
d3.selectAll("body").on("change", optionChanged());

// This function is called when a dropdown menu item is selected
function optionChanged(idSelection) {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assigning the value of the dropdown menu option to a variable idSelection
    var idSelection = dropdownMenu.node().value;

    // now need to link the value idSlection to a index

    //maybe for changing: for index between whatever and whatever. if sampleData[idex].id = selected id then use that data

    // this is how we reach the actual id in the dictionary
        // so the dictionary needs to be accessed through the idndex, then find id with .id
        // this gets id for index 0

    d3.json("../samples.json").then((data) => {

        // need to access the sample data section
        var sampleData = data.samples;

        // looping through each dictionary in sampledata
        // this is so we can find which particular object/dictionary matches the one selected through the dropdown menu
        for (var i = 0; i < sampleData.length; i++) {
            // comparing the id selected in the dropdown menu to the id of each object
            if(sampleData[i].id == idSelection){

                // if they match then the index of the object is obtained
                // this will then be used to change the graphs
                index = i;

                // selecting the current values in the demographic panel
                var currentInfo = d3.select("#sample-metadata").selectAll("h5");
                // console.log(currentInfo)
                // removing the current values in the demographic panel
                currentInfo.remove();

                // Updating the plots with the index value based on the selected id
                startingPlots(index);
                // Updating the demographic panel with the index value based on the selected id
                demographic(index);
                // updating the bonus challenge gauge chart
                extra(index);

            
            }
        }

    });

};



