// check lights
fetch('/light-status.html')
.then(response => response.json())
.then(data => {
    console.log(data[0].on);
    var link = document.querySelector('#lights-off');
    if (data[0].on == 'false') {
        link.href = "/css/lights-off.css";
        
        console.log('lights off');
    } else {
        link.href = "";
        console.log('lights on');
    }
})
.catch(error => console.error(error))
