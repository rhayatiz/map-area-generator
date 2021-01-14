/***********
 * VARIABLES
 */

//Sauvegarde temporaire de l'area
var editMode = false;


/***********************************************************************
 * Bouton Appliquer
 * Récupère les données du formulaire
 * Crée l'objet
 * appelle render()
 *         addToListObjects() 
 */
function apply(){
    // rect / circle / poly
    n = document.getElementById("inputType").selectedIndex;
    let objectType = document.getElementById("inputType").options[n].value;
    let x1 = document.getElementById("inputX").value;
    let y1 = document.getElementById("inputY").value;
    let nom = document.getElementById("inputNom").value;

    if (objectType == "rect") {
        //les valeurs récupérée du formulaire correspondent à height et width, on aditionne x1 et y1
        let x2 = parseInt(document.getElementById("inputWidth").value) + parseInt(x1);
        let y2 = parseInt(document.getElementById("inputHeight").value) + parseInt(y1);
        let p1 = new objetPoint(x1, y1);
        let p2 = new objetPoint(x2, y2);
        let ensemblePoints = [p1, p2];
        //s'assurer qu'on dispose de toutes les infos
        let allInfoOk = true;
        let champs = [nom, x1, y1, x2, y2];
        champs.forEach(el => {
            if (el == ''){
                allInfoOk = false;
            }
        });
        if(!allInfoOk){
            alert('veuillez remplir tous les champs');
        }else{
            let carre = new objetAreaCarre(nom, 'rect', ensemblePoints);
            console.log("Ajout du carré dans la Map ... ");
            Map.add(carre);
            if(render(carre)){
                addToListObjects(carre);
                alert('objet ajouté')
            };
        }
    }else if (objectType == "circle") {
        let p1 = new objetPoint(x1, y1);
        let r = document.getElementById('inputRadius').value;
        let allInfoOk = true;
        let champs = [nom, x1, y1, r];
        champs.forEach(el => {
            if (el == ''){
                allInfoOk = false;
            }
        });
        if(!allInfoOk){
            alert('veuillez remplir tous les champs');
        }else{
            let circle = new objetAreaCircle(nom, 'circle', p1, r);
            console.log("Ajout du cercle dans la Map ... ");
            Map.add(circle);
            if(render(circle)){
                addToListObjects(circle);
                alert('objet ajouté')
            };
        }
    }
    //Vider les champs
    reset();
    //afficher les DIV
    refreshVisualiser('show');

}

/******************************************************************************
 * Genere les éléments <area> et les injecte dans la <map>
 * ainsi que les <div> de visualisation
 */
