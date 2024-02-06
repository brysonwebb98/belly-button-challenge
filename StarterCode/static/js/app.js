// URL WITH THE DATA THAT WE ARE GOING TO REVIEW
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// THIS IS GOING TO SHOW THE DATA IN THE BOX
function displayMetadata(metadata) {
    let metadataDisplay = d3.select("#sample-metadata");

    // GETTING RID OF OLD DATA AND ALLOWING THE NEW DATA
    metadataDisplay.html("");

    // Iterate through the metadata object and create HTML elements to display key-value pairs
    Object.entries(metadata).forEach(([key, value]) => {
        metadataDisplay.append("p").text(`${key}: ${value}`);
    });
}

// FUNCTION TO UPDATE THE CHARTS
function updateCharts(subjectID) {
    d3.json(url).then(function(data) {
        console.log(data)
        let selectedSample = data.samples.find(sample => sample.id === subjectID);

        let barData = [{
            x: selectedSample.sample_values.slice(0, 10).reverse(),
            y: selectedSample.otu_ids.slice(0, 10).map(id => `otu_id ${id}`).reverse(),
            type: "bar",
            orientation: "h",
            text: selectedSample.otu_labels.slice(0, 10).reverse()
        }];
        Plotly.newPlot("bar", barData);

        let bubbleData = [{
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            mode: "markers",
            marker: {
                size: selectedSample.sample_values,
                color: selectedSample.otu_ids,
                colorscale: "Earth"
            }, 
            text: selectedSample.otu_labels
        }];

        Plotly.newPlot("bubble", bubbleData);

        // UPDATE BASED OFF OF THE SELECTED SUBJECT ID - USIGN PARSEINT MAKES SURE TO GET THE INT VALUE
        let selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(subjectID));
        displayMetadata(selectedMetadata);
    });
}

function init() {
    d3.json(url).then(function(data) {
        let dropdown = d3.select("#selDataset");
        let subjectIDs = data.names;
        
        subjectIDs.forEach((id) => {
            dropdown.append("option").text(id).property("value", id);
        });

        let initialSubjectID = subjectIDs[0];
        updateCharts(initialSubjectID);
    });
}

function optionChanged(selectedID) {
    updateCharts(selectedID);
}

init();
