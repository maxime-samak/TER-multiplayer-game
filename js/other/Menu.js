/* Open when the user clicks on the icon */
function openNav() {
    document.getElementById("metrics").style.width = "18%";
}

/* Close when the user clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("metrics").style.width = "0%";
}

function checkSettings(obj) {
    switch(obj.id) {
        case 'prediction':
            document.getElementById('self-default').checked = !obj.checked;
            break;
        case 'interpolation':
            document.getElementById('default').checked = !obj.checked;
            break;
        case 'default':
            document.getElementById('interpolation').checked = !obj.checked;
            break;
        case 'self-default':
            document.getElementById('prediction').checked = !obj.checked;
            document.getElementById('reconciliation').checked = !obj.checked;
            break;
        case 'reconciliation':
            document.getElementById('reconciliation').checked = (obj.checked &&  !document.getElementById('self-default').checked);
            break;
        default:
        //
    }
}

function applySettings() {
    findSelf(players);
    if (document.getElementById('prediction').checked) {prediction();}
    if (document.getElementById('reconciliation').checked) { reconciliation();}
    if (document.getElementById('interpolation').checked) {interpolation(players);}
    if (document.getElementById('default').checked) {defaultDraw(players);}
    if (document.getElementById('self-default').checked) {selfDefaultDraw();}

    if (document.getElementById('pov').checked) {
        /* show where the server see the player*/
        fill('rgb(100%,0%,10%)');
        ellipse(this.self.x, this.self.y, 64);

        /* show direction */
        let v0 = createVector(self.x, self.y);

        let v1 = createVector(mouseX - width / 2, mouseY - height / 2);
        drawArrow(v0, v1, 'blue');
    }
}

function nbUpdateChanged() {
    send("changeNbUpdates", document.getElementById("nbUpdate").value);
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
