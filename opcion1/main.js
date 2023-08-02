// CHART START
// 1. aquí hay que poner el código que genera la gráfica
const width = 800
const height = 600
const margin = {
    top: 60,
    bottom: 40,
    right: 10,
    left: 40
}

// Creamos el svg
const svg = d3.select("div#chart").append("svg").attr("width", width).attr("height", height)

// Creamos los grupos de la gráfica y los ejes
const elementGroup = svg.append("g").attr("class", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g").attr("class", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("class", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height-margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("class", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

// Creamos la escala y los rangos
const x = d3.scaleBand().range([0, width-margin.left-margin.right]).padding(0.2)
const y = d3.scaleLinear().range([height-margin.bottom-margin.top, 0])

// Creamos los ejes
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

// Declaramos las variables para guardar los datos originales y los variados por el slider
let years;
let winners;
let originalData;

let title = svg.append("text")
    .attr("class", "title")
    .text("Football World Cup winners count to selected date")
    .attr("transform", `translate(${margin.left+20},${30})`)

const transformarTiempo = d3.timeParse("%Y")

// data:
d3.csv("WorldCup.csv").then(data => {
    // 2. aquí hay que poner el código que requiere datos para generar la gráfica
    originalData = data;
    years = data.map(d => d.Year)
    yearsSlider = data.map(d => transformarTiempo(d.Year))
    winners = data.map(d => d.Winner)
    // update:
    update(data)
    slider()
})


// update:
function update(data) {
    // 3. función que actualiza el gráfico
    // El slider seleccionará los winners hasta el año que seleccione.
    winners = data.map(d => d.Winner)

    // No quiero que los ejes cambien con los valores seleccionados por el slider, así dejamos fijos los dominios.
    x.domain(winners)
    y.domain([0,6])

    // Ahora los ticks
    yAxis.ticks(6)

    // Llamamos a los ejes
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    // Binding
    const elements = elementGroup.selectAll("rect").data(winners)
    elements.enter()
        .append("rect")
        .attr("class", "barras")
        .attr("x", d => x(d))
        .attr("y", d => y(winners.filter( f => f === d).length))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - y(winners.filter(f => f === d).length))

    elements
        .attr("x", d => x(d))
        .attr("y", d => y(winners.filter(f => f === d).length))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - y(winners.filter(f => f === d).length))
           

    elements.exit()
        .remove()    

}

// treat data:
function filterDataByYear(year) { 
    // 4. función que filtra los datos dependiendo del año que le pasemos (year)
    data = originalData
    data = data.filter(d => d.Year <= year)
    update(data)
    d3.select("p#anyo").text("To year: "+year);
}


// CHART END

// slider:

function slider() {    
    // esta función genera un slider:

    // Uso d3.format para formatear los años del slider como números enteros sin la coma
    var formatYear = d3.format("d");
    
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years))  // rango años
        .max(d3.max(years))
        .step(4)  // cada cuánto aumenta el slider (4 años)
        .width(580)  // ancho de nuestro slider en px
        .ticks(years.length)
        .tickFormat(formatYear) 
        .default(years[years.length -1])  // punto inicio del marcador
        .on('onchange', val => {
            // 5. AQUÍ SÓLO HAY QUE CAMBIAR ESTO:
            filterDataByYear(val)
            // hay que filtrar los datos según el valor que marquemos en el slider y luego actualizar la gráfica con update
        });

        // contenedor del slider
        var gTime = d3 
            .select('div#slider-time')  // div donde lo insertamos
            .append('svg')
            .attr('class','slider')
            .attr('width', width * 0.8)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');

        gTime.call(sliderTime);  // invocamos el slider en el contenedor

        d3.select('p#anyo').text("To year: "+sliderTime.value());  // actualiza el año que se representa
}