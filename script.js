//Some d3 code adapted from Mike Bostock's website: http://bl.ocks.org*

var selectedDay = document.getElementById('daySelector').value;

function contains(array, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return true;
        }
        else if (array === value) {
            return true;
        }
    }
    return false;
}

function findIndex(array, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return i;
        }
    }
    return -1;
}
function origData() {
    d3.csv('time_use.csv', totalData);
    d3.csv('time_use.csv', dayData);
    d3.csv('average.csv', averageData);
    d3.csv('homework.csv', indData);
    d3.csv('men-women.csv', atusData);
}

var margin = {top: 40, right: 10, bottom: 32, left: 50},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

function atusData(error, data) {
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
    }

    var projects = [];

    for (var i = 0; i < data.length; i++) {
        projects.push(data[i].project);
    }

    projects.sort();

    console.log(data);

    var xScale = d3.scaleBand()
        .domain(projects)
        .rangeRound([0, width])
        .padding(.1);

    var yScale = d3.scaleLinear()
        .domain([d3.max(data, function (d) {
            var hours = d.women / 60;
            return hours;
        }), 0])
        .range([0, height]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    var chart = d3.select("#atusBar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top);

    var chartW = d3.select("#atusBarW")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top);

    chart.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.70em")
        .attr("transform", function(d) {
            return "rotate(-90)"
        });
    chart.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    chartW.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.70em")
        .attr("transform", function(d) {
            return "rotate(-90)"
        });
    chartW.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    function make_y_gridlines() {
        return d3.axisLeft(d3.scaleLinear()
            .domain([d3.max(data, function (d) {
                return d.women;
            }), 0])
            .range([0, height]));
    }

    d3.select("#atusGrid")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat(""));

    d3.select("#atusGridW")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat(""));

    var xmouse = 0;
    var ymouse = 0;

    chart.on("mousemove", function() {
        xmouse = d3.mouse(this)[0];
        ymouse = d3.mouse(this)[1];});

    chartW.on("mousemove", function() {
        xmouse = d3.mouse(this)[0];
        ymouse = d3.mouse(this)[1];});

    var bars = d3.select("#atusBars")
        .attr("transform", function(d, i) {return "translate(" + (margin.left) + ",0)";});
    var rects = bars.selectAll("rect")
        .data(data);

    var barsW = d3.select("#atusBarsW")
        .attr("transform", function(d, i) {return "translate(" + (margin.left) + ",0)";});
    var rectsW = barsW.selectAll("rect")
        .data(data);

    rects.enter()
        .append("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return height - yScale(d.men / 60);})
        .attr("y", function(d) {return yScale(d.men / 60)})
        .attr("transform", function(d) { return "translate(" + xScale(d.project) + ",0)"; })
        .on("mouseover", function() {tooltip.style("display", null);})
        .on("mouseout", function() {tooltip.style("display", "none");})
        .on("mousemove", function(d) {
            var xPosition = xmouse - 20;
            var yPosition = ymouse - 25;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text("Hours: " + Math.round(((d.men / 60) * 100)) / 100 );
        })
    ;

    rectsW.enter()
        .append("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return height - yScale(d.women / 60);})
        .attr("y", function(d) {return yScale(d.women / 60)})
        .attr("transform", function(d) { return "translate(" + xScale(d.project) + ",0)"; })
        .on("mouseover", function() {tooltipW.style("display", null);})
        .on("mouseout", function() {tooltipW.style("display", "none");})
        .on("mousemove", function(d) {
            var xPosition = xmouse - 20;
            var yPosition = ymouse - 25;
            tooltipW.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltipW.select("text").text("Hours: " + Math.round(((d.women / 60) * 100)) / 100 );
        })
    ;

    var tooltip = chart.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("width", 80)
        .attr("height", 20)
        .attr("fill", "white")
        .attr("stroke", "darkgray")
        .attr("stroke-width", "1px")
        .style("opacity", 0.5);

    tooltip.append("text")
        .attr("x", 40)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-family", "sans-serif");

    var tooltipW = chartW.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltipW.append("rect")
        .attr("width", 80)
        .attr("height", 20)
        .attr("fill", "white")
        .attr("stroke", "darkgray")
        .attr("stroke-width", "1px")
        .style("opacity", 0.5);

    tooltipW.append("text")
        .attr("x", 40)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-family", "sans-serif");
}

function dayData(error, csvData) {
    var projects = [];
    var dates = [];

    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
        var dataByDate = d3.nest()
            .key(function (d) {
                return d.date
            })
            .sortKeys(d3.ascending)
            .entries(csvData);

        var dataByCode = d3.nest()
            .key(function (d) {
                return d.project
            })
            .sortKeys(d3.ascending)
            .entries(csvData);

        for (var i = 0; i < dataByCode.length; i++) {
            if (!contains(projects, dataByCode[i].key)) {
                projects.push(dataByCode[i].key);
            }
        }

        dataByDate.forEach(function (d) {
            d.date = d.key;
            dates.push(d.key);
            d.duration = new Array(20).fill(0);
            for (var i = 0; i < d.values.length; i++) {
                var index = findIndex(projects, d.values[i].project);
                var s = new Date(d.values[i].startTime);
                var e = new Date(d.values[i].endTime);
                d.duration[index] += Math.abs(s - e) / 1000 / 60;
            }
            d.projects = [];
            for (var i = 0; i < projects.length; i++) {
                d.projects.push(projects[i]);
            }

            //  d.projects.sort();
        })
    }

    var index = 0;

    for (var i = 0; i < dates.length; i++) {
        index = findIndex(dates, selectedDay);
    }

    var xScale = d3.scaleBand()
        .domain(dataByDate[index].projects)
        .rangeRound([0, width])
        .padding(.1);

    var xScale1 = d3.scaleBand()
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
        .rangeRound([0, width])
        .padding(.1);

    var yScale = d3.scaleLinear()
        .domain([d3.max(dataByDate[index].duration, function (d) {
            var hours = d / 60;
            return hours;
        }), 0])
        .range([0, height]);

    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    var chart = d3.select("#dayChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top);

    d3.select("#yaxis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    d3.select("#xaxis")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.70em")
        .attr("transform", function(d) {
            return "rotate(-90)"
        });

    var xmouse = 0;
    var ymouse = 0;

    chart.on("mousemove", function() {
        xmouse = d3.mouse(this)[0];
        ymouse = d3.mouse(this)[1];});

    function make_y_gridlines() {
        return d3.axisLeft(d3.scaleLinear()
            .domain([d3.max(dataByDate[index].duration, function (d) {
                var hours = d / 60;
                return hours;
            }), 0])
            .range([0, height]));
    }

    d3.select("#gridDay")
        .attr("class", "grid")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat(""));

    var bars = d3.select("#barsDay")
        .attr("transform", function(d, i) {return "translate(" + (margin.left + 11) + ",0)";});
    var rects = bars.selectAll("rect")
        .data(dataByDate[index].duration);

    rects.exit().remove();

    rects.enter()
        .append("rect")
        .merge(rects)
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return height - yScale(d / 60);
        })
        .attr("y", function(d) {
            return yScale(d  / 60);
        })
        .attr("transform", function(d, i) {
            return "translate(" + (i * 21) + ",0)";
        })
        .on("mouseover", function() {tooltip.style("display", null);})
        .on("mouseout", function() {tooltip.style("display", "none");})
        .on("mousemove", function(d) {
            var xPosition = xmouse - 20;
            var yPosition = ymouse - 25;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text("Hours: " + Math.round(((d / 60) * 100)) / 100 );
        });

    var tooltip = chart.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("width", 60)
        .attr("height", 20)
        .attr("fill", "white")
        .attr("stroke", "darkgray")
        .attr("stroke-width", "1px")
        .style("opacity", 0.5);

    tooltip.append("text")
        .attr("x", 30)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-family", "sans-serif");

    var info = d3.select("#dayInfo");
    info.html("My days are highly varied, even on weekdays.<br />My sleep ranges from 11.57(!) hours on Thursday the 23rd, to 0 hours on Wedneday the 8th.<br />Homework ranges from 9.3 hours on Wednesday the 1st to 0 hours (many days).<br />I tend to choose one activity for the day (liesure, homework, etc.) and work on that almost exclusively. How this affects my productivity perhaps bears further scrutiny.");
}

