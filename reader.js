
var wsUri = "wss://test2.bigchaindb.com:443/api/v1/streams/valid_transactions";
var output;
var alertbox;
function init()
{
        output = document.getElementById("output");
        alertbox = document.getElementById("alert-box");
        setWebSocket();
}

function setWebSocket()
{
        websocket = new WebSocket(wsUri);
        websocket.onopen = function(evt) { onOpen(evt) };
        websocket.onclose = function(evt) { onClose(evt) };
        websocket.onmessage = function(evt) { onMessage(evt) };
        websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt)
{
        writeAlertMessage("Connected to Paradigm EventStreamAPI");
}

function onClose(evt)
{
        writeAlertMessage("Disconnected");
}

function onMessage(evt)
{
        const parsedData = JSON.parse(evt.data);
        writeToScreen('<a href="#" class="list-group-item"><h3 class="list-group-item-heading">Order</h3><p class="list-group-item-text">' + parsedData.asset + '</p></a>');
        console.log(parsedData.asset_id);
}


function onError(evt)
{
        writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function closeConnection(evt)
{
        websocket.close()
}

function writeToScreen(message)
{
        var pre = document.createElement("p");
        pre.style.wordWrap = "break-word";
        pre.innerHTML = message;
        output.appendChild(pre);
}

function writeAlertMessage(message)
{
        var alert = document.createElement("div");
        alert.className = "alert alert-success";
        alert.setAttribute("role", "alert");
        alert.innerHTML = message;
        alertbox.appendChild(alert);
}

/* Initialize websocket and attach all events */
window.addEventListener("load", init, false);

/* Event called on closing browser or refreshing page to close connection */
window.addEventListener("beforeunload", closeConnection, false);
