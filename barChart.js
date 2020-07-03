const color = ["#bd0026", "#ff002b", "#253494", "#3c6bff", "#006837", "#00a012"];
const colorDataMapping = {
    'sökandeMan': "#bd0026", 'sökandeKvinna': "#ff002b", 'antagnaMan': '#253494', 'antagnaKvinna': '#3c6bff', 'examenMan': "#006837", 'examenKvinna': '#00a012'
}
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function handleChange(e, name) {
    if (!e.checked) {
        let index = keys.indexOf(name)
        if (index > -1) {
            keys.splice(index, 1)
        }
    } else {
        if (name in originalData[0]) {
            keys = keys.concat(name)
        }
    }
    plotChart(data, keys, 750)
}

var originalData;
var data
var keys
var originalKeys;

var svg = d3.select("#chart"),
    margin = { top: 55, left: 45, bottom: 5, right: 75 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand()
    .range([margin.left, width - margin.right])
    .padding(0.02)

var y = d3.scaleLinear()
    .rangeRound([height - margin.bottom, margin.top])

var xAxis = svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis")

var yAxis = svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")

const z = d3.scaleOrdinal()
    .range(color);

//X Axis Label
svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 30)
    .style("text-anchor", "middle")
    .text("År");

//Y Axis Label
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -5)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Antal");

//Load Data
d3.csv("data.csv", function (d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i)
        t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}, function (error, result) {
    if (error) throw error;

    originalKeys = result.columns.slice(1);
    keys = JSON.parse(JSON.stringify(originalKeys))
    originalData = result;
    data = result
    plotChart(data, keys, 0)
})

//Function to plot chart
function plotChart(data, keys, speed) {

    keys.sort(function (a, b) {
        return originalKeys.indexOf(a) - originalKeys.indexOf(b);
    });
    let newColors = keys.map(k => colorDataMapping[k])
    const z = d3.scaleOrdinal()
        .range(newColors)
        .domain(keys);

    y.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]).nice();

    svg.selectAll(".y-axis").transition().duration(speed)
        .call(d3.axisLeft(y).ticks(null, "s"))

    x.domain(data.map(d => d.år));

    svg.selectAll(".x-axis").transition().duration(speed)
        .call(d3.axisBottom(x).tickSizeOuter(0))

   // console.log(data)

    var stackedData = d3.stack().keys(keys)(data)
    
    for(var i = 0; i < stackedData.length; i++){
            for(var j = 0; j < stackedData[i].length; j++){
               // console.log(stackedData[i].key)
                if(stackedData[i].key === "sökandeMan"){
                    for(var k = 0; k < stackedData[i][k].length; k++){
                        stackedData[i][j].id = 1;
                    }
                }
                 else if(stackedData[i].key === "sökandeKvinna"){
                    for(var k = 0; k < stackedData[i][k].length; k++){
                        stackedData[i][j].id = 2;
                    }
                }
                 else if(stackedData[i].key === "antagnaMan"){
                    for(var k = 0; k < stackedData[i][k].length; k++){
                        stackedData[i][j].id = 3;
                    }
                }
                 else if(stackedData[i].key === "antagnaKvinna"){
                    for(var k = 0; k < stackedData[i][k].length; k++){
                        stackedData[i][j].id = 4;
                    }
                }
                 else if(stackedData[i].key === "examenMan"){
                    for(var k = 0; k < stackedData[i][k].length; k++){
                        stackedData[i][j].id = 5;
                    }
                }
                else{
                    for(var k = 0; k < stackedData[i][k].length; k++){
                        stackedData[i][j].id = 6;
                    }
                }   
            }
      }