function changeData() {
    // Load the file indicated by the select menu
    selectedDay = document.getElementById('daySelector').value;
    d3.csv('time_use.csv', dayData);
}

function indData(error, data) {
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
    }
    var numEntries = d3.select("#numEntries");
    if (data[0].numEntries >= 20) {
        numEntries.html(data[0].numEntries)
            .attr("style", "color: firebrick");
    }
    else if (data[0].numEntries < 20 && data[0].numEntries >= 8) {
        numEntries.html(data[0].numEntries)
            .attr("style", "color: coral");
    }
    else {
        numEntries.html(data[0].numEntries)
            .attr("style", "color: gold");
    }

    var shortDur = d3.select("#shortDur");
    if (data[0].shortestDuration >= "0:35:00") {
        shortDur.html(data[0].shortestDuration)
            .attr("style", "color: firebrick");
    }
    else if (data[0].shortestDuration < "0:35:00" && data[0].shortestDuration > "0:11:00") {
        shortDur.html(data[0].shortestDuration)
            .attr("style", "color: coral");
    }
    else {
        shortDur.html(data[0].shortestDuration)
            .attr("style", "color: gold");
    }

    var longDur = d3.select("#longDur");
    if (data[0].longestDuration >= "5:00:00" || data[0].longestDuration.length > 7) {
        longDur.html(data[0].longestDuration)
            .attr("style", "color: firebrick");
    }
    else if (data[0].longestDuration < "5:00:00" && data[0].longestDuration > "1:00:00") {
        longDur.html(data[0].longestDuration)
            .attr("style", "color: coral");
    }
    else {
        longDur.html(data[0].longestDuration)
            .attr("style", "color: gold");
    }

    var varDur = d3.select("#varDur");
    if (data[0].varianceDuration >= "0.20%") {
        varDur.html(data[0].varianceDuration)
            .attr("style", "color: firebrick");
    }
    else if (data[0].varianceDuration < "0.20%" && data[0].varianceDuration > "0.10%") {
        varDur.html(data[0].varianceDuration)
            .attr("style", "color: coral");
    }
    else {
        varDur.html(data[0].varianceDuration)
            .attr("style", "color: gold");
    }

    var avStartTime = d3.select("#avStartTime");
    if (data[0].averageStartTime.length < 5) {
        data[0].averageStartTime = "0" + data[0].averageStartTime;
    }
    if (data[0].averageStartTime >= "20:00") {
        avStartTime.html(data[0].averageStartTime)
            .attr("style", "color: firebrick");
    }
    else if (data[0].averageStartTime < "20:00" && data[0].averageStartTime > "16:00") {
        avStartTime.html(data[0].averageStartTime)
            .attr("style", "color: coral");
    }
    else {
        avStartTime.html(data[0].averageStartTime)
            .attr("style", "color: gold");
    }

    var avEndTime = d3.select("#avEndTime");
    if (data[0].averageEndTime.length < 5) {
        data[0].averageEndTime = "0" + data[0].averageEndTime;
    }
    if (data[0].averageEndTime >= "20:00") {
        avEndTime.html(data[0].averageEndTime)
            .attr("style", "color: firebrick");
    }
    else if (data[0].averageEndTime < "20:00" && data[0].averageEndTime > "16:00") {
        avEndTime.html(data[0].averageEndTime)
            .attr("style", "color: coral");
    }
    else {
        avEndTime.html(data[0].averageEndTime)
            .attr("style", "color: gold");
    }

    var earlyStart = d3.select("#earlyStart");
    if (data[0].earliestStartTime.length < 5) {
        data[0].earliestStartTime = "0" + data[0].earliestStartTime;
    }
    if (data[0].earliestStartTime >= "20:00") {
        earlyStart.html(data[0].earliestStartTime)
            .attr("style", "color: firebrick");
    }
    else if (data[0].earliestStartTime < "20:00" && data[0].earliestStartTime > "16:00") {
        earlyStart.html(data[0].earliestStartTime)
            .attr("style", "color: coral");
    }
    else {
        earlyStart.html(data[0].earliestStartTime)
            .attr("style", "color: gold");
    }

    var lateStart = d3.select("#lateStart");
    if (data[0].latestStartTime.length < 5) {
        data[0].latestStartTime = "0" + data[0].latestStartTime;
    }
    if (data[0].latestStartTime >= "20:00") {
        lateStart.html(data[0].latestStartTime)
            .attr("style", "color: firebrick");
    }
    else if (data[0].latestStartTime < "20:00" && data[0].latestStartTime > "16:00") {
        lateStart.html(data[0].latestStartTime)
            .attr("style", "color: coral");
    }
    else {
        lateStart.html(data[0].latestStartTime)
            .attr("style", "color: gold");
    }

    var varStart = d3.select("#varStart");
    if (data[0].varianceStartTime >= "5%" || data[0].varianceEndTime.length > 5) {
        varStart.html(data[0].varianceStartTime)
            .attr("style", "color: firebrick");
    }
    else if (data[0].varianceStartTime < "5%" && data[0].varianceStartTime > "2%") {
        varStart.html(data[0].varianceStartTime)
            .attr("style", "color: coral");
    }
    else {
        varStart.html(data[0].varianceStartTime)
            .attr("style", "color: gold");
    }

    var earlyEnd = d3.select("#earlyEnd");
    if (data[0].earliestEndTime.length < 5) {
        data[0].earliestEndTime = "0" + data[0].earliestEndTime;
    }
    if (data[0].earliestEndTime >= "20:00") {
        earlyEnd.html(data[0].earliestEndTime)
            .attr("style", "color: firebrick");
    }
    else if (data[0].earliestEndTime < "20:00" && data[0].earliestEndTime > "16:00") {
        earlyEnd.html(data[0].earliestEndTime)
            .attr("style", "color: coral");
    }
    else {
        earlyEnd.html(data[0].earliestEndTime)
            .attr("style", "color: gold");
    }

    var lateEnd = d3.select("#lateEnd");
    if (data[0].latestEndTime.length < 5) {
        data[0].latestEndTime = "0" + data[0].latestEndTime;
    }
    if (data[0].latestEndTime >= "20:00") {
        lateEnd.html(data[0].latestEndTime)
            .attr("style", "color: firebrick");
    }
    else if (data[0].latestEndTime < "20:00" && data[0].latestEndTime > "16:00") {
        lateEnd.html(data[0].latestEndTime)
            .attr("style", "color: coral");
    }
    else {
        lateEnd.html(data[0].latestEndTime)
            .attr("style", "color: gold");
    }

    var varEnd = d3.select("#varEnd");
    if (data[0].varianceEndTime >= "5%" || data[0].varianceEndTime.length > 5) {
        varEnd.html(data[0].varianceEndTime)
            .attr("style", "color: firebrick");
    }
    else if (data[0].varianceEndTime < "5%" && data[0].varianceEndTime > "2%") {
        varEnd.html(data[0].varianceEndTime)
            .attr("style", "color: coral");
    }
    else {
        varEnd.html(data[0].varianceEndTime)
            .attr("style", "color: gold");
    }


    var info = d3.select("#actInfo");
    info.html(data[0].info);
}

