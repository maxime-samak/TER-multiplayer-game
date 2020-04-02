/* Open when the user clicks on the icon */
function openNav() {
    document.getElementById("metrics").style.width = "18%";
}

/* Close when the user clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("metrics").style.width = "0%";
}

function charts() {
    var ctx = document.getElementById("canvass").getContext("2d");
    ctx.arc(1 , - 1, 3, 0, Math.PI * 2, true);
    ctx.translate(10, 90);
    ctx.fillStyle = "#ff2626"; // Red color
    let i = 0;
    setInterval(
        () => {
            ctx.beginPath();
            ctx.arc(i * 10, - parseInt((pings.last().y)), 3, 0, Math.PI * 2, true);
            ctx.fill();
            if (i == 30) {
                ctx.clearRect(-10, -100, canvas.width, canvas.height );
                console.log("cleared");
                i = 0;
            }
            i++

        },500
    )
}
charts()
