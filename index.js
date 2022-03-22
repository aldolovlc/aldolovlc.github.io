let mapa;

let bola;

let bounds;

const ordinales = ['Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta', 'Sexta', 'Séptima'];

const ayuda = ['Hola David. En este detector de bolas de dragón podrás ver dónde aparecerán el resto de bolas. ¿A que mola?',
               'Las bolas que aparecen dando saltos están preparadas para ir en su búsqueda.',
               'Las bolas que aparecen fijas, ya están recuperadas. Seguirán en el mismo lugar donde las conseguiste.',
               'Si pulsas en cada bola, aparecerá información y pistas para dar con ella.',
               'En la lista desplegable de arriba, el mapa se centrará en la bola que quieras. Si no deja elegirla, ¡el radar aún no la ha encontrado!',
               'Sé que serás capaz de hacerlo. ¡Mucha suerte!'];

let ayudaPos = 0;

const bolas = [
              { pos: {lat:40.47593894308782, lng:-0.40152796950835784}, show : false, animate : false,
                texto : 'Primera.' },
              { pos: {lat:39.47593894308782, lng:-10.40152796950835784}, show : false, animate : true,
                texto : 'Segunda.' },
              { pos: {lat:38.47593894308782, lng:-11.40152796950835784}, show : false, animate : false,
                texto : 'Tercera.' },
              { pos: {lat:37.47593894308782, lng:-16.40152796950835784}, show : false, animate : true,
                texto : 'Cuarta.' },
              { pos: {lat:39.478476039019064, lng:-0.40081630428251475}, show : true, animate : false,
                texto : '<p>Mañana verás a un chico de poco más de cuarenta años. Con gafas, barba canosa, pelo azul (según los rumores) y las uñas pintadas. Si le retas a un combate de piedra-papel-tijeras podrás ganarle tu primera bola de dragón. Pero no te preocupes, vas a jugar con ventaja, he descifrado pistas en antiguos libros de filosofía oriental.</p><ul><li>Para ganar la primera bola, debes elegir el material con el que están fabricadas las pajitas.</li><li>Para ganar la segunda, debes elegir lo que estaba haciendo ***** en el baño.</li><li>Y para ganar la tercera, debes elegir lo que te gustaría tirarle a ****** en la cabeza para abrírsela.</li></ul>' },
              { pos: {lat:33.47593894308782, lng:-40.40152796950835784}, show : false, animate : true,
                texto : 'Sexta.' },
              { pos: {lat:30.47593894308782, lng:-3.40152796950835784}, show : false, animate : false,
                texto : 'Septima.' }
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
            if(mapa.getZoom()<15) mapa.setZoom(15);
        }
    });
    controlDiv.appendChild(etiqueta);
}

function bulmaDiceGUI(controlDiv){
    const divTextoYBotones = document.createElement('div');
    const texto = document.createElement('p');
    const divBotones = document.createElement('div');
    const divMostrar = document.createElement('div');
    const img = document.createElement('img');
    const ba = document.createElement('button');
    const bz = document.createElement('button');
    const bm = document.createElement('button');
    const bo = document.createElement('button');
    
    divTextoYBotones.appendChild(img);
    divTextoYBotones.appendChild(texto);
    divTextoYBotones.appendChild(divBotones);
    divBotones.appendChild(ba);
    divBotones.appendChild(bo);
    divBotones.appendChild(bz);
    controlDiv.appendChild(divTextoYBotones);
    divMostrar.appendChild(bm);
    controlDiv.appendChild(divMostrar);
    
    divTextoYBotones.setAttribute('id', 'bul1');
    divMostrar.setAttribute('id', 'bul2');
    texto.setAttribute('id', 'textoAyuda');
    
    img.setAttribute('src', 'img/bulma.png');
    img.setAttribute('alt', 'Foto de Bula');
    
    ba.setAttribute('id', 'bota');
    ba.setAttribute('value', '-1');
    ba.style.visibility = 'hidden';
    ba.addEventListener('click', botonHandler);
    ba.appendChild(document.createTextNode('⬅'));
    
    bz.setAttribute('id', 'botz');
    bz.setAttribute('value', '1');
    bz.addEventListener('click', botonHandler);
    bz.appendChild(document.createTextNode('➡'));
    
    bo.setAttribute('value', '0');
    bo.addEventListener('click', botonHandler);
    bo.appendChild(document.createTextNode('Ocultar'));
    
    bm.setAttribute('value', '2');
    bm.addEventListener('click', botonHandler);
    bm.appendChild(document.createTextNode('Mostrar'));
    
    texto.appendChild(document.createTextNode(ayuda[0]));

    switch(localStorage.getItem('ayuda')){
        case '0':
            divTextoYBotones.style.display = 'none';
            break;
        case '1':
        default:
            divMostrar.style.display = 'none';
    }
}
    