function render(aire){
    //Créer l'area
    let newArea = document.createElement('area');
    newArea.setAttribute('href', '#');
    newArea.setAttribute('id', 'area'+aire.id);
    newArea.setAttribute('shape', aire.typeAire);
    newArea.setAttribute('coords', aire.getCoords());
    newArea.style.zIndex = 2;
    document.getElementById("main-map").appendChild(newArea);

    //créer la div de visualisation
    //si c'est un rectangle 
    if (aire.typeAire == 'rect'){
        console.log('function render() rect');
        let coords = aire.getCoords().split(',');
        let left = coords[0];
        let top = coords[1];
        let w = aire.width;
        let h = aire.height;
        let div = document.createElement('div');
        div.setAttribute('class', 'visuel d-none');
        div.setAttribute('id', 'visuel'+aire.id);
        div.setAttribute('data-area', aire.id);
        div.setAttribute('data-type', aire.typeAire);
        // Make the DIV element draggable:
        dragElement(div);
        div.style.top = top+'px';
        div.style.left = left+'px';
        div.style.width = w+'px';
        div.style.height = h+'px';
        div.style.border = '1px solid red';
        
        document.getElementById("map-wrap").appendChild(div);
        refreshVisualiser(document.getElementById("visualise"));
        return true;
    //Cercle
    }else if (aire.typeAire == 'circle'){
        console.log('function render() circle');
        let coords = aire.getCoords().split(',');
        let left = coords[0] - aire.radius;
        let top = coords[1] - aire.radius;
        let w = aire.radius * 2;
        let h = aire.radius * 2;
        let div = document.createElement('div');
        div.setAttribute('class', 'visuel circle d-none');
        div.setAttribute('id', 'visuel'+aire.id);
        div.setAttribute('data-area', aire.id);
        // Make the DIV element draggable:
        dragElement(div);
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

/*****************************************************************
 * Checkbox visualisation des <div> visuelles sur la map 
 */
function refreshVisualiser(action = null){
    if (document.getElementById('visualise').checked){
        action = 'show';
    }
    if(action == 'show'){
        //Afficher les Div correspondants au areas
        let boxes = document.getElementsByClassName("visuel");
        for (let i = 0; i < boxes.length; i++){
            boxes[i].classList.remove("d-none");
        }
    }else{
        //faire disparaitre les div
        let boxes = document.getElementsByClassName("visuel");
        for (let i = 0; i < boxes.length; i++){
            boxes[i].classList.add("d-none");
        }
    }
}

/********************************************************************
 * Met à jour La <div> de visualisation // <area> // Données dans le tableau
 * est apellée pendant le DRAG de la div et la modification
 */
function refreshHTML(aire){
    //Si l'area existe, on mets à jout <area>
    if (Map.getArea(aire.id)){
        //Données dans le tableau
        document.getElementById('aire'+aire.id+'X').innerHTML = aire.getX();
        document.getElementById('aire'+aire.id+'Y').innerHTML = aire.getY();
        document.getElementById('aire'+aire.id+'Nom').innerHTML = aire.nom;
        //MAJ <area>
        document.getElementById('area'+aire.id).setAttribute('coords', aire.getCoords());
        //MAJ <div> visuelle
        let coords = aire.getCoords().split(',');
        let vis = document.getElementById('visuel'+aire.id);
        if (aire.typeAire == 'rect'){
            var left = coords[0];
            var top = coords[1];
            var w = aire.width;
            var h = aire.height;
            vis.style.top = top+'px';
            vis.style.left = left+'px';
            vis.style.width = w+'px';
            vis.style.height = h+'px';
        }else if (aire.typeAire == 'circle'){
            var left = coords[0] - aire.radius;
            var top = coords[1] - aire.radius;
            var w = aire.radius * 2;
            var h = aire.radius * 2;
        }
        vis.style.top = top+'px';
        vis.style.left = left+'px';
        vis.style.width = w+'px';
        vis.style.height = h+'px';
    }
}

/***********************************************************************
 * Rafraîchit la liste des objets dans le tableau HTML
 */
function addToListObjects(aire){
        let newObject = document.createElement('tr');
        newObject.setAttribute('class', 'object-item');
        newObject.setAttribute('id', 'tr-aire'+aire.id);
        let tr1 = document.createElement('td');
        let aireHTML = '<td>'+aire.id+'</td>';
        aireHTML += '<td><span id="aire'+aire.id+'Nom">'+aire.nom+'<span></td>';
        aireHTML += '<td>'+aire.typeAire+'</td>';
        aireHTML += '<td>(<span id="aire'+aire.id+'X">'+aire.getX()+'</span>,<span id="aire'+aire.id+'Y">'+aire.getY()+'</span>)</td>';
        //last TD edit , delete
        aireHTML += '<td class="text-right">';
        aireHTML += '<span class="text-grey-600 mr-6"><i onclick="btnEditAire('+aire.id+')" class="fas fa-pencil-alt fa-lg"></i></span>';
        aireHTML += '<span class="text-red-500" ><i onclick="deleteAire('+aire.id+')" class="fas fa-trash-alt fa-lg"></i></span>';
        aireHTML += '</td>';

        newObject.innerHTML = aireHTML;
        document.getElementById("objects-list").appendChild(newObject);
}


/*******************************************************************
 * Mouvement de la <div> visuelle et màj de l'objet Area
 */
//W3SCHOOLS Dragging a div
function dragElement(div) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  div.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    let aireId = e.target.id.substr(6);
    //ouvrir le mode Edit quand on fait bouger la DIV
    if (!editMode){
        btnEditAire(aireId);
    }

    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Mettre à jour la position de la div visuelle qui correspond à <area>
        // let newTop = (div.offsetTop - pos2) < 0 ? 0  : (div.offsetTop - pos2) ;
        // let newLeft = (div.offsetLeft - pos1) < 0 ? 0  : (div.offsetLeft - pos1) ;
        //remplacer par les 2 lignes en haut pour empecher le déplacement en dehors de l'image (coté gauche et haut)
        let newTop = (div.offsetTop - pos2) ;
        let newLeft = (div.offsetLeft - pos1) ;
    div.style.top = newTop + 'px';
    div.style.left = newLeft + 'px';

    //Mettre à jour les coordonnés de l'area qui correspond à la div qu'on fait bouger
    let area = Map.getArea(div.dataset.area);
    //Pour un cercle, on rajoute le rayon, ( car le centre d'un <area> circle est le centre du cercle, pour un rectangle c'est le point coin haut gauche)
    if (area.typeAire == 'circle'){
        let newX = parseFloat(newLeft) + parseFloat(area.radius);
        let newY = parseFloat(newTop) + parseFloat(area.radius);
        console.log('affecter XY au changeX , newX = '+newX);
        console.log(document.getElementById('changeX'));
        document.getElementById('changeX').value = newX;
        document.getElementById('changeY').value = newY;
    }else if (area.typeAire == 'rect'){
        document.getElementById('changeX').value = newLeft;
        document.getElementById('changeY').value = newTop;
    }
    // refreshHTML(area);
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


/**
 * Supprimer l'aire
 */
function deleteAire(id){
    //supprimer l'objet aire du tableau de la map
    Map.deleteArea(id);

    //supprimer la div de visualisation
    let visuel = document.getElementById('visuel'+id);
    visuel.parentNode.removeChild(visuel);

    //supprimer <area> 
    let area = document.getElementById('area'+id);
    area.parentNode.removeChild(area);

    //supprimer le <tr>
    let tr = document.getElementById('tr-aire'+id);
    tr.parentNode.removeChild(tr);
}

/*****************************************
 * Bouton appliquer (Edit / modification)
 * MAJ objet 
 * MAJ AREA
 * MAJ div Visuelle
 * MAJ HTML (tableau)
 */
function applyEdit(){
    console.log('ApplyEdit() ... Application des changements');
    let area = Map.getArea(document.getElementById('changeId').value);
    let nom = document.getElementById('changeNom').value;
    let x = document.getElementById('changeX').value;
    let y = document.getElementById('changeY').value;

    // Si l'objet area est un rectagne
    if (area.typeAire == 'rect'){
        let height = document.getElementById('changeHeight').value;
        let width = document.getElementById('changeWidth').value;
        //MAJ OBJET
        //width height avant setXY car setXY() dépend de ces derniers
        area.height = height;
        area.width = width;
        area.setXY(x,y);
        area.nom = nom;
        //MAJ AREA && DIV visualisation && Tableau
        refreshHTML(area);
        // refreshVisualiser(document.getElementById("visualise"));

    // Si l'objet area est un cercle
    }else if (area.typeAire == 'circle'){
        let radius = document.getElementById('changeRadius').value;
        //MAJ Objet
        area.nom = nom;
        console.log('radius formulaire :'+radius);
        area.setRadius(radius);
        console.log('new area radius :'+area.radius);
        area.setXY(x,y);

        console.log('ApplyEdit() type circle, check new coords :'+area.getCoords());
        //MAJ AREA && DIV visualisation
        refreshHTML(area);
    }

    
    editMode = false;

}

/*****************************************************************************************************************************
 * Modification Dynamique d'un objet, apellée quand l'event onChange est declenché sur les input du formulaire de modification
 * Ces modifications sont reinitialisés grâce au refreshHTML(aire) dans la function resetEdit() 
 */
function refreshDiv(e){
    let objetId = e.parentElement.parentElement.childNodes[1].value;
    let nom = document.getElementById('changeNom').value;
    let x = document.getElementById('changeX').value;
    let y = document.getElementById('changeY').value;
    let type = document.getElementById('changeType').value;

    // Si l'objet area est un rectagne
    if (type == 'rect'){
        let vis = document.getElementById('')
        let height = document.getElementById('changeHeight').value;
        let width = document.getElementById('changeWidth').value;
        //refresh Div visual ONLY
        var left = x;
        var top = y;
        var w = width;
        var h = height;

    // Si l'objet area est un cercle
    }else if (type == 'circle'){
        let radius = document.getElementById('changeRadius').value;
        //MAJ Objet
        var left = x - radius;
        var top = y - radius;
        var w = radius * 2;
        var h = radius * 2;
    }

    let vis = document.getElementById('visuel'+objetId);
    vis.style.top = top+'px';
    vis.style.left = left+'px';
    vis.style.width = w+'px';
    vis.style.height = h+'px';
}

/**************************************************************************************
 * fonction pour gérer le déplacement de la div visuelle quand on click sur les flèches
 */
function moveDiv(e){
    let direction = e.id;
    let x = parseFloat(document.getElementById('changeX').value);
    let y = parseFloat(document.getElementById('changeY').value);
    var el;
    if (direction == 'up'){
        el = document.getElementById('changeY');
        el.value = y - 1;
    }else if(direction == 'down'){
        el = document.getElementById('changeY');
        el.value = y + 1;
    }else if(direction == 'right'){
        el = document.getElementById('changeY');
        el.value = x +1;
    }else if(direction == 'left'){
        el = document.getElementById('changeY');
        el.value = x - 1;
    }

    el.dispatchEvent(new Event("change"));

}






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////Interactions user DOM--------- boutons appliquer, annuler etc ..      ////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Rafraichir les données du formulaire selon l'option choisie dans le <select>
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


/*******************************************************************
 * Bouton Annuler (création), on vide les champs
 */
function reset() {
    document.getElementById("inputNom").value = '';
    document.getElementById("inputY").value = '';
    document.getElementById("inputX").value = '';
    document.getElementById("inputWidth").value = '';
    document.getElementById("inputHeight").value = '';
    document.getElementById("inputType").selectedIndex = 0;
    refreshType();
}

/***************************************************
 * Bouton  Annuler (modification), on vide les champs
 */
function resetEdit() {
    //Reinitialiser l'état de l'objet
    refreshHTML(Map.getArea(document.getElementById('changeId').value));
    //vider la variable temporaire
    areaTemp = null;

    document.getElementById('option-list-create').classList.remove('d-none');
    document.getElementById('option-list-edit').classList.add('d-none');

    document.getElementById('changeId').value = '';
    document.getElementById('changeNom').value = '';
    document.getElementById('changeX').value = '';
    document.getElementById('changeY').value = '';
    document.getElementById('changeRadius').value = '';
    document.getElementById('changeWidth').value = '';
    document.getElementById('changeHeight').value = '';

    document.getElementById('changeWidth').parentElement.classList.add('hidden');
    document.getElementById('changeHeight').parentElement.classList.add('hidden');
    document.getElementById('changeRadius').parentElement.classList.add('hidden');

    editMode = false;
}


/***************************************************************************************
 * Bouton modifier : Affiche le formulaire et le remplit avec les données de l'objet modifié
 */
function btnEditAire(id){
    editMode = true;
    document.getElementById('option-list-create').classList.add('d-none');
    document.getElementById('option-list-edit').classList.remove('d-none');

    //Récupérer l'objet Area
    let area = Map.getArea(id);
    areaTemp = area;
    //Sauvegarder L'area
    
    //Remplir le formulaire avec les infos de l'aire
    document.getElementById('changeNom').value = area.nom;
    document.getElementById('changeX').value = area.getX();
    document.getElementById('changeY').value = area.getY();
    document.getElementById('changeId').value = area.id;
    document.getElementById('changeType').value = area.typeAire;
    // Si l'objet area est un rectagne
    if (area.typeAire == 'rect'){
        document.getElementById('changeHeight').parentElement.classList.remove('hidden');
        document.getElementById('changeHeight').value = area.height;
        document.getElementById('changeWidth').parentElement.classList.remove('hidden');
        document.getElementById('changeWidth').value = area.width;
    // Si l'objet area est un cercle
    }else if (area.typeAire == 'circle'){
        document.getElementById('changeRadius').parentElement.classList.remove('hidden');
        document.getElementById('changeRadius').value = area.radius;
    }
}