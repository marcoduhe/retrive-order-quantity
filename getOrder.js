//En caso de usar un proxy, agregarlo aquí:
const cors_api_url = "https://marcoduhe.herokuapp.com/";
//Colocar la APIKey de la cuenta
// var APIKey = null;
//Colocar el APITOken de la cuenta
// var APIToken = null;
//Sólo en el caso de realizar pruebas rápidas se debe colocar la cookie generada en su momento
// const VtexIdclientAutCookie = null;

function output(inp) {
    document.getElementById("nodes").appendChild(document.createElement('pre')).innerHTML = inp;
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function getOrderId() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    // Obtener el valor de la query de la url, por ejemplo "orderId" en "https://example.com/?orderId=some_value"
    let value = params.orderId; // "orderId"
    return value;
}
function transformacion(items) {

    var newArray = [];
    items.forEach((element) => {
        var qPrices = element.priceDefinition.sellingPrices.length;
        for (let i = 0; i < qPrices; i++) {
            let auxObject = new Object()
            auxObject.id = element.id;
            auxObject.productId = element.productId;
            auxObject.quantity = element.priceDefinition.sellingPrices[i].quantity;
            auxObject.sellingPrice = element.priceDefinition.sellingPrices[i].value;
            auxObject.total = element.priceDefinition.sellingPrices[i].quantity * element.priceDefinition.sellingPrices[i].value;
            newArray.push(auxObject);
        }
    })
    newArray.sort();
    var FinalArray = [];
    newArray.forEach(element => {
        var indexObject = FinalArray.findIndex((myobjectIndex) => (myobjectIndex.id == element.id && myobjectIndex.sellingPrice == element.sellingPrice));
        if (indexObject != -1) {
            FinalArray[indexObject].quantity = FinalArray[indexObject].quantity + element.quantity;
            FinalArray[indexObject].total = FinalArray[indexObject].total + element.total;
        } else {
            FinalArray.push(element);
        }
    });
    return FinalArray;
}
// var orderId = getOrderId();
function getInput(inputID) {
    return document.getElementById(inputID).value;
}
function destroy() {
    var theoriginal = document.getElementById('pre');
    if(theoriginal)
    {
        var olddata = document.getElementById("nodes").lastChild;
        document.getElementById("nodes").removeChild(olddata);
    }
}
function cleanAll() {
    document.getElementById('demo').innerHTML = ("");
    destroy();
}
function start() {
    console.clear();
    cleanAll();
    let account = getInput('account');
    let orderId = getInput('orderId');
    let APIKey = getInput('APIKey');
    let APIToken = getInput('APIToken');
    let VtexIdclientAutCookie = getInput('VtexIdclientAutCookie');
    doing(account, APIKey, APIToken, orderId, VtexIdclientAutCookie);
}
function doing(account, APIKey, APIToken, orderId, VtexIdclientAutCookie) {
    if (orderId) {
        let headers = null;
        if (VtexIdclientAutCookie) {
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'VtexIdclientAutCookie': VtexIdclientAutCookie
            };
        } else if (APIKey && APIToken) {
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-VTEX-API-AppKey': APIKey,
                'X-VTEX-API-AppToken': APIToken
            };
        }
        if (VtexIdclientAutCookie || (APIKey && APIToken)) {
            let urlGetOrder = `https://${account}.vtexcommercestable.com.br/api/oms/pvt/orders/${orderId}`;
            let urlEndpoint = urlGetOrder;
            if (cors_api_url) urlEndpoint = (cors_api_url + urlGetOrder);
            //urlEndpoint = "http://127.0.0.1:5500/1257623156308-01.json"
            fetch(urlEndpoint, {
                method: 'GET',
                headers: headers,
            }).then(response => response.json())
                .then(result => {
                    var Data = new Object();
                    Data.orderId = result.orderId;
                    Data.sequence = result.sequence;
                    Data.creationDate = result.creationDate;
                    Data.items = transformacion(result.items);
                    console.log(Data);
                    output(syntaxHighlight(JSON.stringify(Data, undefined, 4)));
                    //document.getElementById('demo').innerHTML = JSON.stringify(Data,undefined,4);
                })
                .catch(error => {
                    console.error('error: ', error);
                    document.getElementById('demo').innerHTML = error;
                })
        } else if (!VtexIdclientAutCookie) {
            document.getElementById('demo').innerHTML = "No está configurado la cookie";
        } else {
            if (!APIKey)
                document.getElementById('demo').innerHTML = "No está configurado la APIKey";
            else
                document.getElementById('demo').innerHTML = "No está configurado la APIToken";
        }
    } else {
        document.getElementById('demo').innerHTML = "Ingresar el orderID";
    }
}