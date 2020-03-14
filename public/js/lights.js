// check lights
fetch('/light-status')
.then(response => response.json())
.then(data => {
    console.log(data[0].on);
    if (data[0].on == 'false') {
        var link = document.createElement("link");
        link.href = "./css/lights-off.css";
        link.type = "text/css";
        link.rel = "stylesheet";
        link.media = "screen";
        link.id = "lights-off";

        document.getElementsByTagName("head")[0].appendChild(link);
        console.log('lights off');
    } else {
        if (document.querySelector("#lights-off")) {
            document.querySelector("#lights-off").remove();
            console.log('lights on');
        }
    }
})
.catch(error => console.error(error))
