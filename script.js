const pokemons = new Array();

let data;
let arrayLabels;
let arrayDataGraph;
let isPresent;
let color;
let backgroundColors;
let borderColors;
let orderId = true;
let orderName = true;
let orderWeight = true;

fetch("./pokemon.json")
    .then((response) => response.json())
    .then((x) => {
        data = x.pokemon;
        data.forEach(pokemon => {
            pokemons.push({ id: pokemon.id, name: pokemon.name, img: pokemon.img, weight: pokemon.weight.replace(/[^\d.-]/g, ''), type: pokemon.type })
        });
    });
let inputSearch = document.getElementById('txtSearch');
inputSearch.addEventListener('input', () => {
    console.log(inputSearch.value);
    createGraphArrays(filterArray(pokemons));
    printList(filterArray(pokemons));
});

function createGraphArrays(pokemons) {
    //create array with Lables (types of pokemons)
    arrayLabels = new Array();
    pokemons.forEach(pokemon => {
        /*pokemon.type.forEach(type=>{
            if(!arrayLabels.includes(pokemon.type[i])){
                arrayLabels.push(pokemon.type[i]);
            }
        })*/
        for (let i = 0; i < pokemon.type.length; i++) {
            isPresent = false;
            for (let q = 0; q < arrayLabels.length; q++) {
                if (arrayLabels[q] == pokemon.type[i]) {
                    isPresent = true;
                }
            }
            if (!isPresent) {
                arrayLabels.push(pokemon.type[i]);
            }
        }
    });
    //create array with amount of pokemons of each type
    arrayDataGraph = new Array();
    arrayLabels.forEach(label => {
        pokemonsOfTypeCount = 0;
        pokemons.forEach(pokemon => {
            for (let i = 0; i < pokemon.type.length; i++) {
                if (pokemon.type[i] === label) {
                    pokemonsOfTypeCount++;
                }
            }
        });
        arrayDataGraph.push(pokemonsOfTypeCount);
    });
    //create background and border colors for each type
    //randomly, having bg opacity at 0.2
    backgroundColors = new Array();
    borderColors = new Array();
    arrayLabels.forEach(label => {
        color = "";
        for (let i = 0; i < 3; i++) {
            color += Math.floor(Math.random() * 256).toString();
            if (i < 2) {
                color += ", ";
            }
        }
        //add value to bg
        backgroundColors.push(`rgba(${color}, 0.2)`);
        //add value to border
        borderColors.push(`rgb(${color})`);
    });
    createChart();
}


function filterArray(pokemons) {
    pokemons = pokemons.filter(pokemon => pokemon.name.toUpperCase().includes(inputSearch.value.toUpperCase()));
    return pokemons;
}

function printList(pokemons) {
    let pokeTableHtml = "";
    //add thead
    pokeTableHtml += "<table><thead><tr><th>#</th><th>Image</th><th>Name</th><th>Weight</th></tr></thead><tbody>"
    //fill the table
    pokemons.forEach(pokemon => {
        pokeTableHtml += `<tr><td onClick="orderList(pokemons, orderId, 0);">${pokemon.id}</td><td><img src="${pokemon.img}"></td><td onClick="orderList(pokemons, orderName, 1);">${pokemon.name}</td><td onClick="orderList(pokemons, orderWeight, 2);">${pokemon.weight}</td></tr>`;
    });
    //close the table
    pokeTableHtml += "</tbody></table>";
    //display the html
    document.querySelector("#result").innerHTML = pokeTableHtml;
}

//changes table onclick
function orderList(pokemons, order, num = -1) {
    switch (num) {
        case 0:
            orderId = !order;
            if (order) {
                pokemons = pokemons.sort((a, b) => (a.id - b.id));
            } else {
                pokemons = pokemons.sort((a, b) => (a.id - b.id)).reverse();
            }
            break;
        case 1:
            if (order) {
                pokemons = pokemons.sort((a, b) => {
                    if (a.name === b.name) return 0;
                    if (a.name > b.name) return 1;
                    if (a.name < b.name) return -1;
                });
            } else {
                pokemons = pokemons.sort((a, b) => {
                    if (a === b) return 0;
                    if (a > b) return 1;
                    if (a < b) return -1;
                }).reverse();
            }
            orderName = !order;
            break;
        case 2:
            if (order) {
                pokemons = pokemons.sort((a, b) => (a.weight - b.weight));
            } else {
                pokemons = pokemons.sort((a, b) => (a.weight - b.weight)).reverse();
            }
            orderWeight = !order;
            break;
        default:
            console.error("Unknow property as a num in _orderList");
            return;
    }
    printList(filterArray(pokemons));
}

function calcMitja() {
    let summ = 0;
    let pokeCount = 0;
    filterArray(pokemons).forEach(pokemon => {
        summ += parseInt(pokemon.weight);
        pokeCount++;
    });
    alert((summ / pokeCount).toFixed(2));
}

function createChart() {
    let myChart = Chart.getChart("myChart"); // <canvas> id
    if (myChart !== undefined) {
        myChart.destroy();
    }

    //create data requred for the Chart
    const data = {
        labels: arrayLabels,
        datasets: [{
            label: 'Pokemons ranked by types',
            data: arrayDataGraph,
            backgroundColor: backgroundColors,
            borderColor: borderColors
        }]
    };
    const config = {
        type: 'polarArea',
        data: data,
        options: {}
    };
    //display the chart
    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}