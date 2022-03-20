let mapa;

let bola;

let bounds;

const ordinales = ['Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta', 'Sexta', 'Séptima'];

const bolas = [
              { pos: {lat:40.47593894308782, lng:-0.40152796950835784}, show : true, animate : false,
                texto : '<p>Primera.</p>' },
              { pos: {lat:39.47593894308782, lng:-10.40152796950835784}, show : false, animate : true,
                texto : '<p>Segunda.</p>' },
              { pos: {lat:38.47593894308782, lng:-11.40152796950835784}, show : true, animate : false,
                texto : '<p>Tercera.</p>' },
              { pos: {lat:37.47593894308782, lng:-16.40152796950835784}, show : true, animate : true,
                texto : '<p>Cuarta.</p>' },
              { pos: {lat:36.47593894308782, lng:-20.40152796950835784}, show : true, animate : false,
                texto : '<p>Para obtener esta bola, hay que ganar tres partidas de piedra, papel o tijera contra Paco.</p>' },
              { pos: {lat:33.47593894308782, lng:-40.40152796950835784}, show : true, animate : true,
                texto : '<p>Sexta.</p>' },
              { pos: {lat:30.47593894308782, lng:-3.40152796950835784}, show : true, animate : false,
                texto : '<p>Septima.</p>' }
              ];

function centrarBolaGUI(controlDiv) {
    const etiqueta = document.createElement('label');
    etiqueta.appendChild(document.createTextNode('🔮 '));
    const selector = document.createElement('select');
    selector.setAttribute('id', 'selectCentrarBola');
    for(let i=0; i<bolas.length; i++){
        const opcion = document.createElement('option');
        opcion.appendChild(document.createTextNode(ordinales[i] + ' bola'));
        opcion.setAttribute('value', i+1);
        if(i==bola) opcion.setAttribute('selected', 'selected');
        if(!bolas[i].show)opcion.setAttribute('disabled', 'disabled');
        selector.appendChild(opcion);
    }
    const ultimaOpcion = document.createElement('option');
    ultimaOpcion.appendChild(document.createTextNode("Mostrar todas"));
    ultimaOpcion.setAttribute('value', 0)
    if(bola==null) ultimaOpcion.setAttribute('selected', 'selected');
    selector.appendChild(ultimaOpcion);
    etiqueta.appendChild(selector);
    selector.addEventListener('change', function(){
        const e = document.getElementById("selectCentrarBola");
        let value = e.options[e.selectedIndex].value;
        value = parseInt(value);
        if(value == 0) mapa.fitBounds(bounds, 30);
        else {
            mapa.panTo(bolas[value-1].pos);
            if(mapa.getZoom()<8) mapa.setZoom(8);
        }
    });
    controlDiv.appendChild(etiqueta);
}

function iniciarBola(){
    const parametros = new URLSearchParams(window.location.search);
    let bolaParametro = parametros.get('bola'); console.log('Entramos en iniciarBola y sacamos el parámetro ' + bolaParametro);
    bolaParametro = parseInt(bolaParametro);
    console.log('bolaParametro es ' + bolaParametro + ' despues de parseInt');
    if(isNaN(bolaParametro)){
        bola = null; console.log('No se le ha pasado una bola sintacticamente valida en la url');
    }
    bolaParametro--;
    console.log('Le restamos uno: ' + bolaParametro);
    console.log('El array es de tamaño ' + bolas.length);
    if( bolaParametro >= 0 && bolaParametro < bolas.length && bolas[bolaParametro].show ){
        bola = bolaParametro; console.log('Finalmente devolvemos ' + bola + ' de iniciarBola');
    } else {
        bola = null; console.log('Estamos pasando por la url una bola que se pasa, no llega o tiene show false');
    }
}

function estiloMapa(){
    return [
            { featureType: "administrative", stylers: [{ visibility: "off" }]},
            { featureType: "administrative.locality", stylers: [{ visibility: "on" }]},
            { featureType: "poi", stylers: [{ visibility: "off" }]},
            { featureType: "transit", stylers: [{ visibility: "off" }]}
           ];
}

function estiloOrtofoto(){
    return [ { featureType: "all", stylers: [{ visibility: "off" }]}];
}

function listenerCambioTipoMapa(){
    const tipo = mapa.getMapTypeId(); console.log('El mapa se ha puesto en ' + tipo);
    localStorage.setItem('tipo', tipo);
    switch(tipo){
        case google.maps.MapTypeId.SATELLITE:
            mapa.setOptions({ styles: estiloOrtofoto() }); console.log('Se aplica el estilo ortofoto');
            break;
        case google.maps.MapTypeId.ROADMAP:
            mapa.setOptions({ styles: estiloMapa() }); console.log('Se aplica el estilo mapa');
            break;
        default:
            console.log('El mapa tipo ' + tipo + ' no está soportado');
    }
}

function initMap() {
    bounds = new google.maps.LatLngBounds();
    const opciones = {};
    const tipoMapa = localStorage.getItem('tipo'); console.log('Sacamos el tipoMapa del localStorage y sale ' + tipoMapa);
    iniciarBola(); console.log('Hemos salido de iniciarBola');
    opciones.center = (bola!=null)?bolas[bola].pos:{lat: 0.0, lng: 0.0};
    opciones.zoom = (bola!=null)?6:0;
    console.log('zoom ' + opciones.zoom);
    console.log('lat ' + opciones.center.lat);
    console.log('lng ' + opciones.center.lng);
    switch(tipoMapa){
        case google.maps.MapTypeId.SATELLITE:
        opciones.styles = estiloOrtofoto();
        opciones.mapTypeId = google.maps.MapTypeId.SATELLITE;
        console.log('Inicializamos el mapa como satelite. Hemos sacado ' + tipoMapa + ' del localstorage');
        break;
        default:
        opciones.styles = estiloMapa();
        opciones.mapTypeId = google.maps.MapTypeId.ROADMAP;
        console.log('Inicializamos el mapa como carretera. Hemos sacado ' + tipoMapa + ' del localstorage');
    }
    opciones.mapTypeControl = true;
    opciones.mapTypeControlOptions = {
                                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                                        mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
                                     };
    mapa = new google.maps.Map(document.getElementById("map"), opciones);
    mapa.addListener("maptypeid_changed", listenerCambioTipoMapa);
    console.log('Entramos a poner los marcadores');
    for(let i = 0; i < bolas.length; i++){ console.log('bola ' + i);
        if(bolas[i].show){
            bounds.extend(bolas[i].pos);
            bolas[i].imagen = {url: "img/bola-" + (i + 1) + ".svg", scaledSize: new google.maps.Size(30, 30)};
            bolas[i].marcador = new google.maps.Marker({
                position: bolas[i].pos,
                icon: bolas[i].imagen,
                map: mapa,
                animation: (bolas[i].animate)?google.maps.Animation.BOUNCE:null,
                title: ordinales[i] + ' bola.',
            });
            bolas[i].info = new google.maps.InfoWindow({ content: bolas[i].texto });
            bolas[i].marcador.addListener('click', function(){
                bolas[i].info.open({anchor: bolas[i].marcador, map: mapa, shouldFocus: false});
            });
            console.log(bolas[i]);
        }
    }
    if(bola == null) mapa.fitBounds(bounds, 30);
    console.log(bounds);
    const divCentrarBola = document.createElement("div");
    divCentrarBola.setAttribute('id', 'divCentrarBola');
    centrarBolaGUI(divCentrarBola);
    mapa.controls[google.maps.ControlPosition.TOP_CENTER].push(divCentrarBola);
}








