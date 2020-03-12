document.addEventListener("DOMContentLoaded", function(){
    // get links
    fetch('/links')
    .then(response => response.json())
    .then(data => {
        var officeTunes = document.querySelector('#office-tunes');
        var coffeeBreak = document.querySelector('#coffee-break');
        var mousePad = document.querySelector('#mouse-pad');

        data.map((item) => {
            var p = document.createElement("p");
            p.innerHTML = `<a href="${item.link}">${item.title}</a>`;

            if(item.type == 'office_tunes')
                officeTunes.appendChild(p);
            else if(item.type == 'coffee_break')
                coffeeBreak.appendChild(p);
            else if(item.type == 'mouse_pad') {
                mousePad.appendChild(p);
            }
        });
    })
    .catch(error => console.error(error))

    // get statuses
    fetch('/statuses')
    .then(response => response.json())
    .then(data => {
        var peopleEl = document.querySelector('#people');

        data.map((item) => {
            var p = document.createElement("p");
            var readableDate = new Date(item.creationDate);
            var readableDateAMPM = readableDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            p.innerHTML = `[${readableDateAMPM}] ~${item.name} – ${item.status}`;

            peopleEl.appendChild(p);
        });
    })
    .catch(error => console.error(error))

    // get notes
    fetch('/notes')
    .then(response => response.json())
    .then(data => {
        var notesEl = document.querySelector('#notes');

        data.map((item) => {
            var span = document.createElement("span");
            span.innerHTML = `${item.emoji} `;

            notesEl.appendChild(span);
        });
    })
    .catch(error => console.error(error))

    // Time
    var myVar = setInterval(myTimer, 1000);

    function myTimer() {
        var d = new Date();
        var t = d.toLocaleTimeString().toLowerCase();
        document.getElementById("time").innerHTML = t;
    }
    myTimer();

    // Note Submitted?
    if(window.location.hash == '#success'){
        document.getElementById("post-note").style.display = "none";
        document.getElementById("post-note-success").style.display = "inline";
    } else {
        document.getElementById("post-note-success").style.display = "none";
    }

    // Secret 🔑
    // if(window.location.hash == '#closed'){
    // } else {
    //     openCafe();
    // }

    openCafe();

    // Cafe Hours
    function openCafe() {
        var hour = new Date().getHours();
        console.log(hour);
        if(hour > 22 || hour < 8) {
            console.log('cafe closed');

            var link = document.createElement("link");
            link.href = "./css/fireflies.css";
            link.type = "text/css";
            link.rel = "stylesheet";
            link.media = "screen";

            document.getElementsByTagName("head")[0].appendChild(link);
        } else {
            console.log('cafe open');
            var el = document.querySelector("#closed");
            el.classList.add("open");
        }
    }

});