function changeActData() {
    // Load the file indicated by the select menu
    var activity = document.getElementById('activitySelector').value;
    d3.csv(activity + '.csv', indData);
}

function averageData(error, data) {
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {

    }

    var radius = 150;

    var arc = d3.arc()
        .outerRadius(radius -10)
        .innerRadius(100);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.percentage;
        });

    var svg = d3.select("#avChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + (width + margin.left + margin.right) / 2 + "," + (height) / 2  + ")");

    var xmouse = 0;
    var ymouse = 0;

    svg.on("mousemove", function() {
        xmouse = d3.mouse(this)[0];
        ymouse = d3.mouse(this)[1];});

    var arcs = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g");

    arcs.append("path")
        .attr("d", arc)
        .style("fill", function(d) {
            return d.data.color; })
        .on("mouseover", function() {tooltip.style("display", null);})
        .on("mouseout", function() {tooltip.style("display", "none");})
        .on("mousemove", function(d) {
            var xPosition = xmouse - 20;
            var yPosition = ymouse - 25;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text(d.data.projects + ": " + d.data.time);
        });

    var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("width", 110)
        .attr("height", 20)
        .attr("fill", "white")
        .attr("stroke", "darkgray")
        .attr("stroke-width", "1px")
        .style("opacity", 0.5);

    tooltip.append("text")
        .attr("x", 55)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-family", "sans-serif");

    arcs.append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "4em")
        .attr("y", 15)
        .text("24 hours");

    var info = d3.select("#avInfo");
    info.html(
        "This chart represents my \"average\" day over the course of these two weeks. In other words, if I put in all 20 activities into a single day, this is how much time I would have spent doing them in a single 24-hour period."
    );
}

