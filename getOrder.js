const cors_api_url = 'https://marcoduhe.herokuapp.com/';
const APIKey = null;
const APIToken = null;
const VtexIdclientAutCookie = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IkNGMEVFN0JGRUU2NDFGMUNBMDI2NUYyOTkxQkE0QUVDRjBDNTc0MTEiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJtYXJjby5oZXJyYWRhQHZ0ZXguY29tLmJyIiwiYWNjb3VudCI6Im11bHRpdG9wIiwiYXVkaWVuY2UiOiJhZG1pbiIsInNlc3MiOiIwOWY2ZmJkNy01MzkxLTRmZjQtODFmMC1hNDAzMTM2Njk0ZmIiLCJleHAiOjE2NjE4NzIwMDEsInVzZXJJZCI6ImI1ZWMwYmU4LTA0YTgtNGY1Ny1hNjFiLTcwZTAyZWI0MGMzNiIsImlhdCI6MTY2MTc4NTYwMSwiaXNzIjoidG9rZW4tZW1pdHRlciIsImp0aSI6ImYyYTFlMWUxLTZhOTItNDcxMi1hMzA0LTMyYTE2ZDkwNjU3NiJ9.fo-ldLUJEv-_VCbb_s9a3OWcbPUhtlnfONEUbYz6HpmG02iRB1A1SxI-fvtVzWQWLK4__xe5tfjRbV4JnEjSIw';
function getOrderId() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
    let value = params.orderId; // "some_value"
    return value;
}
function transformacion(items) {

    var newArray = [];
    items.forEach((element,index,_array) => {
        var qPrices = element.priceDefinition.sellingPrices.length;
        for(let i=0;i<qPrices;i++)
        {
            let auxObject = new Object()
            auxObject.id = element.id;
            auxObject.productId=element.productId;
            auxObject.quantity=element.priceDefinition.sellingPrices[i].quantity;
            auxObject.sellingPrice= element.priceDefinition.sellingPrices[i].value;
            auxObject.total= element.priceDefinition.sellingPrices[i].quantity * element.priceDefinition.sellingPrices[i].value;
            newArray.push(auxObject);
        }
    })
    newArray.sort();
    var Arrays = [];
   newArray.forEach(element => {
        var indexObject = Arrays.findIndex((myobjectIndex) =>   (myobjectIndex.id == element.id && myobjectIndex.sellingPrice == element.sellingPrice));
        if (indexObject != -1) {
            Arrays[indexObject].quantity = Arrays[indexObject].quantity + element.quantity;
            Arrays[indexObject].total = Arrays[indexObject].total + element.total;
        } else {
            Arrays.push(element);
        }
    });
    return Arrays;
}
var orderId = getOrderId();
if (orderId) {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'X-VTEX-API-AppKey': APIKey,
        //'X-VTEX-API-AppToken': APIToken
        'VtexIdclientAutCookie': VtexIdclientAutCookie
    };
    var urlGetOrder = `https://multitop.vtexcommercestable.com.br/api/oms/pvt/orders/${orderId}`;
    fetch(cors_api_url + urlGetOrder, {
    //fetch('http://127.0.0.1:5500/1257623156308-01.json',{
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
            document.getElementById('demo').innerHTML = JSON.stringify(Data);
        })
        .catch(error => console.error('error: ', error))
}