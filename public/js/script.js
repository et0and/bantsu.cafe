document.addEventListener("DOMContentLoaded", function(){
    // get links
    fetch('/links')
    .then(response => response.json())
    .then(data => {
        var officeTunes = document.querySelector('#office-tunes');
        var coffeeBreak = document.querySelector('#coffee-break');
        var mousePad = document.querySelector('#mouse-pad');

        data.map((item) => {
            var li = document.createElement("li");
            li.innerHTML = `<a href="${item.link}">${item.title}</a>`;

            if(item.type == 'office_tunes')
                officeTunes.appendChild(li);
            else if(item.type == 'coffee_break')
                coffeeBreak.appendChild(li);
            else if(item.type == 'mouse_pad') {
                mousePad.appendChild(li);
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
            var li = document.createElement("li");
            var readableDate = new Date(item.creationDate);
            var readableDateAMPM = readableDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            li.innerHTML = `[${readableDateAMPM}] ~${item.name} – ${item.status}`;

            peopleEl.appendChild(li);
        });
    })
    .catch(error => console.error(error))

    // get notes
    async function getNotes() {
        let response = await fetch('/notes');
        let data = await response.json()
        var notesEl = document.body

        console.log(await data);

        // var shuffledArray = await randCol(data);

        data.map((item) => {
            var div = document.createElement("div");
            div.classList.add('note');
            div.style.left = randomNumber(0, 70) + 'vw';
            div.style.top = randomNumber(0, 70) + 'vh';
            div.innerHTML = `
                ${item.emoji}<br /><br />
                <p><a class="delete-note" id="${item._id}">delete note</a></p>
            `;

            notesEl.appendChild(div);
        });

        const noteElements = document.querySelectorAll('.delete-note');

        for (let note of noteElements) {
            note.addEventListener('click', function() {
                fetch('/delete-note?id=' + note.id, {
                    method: 'delete',
                    body: JSON.stringify()
                }).then(() => {
                    location.reload(); 
                })
            });
        }

        // toggle notes

        const notesToggle = document.querySelector('.notes-toggle');
        notesToggle.innerHTML = 'show notes';
        notesToggle.id = 'show';
        const notesElements = document.querySelectorAll('.note');

        function toggleNotes() {
            if (notesToggle.id == 'show') {
                console.log('hide');
                notesToggle.id = 'hide';
                notesToggle.innerHTML = 'show notes';
                for (let note of notesElements) {
                    note.style.display = 'none';
                }
            } else {
                console.log('show');
                notesToggle.id = 'show';
                notesToggle.innerHTML = 'hide notes';
                console.log(notesElements);
                for (let note of notesElements) {
                    note.style.display = 'block';
                }
            }
        }

        notesToggle.addEventListener('click', toggleNotes);
        toggleNotes();
    
    }

    getNotes();

    function randCol(array) {
        var colArr = [];
        for (var i = 0; i < 5; i++) {
            var rand = array[Math.floor(Math.random() * array.length)];
            colArr.push(rand);
        }
        return colArr;
    }

    // Random number
    function randomNumber(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

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
            link.id = "fireflies";

            document.getElementsByTagName("head")[0].appendChild(link);
        } else {
            console.log('cafe open');
            var el = document.querySelector("#closed");
            el.classList.add("open");
        }
    }

    checkLights();

});

function checkLights() {
    // check lights
    fetch('/light-status')
    .then(response => response.json())
    .then(data => {
        console.log(data[0].on);
        var lightsOff = document.querySelector('#lights-off');
        var lightsOn = document.querySelector('#lights-on');
        if (data[0].on == 'false') {
            lightsOff.href = '/css/lights-off.css';
            lightsOn.href = '';
            document.querySelector('.notes-toggle').style.display = 'block';

            console.log('lights off');
        } else {
            lightsOff.href = '';
            lightsOn.href = "/css/lights-on.css";
            console.log('lights on');
            // document.querySelector('.notes-toggle').style.display = 'none';
        }
    })
    .catch(error => console.error(error))
}

document.querySelector('.light-switch').addEventListener('click', async function() {
    // light switch
    fetch('/light-switch', {
        method: 'post',
        body: JSON.stringify()
    }).then(() => {
        checkLights();
    })
});

// secret door 🔑
document.querySelector('.secret-door').addEventListener('click', function() {
    // open cafe
    document.querySelector('#closed').style.display = "none";
    document.querySelector('#fireflies').remove();
});

window.setInterval(function(){
    checkLights();
    console.log('checking lights');
}, 4000);