function totalData(error, csvData) {
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
        var dataByCode = d3.nest()
            .key(function (d) {return d.project})
            .sortKeys(d3.ascending)
            .rollup(function (d) {
                return d3.sum(d, function(g) {return Math.abs(d3.timeMinute.count(new Date(g.endTime), new Date(g.startTime)))});
            }).entries(csvData);

        dataByCode.forEach(function (d) {
            d.project = d.key;
            d.duration = d.value;
        })
    }

    var projects = [];

    for (var i = 0; i < dataByCode.length; i++) {
        projects.push(dataByCode[i].project);
    }

    projects.sort();

    var xScale = d3.scaleBand()
        .domain(projects)
        .rangeRound([0, width])
        .padding(.1);

    var yScale = d3.scaleLinear()
        .domain([d3.max(dataByCode, function (d) {
            var hours = d.duration / 60;
            return hours;
        }), 0])
        .range([0, height]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    var chart = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top);

    chart.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.70em")
        .attr("transform", function(d) {
            return "rotate(-90)"
        });
    chart.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    function make_y_gridlines() {
        return d3.axisLeft(d3.scaleLinear()
            .domain([d3.max(dataByCode, function (d) {
                return d.duration / 60;
            }), 0])
            .range([0, height]));
    }

    chart.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat(""));

    var xmouse = 0;
    var ymouse = 0;

    chart.on("mousemove", function() {
        xmouse = d3.mouse(this)[0];
        ymouse = d3.mouse(this)[1];});

    var bars = chart.append("g")
        .attr("id", "#barChart")
        .attr("class", "bars")
        .attr("transform", function(d, i) {return "translate(" + margin.left + ",0)";});

    var rects = bars.selectAll("rect")
        .data(dataByCode);

    rects.exit().remove();

    rects.enter()
        .append("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return height - yScale(d.duration / 60);})
        .attr("y", function(d) {return yScale(d.duration / 60)})
        .attr("transform", function(d) { return "translate(" + xScale(d.project) + ",0)"; })
        .on("mouseover", function() {tooltip.style("display", null);})
        .on("mouseout", function() {tooltip.style("display", "none");})
        .on("mousemove", function(d) {
            var xPosition = xmouse - 20;
            var yPosition = ymouse - 25;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text("Hours: " + Math.round(((d.duration / 60) * 100)) / 100 );
        });

    var tooltip = chart.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("width", 80)
        .attr("height", 20)
        .attr("fill", "white")
        .attr("stroke", "darkgray")
        .attr("stroke-width", "1px")
        .style("opacity", 0.5);

    tooltip.append("text")
        .attr("x", 40)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-family", "sans-serif");

    var info = d3.select("#totalInfo");
    var sum = 0;
    for (var i = 0; i < dataByCode.length; i++) {
        sum += dataByCode[i].duration;
    }
    info.html("Total hours recorded during 2 weeks: " + Math.round(sum / 60) +
        "<ul>" +
        "<li>36.4% of my time was spent sleeping</li>" +
        "<li>12.3% of my time was spent doing homework</li>" +
        "<li>11.0% of my time was spent traveling</li>" +
        "<ul><li>I did travel to Capitol Reef during this two weeks, so my traveling data is slightly higher than it would otherwise be.</li></ul>" +
        "<li>8.0% of my time was spent on personal hygiene and grooming</li>" +
        "<li>5.7% of my time was spent socializing</li>" +
        "<ul><li>These two numbers were surprising to me--I'm generally aware of the time I spend with friends, but I was not aware that I spent that much time on personal care. To be fair, this percentge isn't totally accurate--I was with friends/socializing sometimes when the main activity was something else (fitness, restaurants, TV, etc., but still).</li></ul>" +
        "</ul>");
}

window.onload = origData();
