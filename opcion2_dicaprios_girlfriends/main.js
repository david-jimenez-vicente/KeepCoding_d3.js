const diCaprioBirthYear = 1974;
const age = function(year) { return year - diCaprioBirthYear}
const today = new Date().getFullYear()
const ageToday = age(today)

// Creo las dimensiones del gráfico
const width = 800
const height = 600

// Márgenes
const margin = {
    top: 50,
    bottom: 40,
    left: 40,
    right: 10
}

// Ahora el elemento svg
const svg = d3.select("#chart")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)

// Creamos los grupos de la gráfica y los ejes
const elementGroup = svg.append("g")
    .attr("class", "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g").attr("class", "axisGroup")
const xAxisGroup = axisGroup.append("g")
    .attr("class", "xAxisGroup")
    .attr("transform", `translate(${margin.left}, ${height-margin.bottom})`)
const yAxisGroup = axisGroup.append("g")
    .attr("class", "yAxisGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Creamos la escala y los rangos
const x = d3.scaleBand().range([0, width-margin.left-margin.right]).padding(0.2)
const y = d3.scaleLinear().range([height-margin.bottom-margin.top, 0])

// Creamos los ejes
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

// Escala de colores para las barras de las novias
const colorScale = d3.scaleOrdinal(d3.schemePaired);

// Cargamos los datos
d3.csv("data.csv").then(data => {
    data.map(d => {
        d.year = +d.year;
        d.age = +d.age;
        d.leoAge = age(d.year);
    });
    // Crear los dominios
    x.domain(data.map(d => d.name));
    y.domain([0, d3.max(data, d => Math.max(d.age, d.leoAge))]);

    // Agregar la línea de DiCaprio
    elementGroup.append("path")
        .datum(data)
        .attr("class", "line DiCaprio")
        .attr("fill", "none")
        .attr("d", d3.line()
            .x(d => x(d.name) + x.bandwidth() / 2)
            .y(d => y(d.leoAge))
        );

    // Añado una leyenda a la línea de DiCaprio
    elementGroup.append("text")
    .attr("class", "leyenda")
    .attr("x", width - 210) 
    .attr("y", margin.top - 40) 
    .text("DiCaprio's Age"); 


    // Agregar las barras de las novias
    elementGroup.selectAll("bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.age))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - y(d.age))
        .attr("fill", d => colorScale(d.name));
        

    

    // Añado una línea gris intermitente en el año 25 como guía visual
    // Esta variable ayudará a que podamos cambiar el valor límite de edad de las novias con una función
    let thresholdLine = y(25);

    elementGroup.append("line")
        .attr("x1", 0)
        .attr("y1", thresholdLine)
        .attr("x2", width)
        .attr("y2", thresholdLine)
        .attr("class", "delimitador")

    elementGroup.append("text")
    .attr("class", "leyenda-delimitador")
    .attr("x", width - 170) 
    .attr("y", thresholdLine - 10) 
    .text("Limit = 25 years old"); 
        

    // Agregar ejes al gráfico
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    console.log(data)
})




    