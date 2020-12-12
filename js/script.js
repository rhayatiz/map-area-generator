/**
 * ObjetMap : l'élément <map> dans lequel on travaille
 */
function objetMap() {
    var objetMap = {};
    objetMap.id = "";
    objetMap.nomMap = "";
    objetMap.tabObjetArea = new Array();
    objetMap.add = function(newObj){
        objetMap.tabObjetArea.push(newObj);
    }
    objetMap.toString = function(){
        console.log("-----Objet Map : ");
        console.log("id: " + objetMap.id);
        console.log("nomMap: " + objetMap.nomMap);
        console.log("tabObjetArea: ");
        console.log(objetMap.tabObjetArea);
    }
    return objetMap;
}

//On instancie notre objet Map qui correspond à l'élément #main-map dans l'HTML
var Map = new objetMap();
Map.id = "main-map";
Map.nomMap = "main-map";

/**
 * ObjetPoint : coordonnées (X,Y)
 */
function objetPoint(x, y){
    let objetPoint = {};
    objetPoint.x =  x;
    objetPoint.y = y;
    objetPoint.ChangeX = function(newX){
        x = newX;
    }
    objetPoint.ChangeY = function(newY){
        y = newY;
    },
    objetPoint.toString = function(){
        console.log('--objetPoint : X:'+x+'; Y:'+y);
    }
    return objetPoint;
}

// Index pour gérer l'id automatiquement
var objetAreaCarreIndex = 0;
/**
 * Objet <area> de type rect
 */
function objetAreaCarre(nom, typeAire = 'rect', ensembleObjetPoint){
    let carre = {};
    carre.id = objetAreaCarreIndex++;
    carre.nom = nom;
    carre.typeAire = typeAire;
    carre.ensembleObjetPoint = ensembleObjetPoint;
    carre.width = carre.ensembleObjetPoint[1].x - carre.ensembleObjetPoint[0].x;
    carre.height = carre.ensembleObjetPoint[1].y - carre.ensembleObjetPoint[0].y;
    carre.getCoords = function(){
        let coords = '';
        coords += carre.ensembleObjetPoint[0].x + ',';
        coords += carre.ensembleObjetPoint[0].y + ',';
        coords += carre.ensembleObjetPoint[1].x + ',';
        coords += carre.ensembleObjetPoint[1].y;
        return coords;
    }
    // newCords (integer[4])
    carre.setCoordonnees = function(newCoords){
        let point1 = new objetPoint(newCoords[0],newCoords[1]);
        let point2 = new objetPoint(newCoords[2],newCoords[3]);
        carre.ensembleObjetPoint = [point1, point2];
    }

    carre.toString = function(){
        console.log("-- carré");
        console.log("id : "+carre.id);
        console.log("nom : "+carre.nom);
        console.log("typeAire : "+carre.typeAire);
        console.log("ensembleObjetPoint : ");
        console.log(carre.ensembleObjetPoint);
    }
    return carre;
}

/**
 * Bouton Annuler, on vide les champs
 */
function reset() {
    document.getElementById("inputNom").value = '';
    document.getElementById("inputY").value = '';
    document.getElementById("inputX").value = '';
    document.getElementById("inputWidth").value = '';
    document.getElementById("inputHeight").value = '';
    document.getElementById("inputType").selectedIndex = 0;
}

/**
 * Bouton Appliquer
 * on Crée les objets en JS
 */
