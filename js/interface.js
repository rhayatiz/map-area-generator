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
    objetMap.getArea = function(id){
        for(i = 0; i < this.tabObjetArea.length ; i++){
            if (this.tabObjetArea[i].id == id){
                return this.tabObjetArea[i];
            }
        }
    }
    objetMap.deleteArea = function(id){
        for(i = 0; i < this.tabObjetArea.length ; i++){
            if (this.tabObjetArea[i].id == id){
                this.tabObjetArea.splice(id, 1);
            }
        }
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
var objectAreaIndex = 0;
/**
 * Objet <area> de type rect
 */
function objetAreaCarre(nom, typeAire = 'rect', ensembleObjetPoint){
    let carre = {};
    carre.id = objectAreaIndex++;
    carre.nom = nom;
    carre.typeAire = typeAire;
    carre.ensembleObjetPoint = ensembleObjetPoint;
    carre.width = carre.ensembleObjetPoint[1].x - carre.ensembleObjetPoint[0].x;
    carre.height = carre.ensembleObjetPoint[1].y - carre.ensembleObjetPoint[0].y;
    // retourne les coordonnées en chaîne : x1, y1, x1, y2
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

    carre.setXY = function(x, y){
        carre.ensembleObjetPoint[0].x = x;
        carre.ensembleObjetPoint[0].y = y;
        carre.ensembleObjetPoint[1].x = parseFloat(carre.ensembleObjetPoint[0].x) + parseFloat(carre.width);
        carre.ensembleObjetPoint[1].y = parseFloat(carre.ensembleObjetPoint[0].y) + parseFloat(carre.height);
    }

    carre.getX = function(){
        return carre.ensembleObjetPoint[0].x;
    }

    carre.getY = function(){
        return carre.ensembleObjetPoint[0].y;
    }
    return carre;
}

/**
 * Objet <area> de type circle
 */
function objetAreaCircle(nom, typeAire = 'circle', objetPoint, radius){
    let circle = {};
    circle.id = objectAreaIndex++;
    circle.nom = nom;
    circle.typeAire = typeAire;
    circle.objetPoint = objetPoint;
    circle.radius = radius;

    circle.getCoords = function(){
        return objetPoint.x + ',' + objetPoint.y + ',' + circle.radius;
    }
    circle.getX = function(){
        return circle.objetPoint.x;
    }
    circle.getY = function(){
        return circle.objetPoint.y;
    }

    circle.setXY = function(x,y){
        circle.objetPoint.x = x;
        circle.objetPoint.y = y;
    }

    circle.setRadius = function(radius){
        circle.radius = radius;
    }

    return circle;
}