function botonHandler(a){
    const ta = document.getElementById('textoAyuda');
    switch(this.value){
        case "-1":
            if(ayudaPos > 0){
                ayudaPos--;
                ta.textContent = ayuda[ayudaPos];
            }
            if(ayudaPos == 0) document.getElementById('bota').style.visibility = 'hidden';
            if(ayudaPos == ayuda.length-2) document.getElementById('botz').style.visibility = 'visible';
            break;
        case "0":
            document.getElementById('bul1').style.display = 'none';
            document.getElementById('bul2').style.display = 'block';
            localStorage.setItem('ayuda','0');
            break;
        case "1":
            if(ayudaPos < ayuda.length-1){
                ayudaPos++;
                ta.textContent = ayuda[ayudaPos];
            }
            if(ayudaPos == ayuda.length-1) document.getElementById('botz').style.visibility = 'hidden';
            if(ayudaPos == 1) document.getElementById('bota').style.visibility = 'visible';
            break;
        case "2":
            document.getElementById('bul1').style.display = 'block';
            document.getElementById('bul2').style.display = 'none';
            localStorage.setItem('ayuda','1');
            break;
        default:
    }
}

function iniciarBola(){
    const parametros = new URLSearchParams(window.location.search);
    let bolaParametro = parametros.get('bola');
    bolaParametro = parseInt(bolaParametro);
    if(isNaN(bolaParametro) || bolaParametro < 1 || bolaParametro > bolas.length || bolas[bolaParametro-1].show == false) return null;
    else { bolaParametro--; return bolaParametro; }
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
    const tipo = mapa.getMapTypeId();
    localStorage.setItem('tipo', tipo);
    switch(tipo){
        case google.maps.MapTypeId.SATELLITE:
            mapa.setOptions({ styles: estiloOrtofoto() });
            break;
        case google.maps.MapTypeId.ROADMAP:
            mapa.setOptions({ styles: estiloMapa() });
            break;
        default:
    }
}

function initMap() {
    bounds = new google.maps.LatLngBounds();
    const opciones = {};
    const tipoMapa = localStorage.getItem('tipo');
    bola = iniciarBola();
    opciones.center = (bola!=null)?bolas[bola].pos:{lat: 0.0, lng: 0.0};
    opciones.zoom = (bola!=null)?15:0;
    switch(tipoMapa){
        case google.maps.MapTypeId.SATELLITE:
        opciones.styles = estiloOrtofoto();
        opciones.mapTypeId = google.maps.MapTypeId.SATELLITE;
        break;
        default:
        opciones.styles = estiloMapa();
        opciones.mapTypeId = google.maps.MapTypeId.ROADMAP;
    }
    opciones.mapTypeControl = true;
    opciones.mapTypeControlOptions = {
                                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                                        mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
                                     };
    mapa = new google.maps.Map(document.getElementById("map"), opciones);
    mapa.addListener("maptypeid_changed", listenerCambioTipoMapa);
    for(let i = 0; i < bolas.length; i++){
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
        }
    }
    if(bola == null) mapa.fitBounds(bounds, 30);
    const divCentrarBola = document.createElement('div');
    divCentrarBola.setAttribute('id', 'divCentrarBola');
    centrarBolaGUI(divCentrarBola);
    const divBulmaDice = document.createElement('div');
    divBulmaDice.setAttribute('id', 'divBulmaDice');
    bulmaDiceGUI(divBulmaDice);
    mapa.controls[google.maps.ControlPosition.TOP_CENTER].push(divCentrarBola);
    mapa.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(divBulmaDice);
}