/*
    for(var i = 0; i < stackedData.length; i++){
    for(var j = 0; j < stackedData[i].length; j++){
      for(var k = 0; k < stackedData[i][k].length; k++){
        //console.log(data1[i][k])
        stackedData[i][j].id = i + 1
      }
    }
  }  
*/

    // Create Bar Groups
    var group = svg.selectAll("g.layer")
        .data(stackedData, d => d.key)

    group.exit().remove()

    group.enter().append("g")
        .classed("layer", true)
        .attr("fill", d => z(d.key));

    // Create Bars
    var bars = svg.selectAll("g.layer").selectAll("rect")
        .data(d => d);

    bars.exit().remove()

    bars.enter().append("rect")
    .attr("class", "bar")
    .attr("id",function(d,i){return  i})
        .attr("width", x.bandwidth())
        .on("mouseover", function (d) {
         //   debugger
        //    console.log(d)
            tooltip.style("display", null);
        })
        .on("mouseout", function () { tooltip.style("display", "none"); })
        .on("mousemove", function (d) {
           // console.log(d);
           // console.log( document.querySelector('rect').__data__ )
           // console.log(this)
           // console.log(d.key)
            var xPosition = d3.mouse(this)[0] - 55;
            var yPosition = d3.mouse(this)[1] - 65;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            if(d.id === 1){
                tooltip.select("text").text("Totalt sökande: " + ((d.data.sökandeMan) + (d.data.sökandeKvinna)))
                tooltip.select(".secondLine").text("Män: " + d.data.sökandeMan + " st" + ", " + (Math.round(100 / (d.data.sökandeMan + d.data.sökandeKvinna) * d.data.sökandeMan)) +"%" )
            }else if(d.id === 2) {
                tooltip.select("text").text("Totalt sökande: " + ((d.data.sökandeKvinna) + (d.data.sökandeMan)))
                tooltip.select(".secondLine").text("Kvinnor: " + d.data.sökandeKvinna + " st" + ", " + (Math.round(100 / (d.data.sökandeKvinna + d.data.sökandeMan) * d.data.sökandeKvinna)) +"%" )
            }else if(d.id === 3) {
                tooltip.select("text").text("Totalt antagna: " + ((d.data.antagnaMan) + (d.data.antagnaKvinna)))
                tooltip.select(".secondLine").text("Män: " + d.data.antagnaMan + " st" + ", " + (Math.round(100 / (d.data.antagnaMan + d.data.antagnaKvinna) * d.data.antagnaMan)) +"%" )
            }else if(d.id === 4) {
                tooltip.select("text").text("Totalt antagna: " + ((d.data.antagnaMan) + (d.data.antagnaKvinna)))
                tooltip.select(".secondLine").text("Kvinnor: " + d.data.antagnaKvinna + " st"+ ", " + (Math.round(100 / (d.data.antagnaKvinna + d.data.antagnaMan) * d.data.antagnaKvinna)) +"%" )
            }else if(d.id === 5) {
                tooltip.select("text").text("Totalt examen: " + ((d.data.examenKvinna) + (d.data.examenMan)))
                tooltip.select(".secondLine").text("Män: " + d.data.examenMan + " st"+ ", " + (Math.round(100 / (d.data.examenMan + d.data.examenKvinna) * d.data.examenMan)) +"%" )
            }else{
                tooltip.select("text").text("Totalt examen: " + ((d.data.examenKvinna) + (d.data.examenMan)))
                tooltip.select(".secondLine").text("Kvinor: " + d.data.examenKvinna + " st"+ ", " + (Math.round(100 / (d.data.examenKvinna + d.data.examenMan) * d.data.examenKvinna)) +"%" )
            }
        })
        .merge(bars)
        .transition().duration(speed)
        .attr("x", d => x(d.data.år))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))

        //tooltip.select("text").text(() => {
        //    return `${capitalizeFirstLetter(getKeyByValue(d.data, d[1] - d[0]))} : ${d[1] - d[0]}`
       // })


    // Draw legend
    var legend = svg.selectAll(".legend")
        .data(newColors)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 19 + ")"; });

    legend.append("rect")
        .attr("x", width - 50)
        .attr("width", 16)
        .attr("height", 16)
        .style("fill", function (d, i) { return newColors.slice()[i]; });

    legend.append("text")
        .attr("x", width -30)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("font-size", "11px")
        .attr("font-family", "sans-serif")
        .text(function (d, i) {
          //  debugger
            let name = getKeyByValue(colorDataMapping, d)
            return capitalizeFirstLetter(name)
        });

    // Tooltip, initial display is hidden
    var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("width", 135)
        .attr("height", 50)
        .attr("fill", "white")
        .style("opacity", 1)
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("z-index", "20000")
        .attr("stroke-width", 0.5)
        .attr("stroke", "black")

    tooltip.append("text")
        .attr("x", 62)
        .attr("dy", "1.6em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif")

    tooltip.append("text")
        .attr("class", "secondLine")
        .attr("x", 62)
        .attr("y", 25)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .style("fill", "steelblue")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        
        
      var title = chart1.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 16)
      .attr("text-anchor", "middle")
      .append("text")
      .text("Civilingenjör Medieteknik Linköpings Universitet")
      .attr("x", width -20)
      .attr("y", 5);
        

}
