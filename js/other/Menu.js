/* Open when the user clicks on the icon */
function openNav() {
    document.getElementById("metrics").style.width = "18%";
}

/* Close when the user clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("metrics").style.width = "0%";
}

function checkSettings(obj) {
    if(document.getElementById(obj.id).checked == true) {
        document.getElementById('prediction').checked = false;
        document.getElementById('interpolation').checked = false;
        document.getElementById('default').checked = false;

        //document.getElementById('reconciliation').checked = false;
        document.getElementById(obj.id).checked = true;
    }
}

function charts() {
    let ctx = document.getElementById('myChart').getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'RTT (s)',
                data: pings.data(),
                borderColor: "rgba(68, 108, 179, 1)"
            }]
        },
        options: {
            events: [],
            tooltips: {enabled: false},
            hover: {mode: null},
            scales: {
                xAxes: [{
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: 'Time (s)'
                    }
                }],

                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },

                }]
            }
        }
    });

    setInterval(() => {
        chart.data.datasets[0].data = pings.data();
        chart.data.labels = pings.dataX();
        chart.update();
    }, 500)
}
charts();
