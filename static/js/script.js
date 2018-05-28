let chart = null;
let model = "";


$(function () {
    refreshChart();
    setInterval(refreshChart, 5000);
    $.getJSON('/target', function (data) {
        $("#current-target").val(data);
    });
});


function refreshChart() {
    $.getJSON('/scores', function (data) {
        $("#data").html(JSON.stringify(data));
        let keys = [], values = [];
        model = "";
        for (let k in data) {
            keys.push(k);
            values.push(data[k]);
            model += Object.keys(data).indexOf(k) + ","+data[k]+"\n";
        }
        generateOrUpdateChart(keys, values)
    });
}


function updateTarget() {
    $.ajax({
        method: "PUT",
        url: "/target",
        contentType: "application/json",
        data: JSON.stringify({url: $("#current-target").val()})
    }).done(function(data) {
        alert(data);
    });
}


function generateOrUpdateChart(keys, values) {
    if (chart == null) {
        chart = new Chart(document.getElementById("bar-chart"), {
            type: 'line',
            data: {
                labels: keys,
                datasets: [{
                    label: "Score",
                    data: values
                }]
            },
            options: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Score for targeted post'
                },
                bezierCurve: false, // no curvy lines
                xAxes: [{
                    type: 'time',
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                }],
                animation: {
                    duration: 0
                }
            }
        });
    } else {
        chart.data.labels = keys;
        chart.data.datasets[0].data = values;
        chart.update();
    }
    updateStats(values);
}


function getSumOfValues(values) {
    let sum = 0;
    for (let i in values) {
        sum += values[i];
    }
    return sum;
}


function getAverage(values) {
    return getSumOfValues(values)/values.length;
}


function updateStats(values) {
    let average = getAverage(values);
    let min = Math.min(...values);
    let max = Math.max(...values);
    $('#stats-avg').html(Math.round(average * 10) / 10);
    $('#stats-min').html(min);
    $('#stats-max').html(max);
    $('#stats-entries').html(values.length);
    $('#stats-current').html(values[values.length-1]);
}
