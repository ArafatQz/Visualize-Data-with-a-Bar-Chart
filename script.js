const margin = { top: 60, right: 20, bottom: 60, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Add title
svg.append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("United States GDP");

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(data => {
        const dataset = data.data;
        const dates = dataset.map(d => new Date(d[0]));
        const gdps = dataset.map(d => d[1]);

        // X scale (time)
        const xScale = d3.scaleTime()
            .domain([d3.min(dates), d3.max(dates)])
            .range([0, width]);

        // Y scale (linear)
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(gdps)])
            .range([height, 0]);

        // Create axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // Append X axis
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        // Append Y axis
        svg.append("g")
            .attr("id", "y-axis")
            .call(yAxis);

        // Calculate bar width based on time interval
        const barWidth = xScale(dates[1]) - xScale(dates[0]);

        // Create bars
        svg.selectAll(".bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1])
            .attr("x", d => xScale(new Date(d[0])))
            .attr("y", d => yScale(d[1]))
            .attr("width", barWidth)
            .attr("height", d => height - yScale(d[1]))
            .on("mouseover", function(event, d) {
                d3.select("#tooltip")
                    .style("opacity", 0.9)
                    .attr("data-date", d[0])
                    .html(`${d[0]}<br>$${d[1]} Billion`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on("mouseout", function() {
                d3.select("#tooltip").style("opacity", 0);
            });
    });