function apply(){
    // rect / circle / poly
    n = document.getElementById("inputType").selectedIndex;
    let objectType = document.getElementById("inputType").options[n].value;

    if (objectType == "rect") {
        //récupérer les infos du rectangle
        let nomCarre = document.getElementById("inputNom").value;
        let x1 = document.getElementById("inputX").value;
        let y1 = document.getElementById("inputY").value;
        //x2, y2 sont correspondent à height et width
        let x2 = parseInt(document.getElementById("inputWidth").value) + parseInt(x1);
        let y2 = parseInt(document.getElementById("inputHeight").value) + parseInt(y1);
        let p1 = new objetPoint(x1, y1);
        let p2 = new objetPoint(x2, y2);
        let ensemblePoints = [p1, p2];

        //s'assurer qu'on dispose de toutes les infos
        let allInfoOk = true;
        let champs = [nomCarre, x1, y1, x2, y2];
        champs.forEach(el => {
            if (el == ''){
                allInfoOk = false;
            }
        });
        
        if(!allInfoOk){
            alert('veuillez remplir tous les champs');
        }else{
            let carre = new objetAreaCarre(nomCarre, 'rect', ensemblePoints);
            //debug
                // p1.toString();
                // p2.toString();
            console.log("Ajout du carré dans la Map ... ");
            carre.toString();
            Map.add(carre);
            if(render(carre)){
                addToListObjects(carre);
                alert('objet ajouté')
            };
        }
    }
}

/**
 * Injecte les objets de la Map dans l'HTML
 */
function render(aire){
    //si c'est un rectangle 
    if (aire.typeAire == 'rect'){
        console.log('function render()');
        let newArea = document.createElement('area');
        newArea.setAttribute('href', '#');
        newArea.setAttribute('shape', aire.typeAire);
        newArea.setAttribute('coords', aire.getCoords());
        newArea.style.zIndex = 2;
        document.getElementById("main-map").appendChild(newArea);
        //créer la div de visualisation
        let coords = aire.getCoords().split(',');
        let left = coords[0];
        let top = coords[1];
        let w = aire.width;
        let h = aire.height;
        let div = document.createElement('div');
        div.setAttribute('class', 'visuel d-none');
        div.setAttribute('id', 'visuel'+aire.id);
        // console.log(coords);
        div.style.top = top+'px';
        div.style.left = left+'px';
        div.style.width = w+'px';
        div.style.height = h+'px';
        div.style.border = '1px solid red';
        
        document.getElementById("map-wrap").appendChild(div);
        refreshVisualiser(document.getElementById("visualise"));
        return true;
    }else{
        return false;
    }
}


/**
 * rafraichit la liste des objets en html
 */
function addToListObjects(aire){
        let newObject = document.createElement('div');
        newObject.setAttribute('class', 'object-item');
        newObject.innerHTML = aire.nom;
        document.getElementById("objects-list").appendChild(newObject);
}

function refreshVisualiser(e){
    if(e.checked){
        //visualiser les box
        let boxes = document.getElementsByClassName("visuel");
        for (let i = 0; i < boxes.length; i++){
            boxes[i].classList.remove("d-none");
        }

    }else{
        //faire disparaitre les box
        let boxes = document.getElementsByClassName("visuel");
        for (let i = 0; i < boxes.length; i++){
            boxes[i].classList.add("d-none");
            
        }
    }
}

//////////////////////////////////////////////////////////////
/////////////////////Interactions user////////////////////////
//////////////////////////////////////////////////////////////
/**
 * Reinitialiser le select
 */
function refreshType(){
    n = document.getElementById("inputType").selectedIndex;
    let objectType = document.getElementById("inputType").options[n].value;
    let hideInputs = ['divWidth','divHeight', 'divRadius', 'divX', 'divY', 'btns', 'arrows'];
    //hide hideInputs
    hideInputs.forEach(el => {
        if(!document.getElementById(el).classList.contains("d-none")){
            document.getElementById(el).classList.add("d-none");
        }
    });

    switch (objectType) {
        case "rect":
            document.getElementById("divWidth").classList.remove("d-none");
            document.getElementById("divHeight").classList.remove("d-none");
            showButtons();
            break;

        case "circle":
            document.getElementById("divRadius").classList.remove("d-none");
            showButtons();
            break;

        default:
            break;
    }
}

function showButtons() {
    document.getElementById("btns").classList.remove("d-none");
    document.getElementById("divX").classList.remove("d-none");
    document.getElementById("divY").classList.remove("d-none");
    document.getElementById("arrows").classList.remove("d-none");
}

function hideButtons() {
    document.getElementById("btns").classList.add("d-none");
    document.getElementById("divX").classList.add("d-none");
    document.getElementById("divY").classList.add("d-none");
    document.getElementById("arrows").classList.add("d-none");
}

