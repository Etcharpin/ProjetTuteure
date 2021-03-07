// get canvas related references
var canvas = document.getElementById("terrain");
zeubi = document.getElementById
var ctx = canvas.getContext("2d");
var le_contexte = canvas.getContext("2d");
var BB = canvas.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;
canvas.width = window.innerWidth*0.74;
var lt = canvas.width;
canvas.height = lt*0.536;
var ht = canvas.height;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var buttonPNG = document.getElementById('btn-download');
var buttonPDF = document.getElementById('btn-downloadpdf');
var createtextbox = document.createElement("INPUT");
createtextbox.setAttribute("type", "text");

// drag related variables
var dragok = false;
var startX;
var startY;

//variable pour donner le ballon
var ball = false;
var nbball=0;
var nba = 0;
var nbb = 0;

//variable pour les tirs
var tirable = false;
var nbtir = 0;
//variable pour les zones d'influence
var nbzone = 0;
//array de points pour dessiner la zone d'influence
var zone = [];
var zonable = false;
var nbpoints = 0;

//variable pour editer zone d influence et mouvements
var edit = false;
var ecra = false;
//variable pour creer des deplacements
var bouge = false;
var nbptsdep = 0;
var currentdep = 0;
var deple  = [];
var nbbase = 0;
var deplacement = [];
var depdeu = [];
var nbdepdeu =0;
var usabledep = false;
var currentdepdeu =false;
var currentdepun = false;
var drideu = [];
var nbdrideu = 0;

var dribblement = [];
var nbptsdib = 0;
var drib = 0;
var nbbased =0;
var nbdrib = 0;
//variable pour faire une passe 
var nbjpass = 0;
var passable = false;
var nbclicpass = 0;
var dernierpass = null;
// array de cercle de joueurs
var joueurs = [];
// array de cercle d'adversaire
var adversaire = [];
// array de passes
var passes = [];
// array de numero de joueur pour créér la passe
var jpass = [];
// array d'action pour pouvoir supprimer la derniere 
var last = [];

var nbhig = 0;
// listen for mouse events
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.onmousemove = myMove;

// call to draw the scene
draw();

// draw a single rect
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.strokeStyle ="black";
    ctx.closePath();
    ctx.fill();
}

function cercle(x,y,z,a,b,c,g) {
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.strokeStyle ="black";
    ctx.arc(x,y,z,a,b,c);
    ctx.fill();
}

function cercleedit(x,y,z,a,b,c,g) {
    le_contexte.fillStyle = g;
    le_contexte.beginPath();
    le_contexte.arc(x,y,z,a,b,c);
    le_contexte.stroke();
    le_contexte.fill();
}

function lignePasse(a,b,c,d){
    var dx = c - a;
    var dy = d - b;
    var angle = Math.atan2(dy, dx);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.setLineDash([ 9 , 15]);
    ctx.strokeStyle ="black";
    ctx.moveTo(a + 20 * Math.cos(angle) , b + 20 * Math.sin(angle));
    ctx.lineTo(c - 20 * Math.cos(angle), d - 20 * Math.sin(angle));
    ctx.stroke();
    canvas_arrow(ctx, a, b, c, d);
}

//Fonction permettant de dessiner la tête d'une flèche
function canvas_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 30; // length of head in pixels
    var dx = tox - fromx;
    context.lineWidth = 2;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.beginPath();
    context.setLineDash([]);
    context.moveTo(tox - 20 * Math.cos(angle), toy - 20 * Math.sin(angle));
    context.lineTo(tox - 20 * Math.cos(angle) - headlen * Math.cos(angle - Math.PI / 6), toy - 20 * Math.sin(angle) - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox - 20 * Math.cos(angle), toy - 20 * Math.sin(angle));
    context.lineTo(tox - 20 * Math.cos(angle) - headlen * Math.cos(angle + Math.PI / 6), toy - 20 * Math.sin(angle) - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
}

function canvas_arrow2(context, fromx, fromy, tox, toy) {
    var headlen = 30; // length of head in pixels
    context.lineWidth = 2;
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.setLineDash([]);
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function ligne(a,b,c,d){
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeStyle ="black";
    ctx.moveTo(a, b);
    ctx.lineTo(c, d);
    ctx.stroke();
}

function ligneappui(a,b,c,d,hi){

    le_contexte.beginPath();
    if(hi == true){
        ctx.lineWidth = 5;
    }
    else{
        ctx.lineWidth = 2;
    }
    le_contexte.setLineDash([]);
    le_contexte.strokeStyle ="black";
    le_contexte.moveTo(a, b);
    le_contexte.lineTo(c, d);
    le_contexte.stroke();
}

function ligneTir(a,b,c,d){
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.setLineDash([2,5]);
    ctx.strokeStyle ="black";
    ctx.moveTo(a, b);
    ctx.lineTo(c, d);
    ctx.stroke();
}

// clear the canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function draw() {
    clear();
    ctx.fillStyle = "#FAF7F8";
    rect(0, 0, WIDTH, HEIGHT);
    faireterrain();
    // redraw each rect in the rects[] array
    if(depdeu.length > 0 && depdeu.length%2 ==0){
        depladeu();
    }
    if(drideu.length > 0 && drideu.length%2 ==0){
        dribdeu();
    }
    if(dribblement.length%4 == 0 && dribblement.length>0){
           dribblage(); 
    }
    if(currentdep == 1 || deple.length > 0){
        deplacer();
    }
    if(nbzone == 1){
        zoner();
    }
    for (var i = 0; i < joueurs.length; i++) {
        var r = joueurs[i];
        if(r.setball == true){
            r.fill = "green";
            if(r.tiring == true){
                ligneTir(r.x,r.y,lt-lt*0.072, ht/2);
        }
        }
        else{
            r.fill = "red";
        }
        ctx.fillStyle = r.fill;
        cercle(r.x,r.y,r.rayon,r.cache,r.taille,r.last,r.fill);

    }
    for (var i = 0; i < adversaire.length; i++) {
        var r = adversaire[i];
        if(r.setball == true){
            r.fill = "green";
        }
        tx = r.a + r.rayon*Math.cos(r.angle);
        ty = r.b+ r.rayon *Math.sin(r.angle);
        px = r.a + r.rayon*Math.cos(r.inverse);
        py = r.b+ r.rayon *Math.sin(r.inverse);
        rx = tx + r.rretour *Math.cos(r.rangle);
        ry = ty+ r.rretour *Math.sin(r.rangle);
        ox = px + r.rretour*Math.cos(r.rangle);
        oy = py + r.rretour *Math.sin(r.rangle);

        ctx.fillStyle = r.fill;
        ligneappui(tx,ty,rx,ry,r.hig);
        ligneappui(px,py,ox,oy,r.hig);
        ligneappui(tx,ty,px,py,r.hig);
        
    }
    for (var i = 0; i < jpass.length-1; i=i+2) {
        var r = jpass[i];
        var z = jpass[i+1];
        nbjpass=0;
        fairepasse(r,z);
    }
    for(var i = 0; i < passes.length; i++) {
        var r = passes[i];
        lignePasse(r.x.x,r.x.y,r.x2.x,r.y2.y);
    }
}


// handle mousedown events
function myDown(e) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY);
    console.log(mx);
    console.log(my);

    if(ball == true){
        dragok = false;
        for (var i = 0; i < joueurs.length; i++) {
            var r = joueurs[i];
            if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                // if yes, set that rects isDragging=true
                document.body.style.cursor = 'pointer';
                dragok = true;
                if (nbball == 0){
                    r.setball = true;
                    r.gottheball = true;
                    nbball = nbball + 1;
                    last.push({
                        action : 3,
                    });
                    untoggleDonner();
                }
                else 
                     window.alert("Un seul ballon sur le terrain");
                ball = false;
                draw();
            }
        }
        untoggleDonner();
        ball = false;
    }
    if(edit == true){
        dragok = false;
        for (var i = 0; i < zone.length; i++) {
            var r = zone[i];
            if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                document.body.style.cursor = 'pointer';
        }
    }

            for (var i = 0; i < adversaire.length; i++) {
                var r = adversaire[i];
                if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                // if yes, set that rects isDragging=true
                document.body.style.cursor = 'pointer';
                if(r.hig == true){
                    nbhig = nbhig -1;
                   r.hig = false; 
                   if(nbhig == 0){
                    UntoggleOutilAppui();
                   }
                }
                else{
                    nbhig = nbhig+1;
                   r.hig = true; 
                   toggleOutilAppui();
                }
                draw();
            }

    }
        for (var i = 0; i < deple.length; i++) {
            var r = deple[i];
            if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                document.body.style.cursor = 'pointer';
                dragok = true;
                r.isDragging = true;
        }
    }
        for(var i = 0;i<deple.length/4;i++){
            var r = deple[3+i*4];
            if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                if(r.hig == true){
                    r.hig = false;
                    UntoggleOutilAppui();
                }
                else{
                    r.hig = true;
                    if(r.ec)
                    toggleOutilAppui();
                }
                
                draw();
            }
        }

        for (var i = 0; i < depdeu.length; i++) {
            var r = depdeu[i];
            if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                document.body.style.cursor = 'pointer';
                dragok = true;
                r.isDragging = true;
        }
    }
        for (var i = 0; i < drideu.length; i++) {
            var r = drideu[i];
            if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                document.body.style.cursor = 'pointer';
                dragok = true;
                r.isDragging = true;
        }
    }

        for (var i = 0; i < depdeu.length/2; i++) {
            var r = depdeu[1+i*2];
            if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                if(r.hig == true){
                    r.hig = false;
                    UntoggleOutilAppui();
                }
                else{
                    r.hig = true;
                    if(r.ec)
                    toggleOutilAppui();
                }
                
                draw();
        }
    }

        for (var i = 0; i < dribblement.length; i++) {
            var r = dribblement[i];
            if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                document.body.style.cursor = 'pointer';
                dragok = true;
                r.isDragging = true;
        }
    }
}


        if(ecra == true){
            for(h = 0;h< (nbptsdep/4);h++){ 
                var r = deple[3+h*4];
                if (mx > r.x - 2*r.rayon && mx < r.x + 2*r.rayon && my > r.y - 2*r.rayon && my < r.y + 2*r.rayon) {
                     r.ec = true;
                     ecra = false;
                     untoggleecran();
                     draw();
                }
            }

            for(h = 0;h< (nbdepdeu/2);h++){ 
                var r = depdeu[1+h*2];
                if (mx > r.x - 2*r.rayon && mx < r.x + 2*r.rayon && my > r.y - 2*r.rayon && my < r.y + 2*r.rayon) {
                     r.ec = true;
                     ecra = false;
                     untoggleecran();
                     draw();
                }
            }
        }



        if(bouge == true){
            if(nbptsdep%4 == 0){
                for (var i = 0; i < joueurs.length; i++) {
                var r = joueurs[i];
                if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                    document.body.style.cursor = 'pointer';
                    deple.push({
                                x : joueurs[i].x,
                                y: joueurs[i].y,
                                edit : false,
                                rayon : joueurs[i].rayon,
                                jbase : i,
                            });
                    depdeu.push({
                        x : joueurs[i].x,
                        y: joueurs[i].y,
                        edit : false,
                        rayon : joueurs[i].rayon,
                        jbase : i,
                    });
                        r.sedeplace = true,
                        nbptsdep = nbptsdep +1;
                        nbbase = nbbase+1;
                        nbdepdeu = nbdepdeu +1;

                }
            }
            if(nbbase == 0){
                window.alert("Un deplacement doit partir d'un joueur");
                bouge = false;
                draw();
                untoggleDeplacer();
            }
            }
            
        
            else{
            g = mx;
            f = my;
            deple.push({
                x : g,
                y : f,
                edit : false,
                rayon : 15,
                isDragging : false,
                ec :false,
                hig : false,
                angle : Math.PI/2,
                inverse : -Math.PI/2,
            });
                depdeu.push({
                    x : g,
                    y : f,
                    edit : false,
                    rayon : 15,
                    isDragging : false,
                    ec : false,
                    hig : false,
                    angle : Math.PI/2,
                    inverse : -Math.PI/2,
                });
                nbdepdeu = nbdepdeu +1;
            
            nbptsdep = nbptsdep +1;
            cercle(mx,my,3,0,Math.PI*2,false,"black");
            if(nbptsdep%4 == 0){
            	currentdepun = true;
                deplace();
            }
        }
    }
    if(drib == true){
        dragok = false;
            if(nbptsdib%4 == 0){
                for (var i = 0; i < joueurs.length; i++) {
                var r = joueurs[i];
                if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                    if(r.gottheball){
                        document.body.style.cursor = 'pointer';
                        dribblement.push({
                                    x : joueurs[i].x,
                                    y: joueurs[i].y,
                                    edit : false,
                                    rayon : joueurs[i].rayon,
                                    dbase : i,
                                });
                            drideu.push({
                            x : joueurs[i].x,
                            y: joueurs[i].y,
                            edit : false,
                            rayon : joueurs[i].rayon,
                            dbase : i,
                            });
                            nbdrideu = nbdrideu+1;
                            r.dribbb = true,
                            nbptsdib = nbptsdib +1;
                            nbbased = nbbased+1;
                            
                        }
                    if(r.gottheball == false){
                        drib = false;
                        window.alert("Seul un joueur qui a le ballon peu dribbler");
                        draw();
                        untoggleDribble();

                    }
                }
            }
            if(nbbased == 0 && drib == true){
                window.alert("Un dribble doit partir d'un joueur");
                drib = false;
                draw();
                untoggleDribble();
            }
            }
            
        
            else{
            g = mx;
            f = my;
            dribblement.push({
                x : g,
                y : f,
                edit : false,
                rayon : 15,
                isDragging : false,
            });
            drideu.push({
                    x : g,
                    y : f,
                    edit : false,
                    rayon : 15,
                    isDragging : false,
                });
            nbdrideu = nbdrideu +1;
            nbptsdib = nbptsdib +1;
            cercle(mx,my,3,0,Math.PI*2,false,"black");
            if(nbptsdib%4 == 0){
                dribble();
            }
        }
    }

    
    if(zonable == true){
        if(nbzone == 0){
            g = mx;
            f = my;
            zone.push({

                x : g,
                y : f,
                edit : false,
                rayon : 15,
                isDragging : false,
            });
            nbpoints=nbpoints+1;
            cercle(g,f,3,0,Math.PI*2,false,"black");
        }
        else{
            window.alert("Une seule zone d'influence sur le terrain");
            zonable = false;
            untogglezone();
        }
    }


    if(passable == true ){
            nbclicpass = nbclicpass + 1;
            for (var i = 0; i < joueurs.length; i++) {
            var r = joueurs[i];
            if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                // if yes, set that rects isDragging=true
                document.body.style.cursor = 'pointer';
                if (nbjpass % 2 == 0){
                    if(r.gottheball == false){
                        passable = false;
                        nbjpass = 0;
                        window.alert("Seulement un joueur qui possede le ballon a un moment peut faire une passe");
                        document.body.style.cursor = 'default';
                        nbclicpass = 0;
                        untogglePasse();

                    }
                    else
                    {
                        dernierpass = i;
                        addj(i);
                        nbjpass=nbjpass+1;
                    }
                }
                else{
                    if(i == jpass[jpass.length -1].c){
                        window.alert("On ne peut se faire une passe a soit meme");
                        passable = false;
                        jpass.pop();
                        nbclicpass = 0;
                        untogglePasse();
                        nbjpass = 0;
                    }
                    else{
                    joueurs[dernierpass].gottheball = false;
                    r.gottheball = true;
                    dernierpass = i;
                    
                    addj(i);
                    nbjpass=nbjpass+1;
                    }
                } 
                if(nbjpass % 2 == 0){
                    passable=false;
                    nbclicpass = 0;
                    untogglePasse();
                   draw();
                }
            }
    }
    if(nbjpass == 0){
        untogglePasse();
        passable = false;
        nbclicpass = 0;

    }
    if(nbjpass == 1 && nbclicpass == 2){
        jpass.pop();
        untogglePasse();
        passable = false;
        nbclicpass = 0;
        nbjpass = 0;
    }
}
    if(tirable == true){
         for (var i = 0; i < joueurs.length; i++) {
            var r = joueurs[i];
            if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                if(r.gottheball == true){
                    r.tiring = true;
                    tirable = false;
                    nbtir = nbtir +1;

                    last.push({
                        action : 9,
                    });
                    draw();
                }
                else{
                    tirable = false;
                   window.alert("Seul un joueur qui a le ballon peut tirer");
                }
            }
        }
        untoggletire();
    }

else {
    if(edit == false && drib == false){
        for (var i = 0; i < joueurs.length; i++) {
            var r = joueurs[i];
            if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                // if yes, set that rects isDragging=true
                document.body.style.cursor = 'pointer';
                if(drib == false){
                    dragok = true;
                     r.isDragging = true;
            }
            }
        }
        for (var i = 0; i < adversaire.length; i++) {
            var r = adversaire[i];
            if (mx > r.x - r.rayon && mx < r.x + r.rayon && my > r.y - r.rayon && my < r.y + r.rayon) {
                // if yes, set that rects isDragging=true
                document.body.style.cursor = 'pointer';
                dragok = true;
                r.isDragging = true;
            }
        }
    }
}
    // save the current mouse position
    startX = mx;
    startY = my;
}


// handle mouseup events
function myUp(e) {  
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    document.body.style.cursor = 'default';
    dragok = false;
    for (var i = 0; i < joueurs.length; i++) {
        joueurs[i].isDragging = false;
    }
    for (var i = 0; i < adversaire.length; i++) {
        adversaire[i].isDragging = false;
    }
    for (var i = 0; i < zone.length; i++) {
        zone[i].isDragging = false;
    }
    for (var i = 0; i < deple.length; i++) {
        deple[i].isDragging = false;
    }
    for (var i = 0; i < depdeu.length; i++){
    	depdeu[i].isDragging = false;
    }
    for (var i = 0; i < dribblement.length; i++) {
        dribblement[i].isDragging = false;
    }
    for (var i = 0; i < drideu.length; i++) {
        drideu[i].isDragging = false;
    }
}


// handle mouse moves
function myMove(e) {

    // if we're dragging anything...
    if (dragok) {

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mx = parseInt(e.clientX - offsetX);
        var my = parseInt(e.clientY - offsetY);

        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX;
        var dy = my - startY;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < joueurs.length; i++) {
            var r = joueurs[i];
            if (r.isDragging) {
                r.x += dx;
                r.y += dy;
            if(r.sedeplace == true){
               var  a = deple.length/4;
               for(var h = 0;h<a;h++){
                if(deple[h*4].jbase == i){
                     deple[h*4].x += dx;
                    deple[h*4].y += dy;
                }
               }
               var b = depdeu.length/2;
               for(var h = 0;h<b;h++){
               	depdeu[0+h*2].x += dx;
               	depdeu[0+h*2].y += dy;
               }      
            }
            if(r.dribbb == true){
               var  a = dribblement.length/4;
               for(var h = 0;h<a;h++){
                if(dribblement[h*4].dbase == i){
                     dribblement[h*4].x += dx;
                    dribblement[h*4].y += dy;
                }
               }
               var b = drideu.length/2;
               for(var h = 0;h<b;h++){
                drideu[0+h*2].x += dx;
                drideu[0+h*2].y += dy;
               }      
            }
        }
    }
        for (var i = 0; i < adversaire.length; i++) {
            var r = adversaire[i];
            if (r.isDragging) {
                r.x += dx;
                r.y += dy;
                r.a += dx;
                r.b += dy;
                r.c += dy;
                r.d += dx;
            }
        }

        for (var i = 0; i < zone.length; i++) {
            var r = zone[i];
            if (r.isDragging) {
                r.x += dx;
                r.y += dy;
            }
        }
        for (var i = 0; i < deple.length; i++) {
            var r = deple[i];
            if (r.isDragging) {
                if(i%4 != 0){
                  r.x += dx;
                  r.y += dy;
              }
          }
      }

        for (var i = 0; i < depdeu.length; i++) {
            var r = depdeu[i];
            if (r.isDragging) {
                if(i%2 != 0){
                  r.x += dx;
                  r.y += dy;
              }
          }
      }

        for (var i = 0; i < dribblement.length; i++) {
            var r = dribblement[i];
            if (r.isDragging) {
                if(i%4 != 0){
                  r.x += dx;
                  r.y += dy;
              }
          }
      }

      for (var i = 0; i < drideu.length; i++) {
            var r = drideu[i];
            if (r.isDragging) {
                if(i%2 != 0){
                  r.x += dx;
                  r.y += dy;
              }
          }
      }


        // redraw the scene with the new rect positions
        draw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;

    }
}


function ajouterjoueur() {
    if (joueurs.length >= 5)
        window.alert("Nombre de joueurs maximum atteint");
    else {
        joueurs.push({
        x: 60,
        y: 35 + ((joueurs.length + 1) * 50),
        rayon: 20,
        cache: 0,
        taille: Math.PI*2,
        last: false,
        fill: "red",
        isDragging: false,
        setball : false,
        gottheball : false,
        sedeplace : false,
        tiring : false,
    });
        last.push({
            action : 1,
        });
        cercle(60,35 + (joueurs.length * 50),20,0,Math.PI*2,false,"red");
    }
}

function ajouteradversaire() {

    if (adversaire.length >= 5)
        window.alert("Nombre d'adversaire maximum atteint");
    else {
        adversaire.push({
        x: 560,
        y: 35 + ((adversaire.length + 1) * 50),
        rayon: 20,
        cache: 0,
        taille: Math.PI*2,
        last: false,
        fill: "black",
        isDragging: false,
        setball : false,
        hig : false,
        a : 560,
        b : 35 + (((adversaire.length + 1)* 50)),
        angle : Math.PI/2,
        inverse : -Math.PI/2,
        rretour : 13,
        rangle : 2 * Math.PI,
    });
        last.push({
            action : 2,
        });
        ligneappui(560,35 + (adversaire.length * 50)+20,560+13,35 + (adversaire.length * 50)+20);
        ligneappui(560,35 + (adversaire.length * 50)-20,560+13,35 + (adversaire.length * 50)-20);
        tx = 560 + 20*Math.cos(Math.PI/2);
        ty = 35 + (adversaire.length * 50)+ 20 *Math.sin(Math.PI/2);
        px = 560 + 20*Math.cos((-Math.PI/2));
        py = 35 + (adversaire.length * 50)+ 20 *Math.sin((-Math.PI/2));
        ligneappui(px,py,tx,ty,false);
        
    }
}

function fairepasse(a,b) {

        passes.push({
        x: joueurs[a.c],
        y: joueurs[a.c],
        x2 : joueurs[b.c],
        y2 : joueurs[b.c],
    });
       
       jpass.pop();
       jpass.pop();
       last.push({
            action : 5,
            depart : a.c,
            arrivé : b.c,
        });
        lignePasse(joueurs[a.c].x,joueurs[a.c].y,joueurs[b.c].x,joueurs[b.c].y);
;
}


function faireterrain() {
    ctx.lineWidth="5"; 

//Bordures du terrain
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.rect(0, 0, lt, ht);
ctx.stroke();


ctx.lineWidth="2"; 
//Ligne centrale
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.moveTo(lt/2, ht);
ctx.lineTo(lt/2, 0);
ctx.stroke();

//Cercle central
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.arc(lt/2, ht/2, lt*0.064, 0, Math.PI*2, false);
ctx.stroke();


/* RAQUETTES */
//Rectangle raquette gauche
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.rect(0, ht/3, lt*0.208, ht/3);
ctx.stroke();

//Rectangle raquette droite
ctx.beginPath();  
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.rect(lt-lt*0.208, ht/3, lt-lt*0.208, ht/3);
ctx.stroke();

//Cercle raquette gauche
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.arc(lt*0.208, ht/2, lt*0.064, 1.5*Math.PI, 0.5*Math.PI, false);
ctx.stroke();

//Cercle raquette droite
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.arc(lt-(lt*0.208), ht/2, lt*0.064, 0.5*Math.PI, 1.5*Math.PI, false);
ctx.stroke();


/* LIGNES LANCERS FRANCS */
//Ligne lf 1 gauche
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.moveTo(0, 0.06*ht);
ctx.lineTo(lt*0.075, 0.06*ht);
ctx.stroke();

//Ligne lf 2 gauche
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.moveTo(0, 0.94*ht);
ctx.lineTo(lt*0.075, 0.94*ht);
ctx.stroke();

// Cercle lf gauche
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.arc(lt*0.063, ht/2, ht*0.44, 1.5*Math.PI, 0.5*Math.PI, false);
ctx.stroke();


//Ligne lf 1 droite
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.moveTo(lt, 0.06*ht);
ctx.lineTo(lt*0.925, 0.06*ht);
ctx.stroke();

//Ligne lf 2 droite
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.moveTo(lt, 0.94*ht);
ctx.lineTo(lt*0.925, 0.94*ht);
ctx.stroke();

//Cercle lf droite
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.arc(lt*0.937, ht/2, lt*0.236, 0.5*Math.PI, 1.5*Math.PI, false);
ctx.stroke();


/* PANIERS */
//Cercle panier gauche
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.arc(lt*0.063, ht/2, ht*0.083, 1.5*Math.PI, 0.5*Math.PI, false);
ctx.stroke();

//Panier gauche
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.moveTo(lt*0.06, ht*0.44);
ctx.lineTo(lt*0.06, ht*0.56);
ctx.stroke();

ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.arc(lt*0.072, ht/2, ht*0.01, 0, Math.PI*2, false);
ctx.stroke();

ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.moveTo(lt*0.06, ht/2);
ctx.lineTo(lt*0.067, ht/2);
ctx.stroke();


//Cercle panier droit
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.arc(lt-lt*0.063, ht/2, ht*0.083, 0.5*Math.PI, 1.5*Math.PI, false);
ctx.stroke();

//Panier droit
ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.moveTo(lt-lt*0.06, ht-ht*0.44);
ctx.lineTo(lt-lt*0.06, ht-ht*0.56);
ctx.stroke();

ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.arc(lt-lt*0.072, ht/2, ht*0.01, 0, Math.PI*2, false);
ctx.stroke();

ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle ="black";
ctx.moveTo(lt-lt*0.06, ht-ht/2);
ctx.lineTo(lt-lt*0.067, ht-ht/2);
ctx.stroke();
}

function zoner(){
    if(edit == true){
        le_contexte.beginPath();
        le_contexte.fillStyle = "rgba(128,128,128,0.3)";
        le_contexte.strokeStyle = "rgb(255,0,0)";
        cercleedit(zone[0].x,zone[0].y,15,0,Math.PI*2,"rgba(128,128,128,0.3)");
        for (j = 1; j< nbpoints;j++){
            cercleedit(zone[j].x,zone[j].y,15,0,Math.PI*2,"rgba(128,128,128,0.3)");
        }
        le_contexte.moveTo(zone[0].x, zone[0].y);
        for (i = 1; i< nbpoints;i++){
            le_contexte.lineTo(zone[i].x, zone[i].y);
        }
        le_contexte.lineTo(zone[0].x, zone[0].y);
        le_contexte.fill();
        le_contexte.stroke();


    }
    else{
        le_contexte.beginPath();
        le_contexte.fillStyle = "rgba(128,128,128,0.3)";
        le_contexte.strokeStyle = "rgb(255,0,0)";
        le_contexte.moveTo(zone[0].x, zone[0].y);
        for (i = 1; i< nbpoints;i++)
            le_contexte.lineTo(zone[i].x, zone[i].y);
        le_contexte.lineTo(zone[0].x, zone[0].y);
        le_contexte.fill();
        le_contexte.stroke();
    }

}


function deplacer(){



    if ( edit == true){
        le_contexte.beginPath();
        le_contexte.strokeStyle = "black";
        for(i = 0;i< (nbptsdep/4);i++){
            for(j=1;j<4;j++){
                cercleedit(deple[j+i*4].x,deple[j+i*4].y,15,0,Math.PI*2,"rgba(128,128,128,0.9)");
            }
            for(h = 0;h< (nbptsdep/4);h++){
                le_contexte.moveTo(deple[0+h*4].x,deple[0+h*4].y);
                le_contexte.bezierCurveTo(deple[1+h*4].x,deple[1+h*4].y,deple[2+h*4].x,deple[2+h*4].y,deple[3+h*4].x,deple[3+h*4].y);
                if(deple[3+h*4].ec == false){
                    canvas_arrow2(le_contexte, deple[2+h*4].x, deple[2+h*4].y, deple[3+h*4].x, deple[3+h*4].y);
                }
                  else{
                    le_contexte.beginPath();
                    le_contexte.moveTo(deple[0+h*4].x,deple[0+h*4].y);
                    le_contexte.bezierCurveTo(deple[1+h*4].x,deple[1+h*4].y,deple[2+h*4].x,deple[2+h*4].y,deple[3+h*4].x,deple[3+h*4].y);
                    a = deple[3+h*4].x + deple[3+h*4].rayon*Math.cos(deple[3+h*4].angle);
                    b = deple[3+h*4].y + deple[3+h*4].rayon*Math.sin(deple[3+h*4].angle);
                    c = deple[3+h*4].x + deple[3+h*4].rayon*Math.cos(deple[3+h*4].inverse);
                    d = deple[3+h*4].y + deple[3+h*4].rayon*Math.sin(deple[3+h*4].inverse);
                    
                    if(deple[3+h*4].hig == true){
                        ctx.lineWidth = 5;
                    }
                    else{
                        ctx.lineWidth = 2;
                    }
                    le_contexte.setLineDash([]);
                    le_contexte.strokeStyle ="black";
                    le_contexte.moveTo(a, b);
                    le_contexte.lineTo(c, d);
                    le_contexte.stroke();
                }
            }
        }
        le_contexte.stroke();
    }
    else{
        if(deple.length > 0 && deple.length %4 == 0){
        le_contexte.beginPath();
        le_contexte.strokeStyle = "black";
        for(i = 0;i< (nbptsdep/4);i++){
            if(deple[3+i*4].ec == false){
            le_contexte.moveTo(deple[0+i*4].x,deple[0+i*4].y);
            le_contexte.bezierCurveTo(deple[1+i*4].x,deple[1+i*4].y,deple[2+i*4].x,deple[2+i*4].y,deple[3+i*4].x,deple[3+i*4].y);
            canvas_arrow2(le_contexte, deple[2+i*4].x, deple[2+i*4].y, deple[3+i*4].x, deple[3+i*4].y);
            }
            else{
                    le_contexte.beginPath();
                    le_contexte.moveTo(deple[0+i*4].x,deple[0+i*4].y);
                    le_contexte.bezierCurveTo(deple[1+i*4].x,deple[1+i*4].y,deple[2+i*4].x,deple[2+i*4].y,deple[3+i*4].x,deple[3+i*4].y);
                    a = deple[3+i*4].x + deple[3+i*4].rayon*Math.cos(deple[3+i*4].angle);
                    b = deple[3+i*4].y + deple[3+i*4].rayon*Math.sin(deple[3+i*4].angle);
                    c = deple[3+i*4].x + deple[3+i*4].rayon*Math.cos(deple[3+i*4].inverse);
                    d = deple[3+i*4].y + deple[3+i*4].rayon*Math.sin(deple[3+i*4].inverse);
                    if(deple[3+i*4].hig == true){
                        le_contexte.lineWidth = 5;
                    }
                    else{
                        le_contexte.lineWidth = 2;
                    }
                    le_contexte.setLineDash([]);
                    le_contexte.strokeStyle ="black";
                    le_contexte.moveTo(a, b);
                    le_contexte.lineTo(c, d);
                    le_contexte.stroke();
                }

        }
        ctx.stroke();
        le_contexte.stroke();
    }
    }
}

function depladeu(){
	if(edit == true){
			le_contexte.beginPath();
	    	le_contexte.strokeStyle = "black";
	    	
	    for(i = 0; i< (nbdepdeu/2);i++){
            cercleedit(depdeu[1+i*2].x,depdeu[1+i*2].y,15,0,Math.PI*2,"rgba(128,128,128,0.9)");
            if(depdeu[1+i*2].ec == false){
                le_contexte.moveTo(depdeu[0+i*2].x,depdeu[0+i*2].y);
                le_contexte.lineTo(depdeu[1+i*2].x,depdeu[1+i*2].y);
                canvas_arrow2(le_contexte, depdeu[0+i*2].x, depdeu[0+i*2].y, depdeu[1+i*2].x, depdeu[1+i*2].y);
            }
            else{
                    le_contexte.beginPath();
                    le_contexte.moveTo(depdeu[0+i*2].x,depdeu[0+i*2].y);
                    le_contexte.lineTo(depdeu[1+i*2].x,depdeu[1+i*2].y);
                    a = depdeu[1+i*2].x + depdeu[1+i*2].rayon*Math.cos(depdeu[1+i*2].angle);
                    b = depdeu[1+i*2].y + depdeu[1+i*2].rayon*Math.sin(depdeu[1+i*2].angle);
                    c = depdeu[1+i*2].x + depdeu[1+i*2].rayon*Math.cos(depdeu[1+i*2].inverse);
                    d = depdeu[1+i*2].y + depdeu[1+i*2].rayon*Math.sin(depdeu[1+i*2].inverse);
                    if(depdeu[1+i*2].hig == true){
                        le_contexte.lineWidth = 5;
                    }
                    else{
                        le_contexte.lineWidth = 2;
                    }
                    le_contexte.setLineDash([]);
                    le_contexte.strokeStyle ="black";
                    le_contexte.moveTo(a, b);
                    le_contexte.lineTo(c, d);
                    le_contexte.stroke();
                }
	}
	le_contexte.stroke();
}
	else{
			le_contexte.beginPath();
            le_contexte.strokeStyle = "black";
            
        for(i = 0; i< (nbdepdeu/2);i++){
            if(depdeu[1+i*2].ec == false){
                le_contexte.moveTo(depdeu[0+i*2].x,depdeu[0+i*2].y);
                le_contexte.lineTo(depdeu[1+i*2].x,depdeu[1+i*2].y);
                canvas_arrow2(le_contexte, depdeu[0+i*2].x, depdeu[0+i*2].y, depdeu[1+i*2].x, depdeu[1+i*2].y);
            }
            else{
                    le_contexte.beginPath();
                    le_contexte.moveTo(depdeu[0+i*2].x,depdeu[0+i*2].y);
                    le_contexte.lineTo(depdeu[1+i*2].x,depdeu[1+i*2].y);
                    a = depdeu[1+i*2].x + depdeu[1+i*2].rayon*Math.cos(depdeu[1+i*2].angle);
                    b = depdeu[1+i*2].y + depdeu[1+i*2].rayon*Math.sin(depdeu[1+i*2].angle);
                    c = depdeu[1+i*2].x + depdeu[1+i*2].rayon*Math.cos(depdeu[1+i*2].inverse);
                    d = depdeu[1+i*2].y + depdeu[1+i*2].rayon*Math.sin(depdeu[1+i*2].inverse);
                    if(depdeu[1+i*2].hig == true){
                        le_contexte.lineWidth = 5;
                    }
                    else{
                        le_contexte.lineWidth = 2;
                    }
                    le_contexte.setLineDash([]);
                    le_contexte.strokeStyle ="black";
                    le_contexte.moveTo(a, b);
                    le_contexte.lineTo(c, d);
                    le_contexte.stroke();
                }
    }
    le_contexte.stroke();
	
}
}

function dribdeu(){
    if(edit == true){
            le_contexte.beginPath();
            le_contexte.strokeStyle = "black";
            
        for(i = 0; i< (nbdrideu/2);i++){
            cercleedit(drideu[1+i*2].x,drideu[1+i*2].y,15,0,Math.PI*2,"rgba(128,128,128,0.9)");
            le_contexte.moveTo(drideu[0+i*2].x,drideu[0+i*2].y);
            le_contexte.lineTo(drideu[1+i*2].x,drideu[1+i*2].y);
            canvas_arrow2(le_contexte, drideu[0+i*2].x, drideu[0+i*2].y, drideu[1+i*2].x, drideu[1+i*2].y);
          
    }
    le_contexte.stroke();
}
    else{
            le_contexte.beginPath();
            le_contexte.strokeStyle = "black";
            
        for(i = 0; i< (nbdrideu/2);i++){
            le_contexte.moveTo(drideu[0+i*2].x,drideu[0+i*2].y);
            le_contexte.lineTo(drideu[1+i*2].x,drideu[1+i*2].y);
            canvas_arrow2(le_contexte, drideu[0+i*2].x, drideu[0+i*2].y, drideu[1+i*2].x, drideu[1+i*2].y);
          
    }
    le_contexte.stroke();
    
}
}

function dribblage(){
    if ( edit == true){
        le_contexte.beginPath();
        le_contexte.strokeStyle = "black";
        for(i = 0;i< (nbptsdib/4);i++){
            for(j=1;j<4;j++){
                cercleedit(dribblement[j+i*4].x,dribblement[j+i*4].y,15,0,Math.PI*2,"rgba(128,128,128,0.9)");
            }
            for(h = 0;h< (nbptsdib/4);h++){
                le_contexte.moveTo(dribblement[0+h*4].x,dribblement[0+h*4].y);
                le_contexte.bezierCurveTo(dribblement[1+h*4].x,dribblement[1+h*4].y,dribblement[2+h*4].x,dribblement[2+h*4].y,dribblement[3+h*4].x,dribblement[3+h*4].y);
                canvas_arrow2(le_contexte, dribblement[2+h*4].x, dribblement[2+h*4].y, dribblement[3+h*4].x, dribblement[3+h*4].y);
            }
        }
        le_contexte.stroke();
    }
    else{
        if(dribblement.length > 0 && dribblement.length %4 == 0){
        le_contexte.beginPath();
        le_contexte.strokeStyle = "black";
        for(i = 0;i< (nbptsdib/4);i++){
            le_contexte.moveTo(dribblement[0+i*4].x,dribblement[0+i*4].y);
            le_contexte.bezierCurveTo(dribblement[1+i*4].x,dribblement[1+i*4].y,dribblement[2+i*4].x,dribblement[2+i*4].y,dribblement[3+i*4].x,dribblement[3+i*4].y);
            canvas_arrow2(le_contexte, dribblement[2+i*4].x, dribblement[2+i*4].y, dribblement[3+i*4].x, dribblement[3+i*4].y);


        }
        le_contexte.stroke();
    }
    }
}

function triggerdonnerlaballe(){
    if(ball == true){
        ball = false;
        untoggleDonner();
    }else{
    toggleDonner();
    ball = true;
}
}

function triggerfairepasse(){
    if(joueurs.length < 2){
        window.alert("On ne peut faire une passe si on a pas 2 joueurs");
        return;
    }
    if(passable == true){
        passable = false;
        untogglePasse();
        return;
    }
    if(passable == false && joueurs.length >= 2){
        togglePasse();
        passable = true;
        return;

    }
}

function addj(a){
     jpass.push({
        c : a,
    });
}

function retourarriere(){

    x = last.length;
    if(x == 0){
        window.alert("Vous ne pouvez revenir en arriere")
    }
    else{
        if(last[x-1].action == 1){
            joueurs.pop();
            last.pop();
            draw();
        }
        if(last[x-1].action == 2){
            adversaire.pop();
            last.pop();
            draw();
        }
        if(last[x-1].action == 3){

            for (var i = 0; i < joueurs.length; i++) {
            var r = joueurs[i];
            if(r.setball == true){
                r.setball = false;
                nbball = nbball - 1;
                last.pop();
                draw();
            }
            }
        }
    
        if(last[x-1].action == 4){

            for (var i = 0; i < adversaire.length; i++) {
            var r = adversaire[i];
            if(r.setball = true){
                r.setball = false;
                nbball = nbball - 1;
                last.pop();
                draw();
            }
        }
    }
        if(last[x-1].action == 5){
            joueurs[last[x-1].arrivé].gottheball = false;
            joueurs[last[x-1].depart].gottheball = true;
            last.pop();
            passes.pop();
            draw();

        }
        if(last[x-1].action == 6){
            while(zone.length != 0){
                zone.pop();
            }
            nbzone = 0;
            nbpoints = 0;
            last.pop();
            draw();

        }

        if(last[x-1].action == 7){
            for(i = 0; i< 4;i++){
                deple.pop();
            }
            nbptsdep = nbptsdep -4;
            last.pop();
            draw();

        }

        if(last[x-1].action == 8){
            for(i = 0; i< 4;i++){
                dribblement.pop();
            }
            nbptsdib = nbptsdib -4;
            last.pop();
            nbdrib = nbdrib -1;
            draw();

        }

        if(last[x-1].action == 9){
            for (var i = 0; i < joueurs.length; i++) {
            var r = joueurs[i];
                r.tiring = false;
            }
            nbtir = nbtir-1;
            last.pop();
            draw();

        }

        if(last[x-1].action == 10){
            for(i =0; i<2;i++){
                depdeu.pop();
            }
            nbdepdeu = nbdepdeu-2;
            last.pop();
            draw();

        }

        if(last[x-1].action == 11){
            for(i =0; i<2;i++){
                drideu.pop();
            }
            nbdrideu = nbdrideu-2;
            last.pop();
            draw();

        }

    }

 }

function influer(){
    if(zonable == true){
        untogglezone();
        zonable = false;
        if(zonable == false && nbpoints > 2 && nbzone == 0){
            nbzone = 1;
            last.push({
                action : 6,
            });
            draw();
        }
    }
    else{
        zonable = true ;
        togglezone();
    }
}

function editer(){
    if(edit == false){
        edit = true;
        draw();
        toggleediter();
    }
    else{
        for (var i = 0; i < adversaire.length; i++) {
            adversaire[i].hig = false;
        }
        for (var i = 0;i<deple.length/4;i++){
            deple[3+i*4].hig = false;
        }
        for (var i = 0;i<depdeu.length/2;i++){
            depdeu[1+i*2].hig = false;
        }
        nbhig =0;
        edit = false;
        draw();
        untoggleediter();
        UntoggleOutilAppui();
    }
}


function deplace(){
    if(bouge == false){
        bouge = true;
        toggleDeplacer();
        draw();
    }
    else{
        bouge = false;
        untoggleDeplacer();
        if(nbptsdep >3 && currentdepun == true){
        	for(j = 0;j<4;j++){
                depdeu.pop();
            }
            nbdepdeu = nbdepdeu -4;
            currentdep = 1;
            last.push({
                action : 7,
            });
            draw();
            usabledep = true;
            currentdepun = false;
        }
        if(nbdepdeu%2 == 0){
            while(deple.length%4 !=0){
                deple.pop();
            }
            while(nbptsdep%4 !=0){
                nbptsdep = nbptsdep-1;
            }
            last.push({
                action : 10,
            });
            draw();
            usabledep = true;

        }
        if(nbptsdep < 3 && nbdepdeu != 2 && !usabledep){
            window.alert("Il vous faut 4 points pour se deplacer en courbe ou 2 pour une ligne")
            while(deple.length%4 !=0){
                deple.pop();
            }
            nbdepdeu == 0;
            while(depdeu.length%4 !=0){
                depdeu.pop();
            }
            nbptsdep = 0;
            draw();
        }
    }
}


function dribble(){
    if(drib == false){
        drib = true;
        toggleDribble();
        draw();
    }
    else{
        drib = false;
        untoggleDribble();

        if(nbptsdib >3){
            for(j = 0;j<4;j++){
                drideu.pop();
            }
            last.push({
                action : 8,
            });
            nbdrib = nbdrib +1;
            draw();

        }
        if(nbdrideu%2 == 0 && nbdrib == 0){
            while(dribblement.length%4 !=0){
                dribblement.pop();
            }
            while(nbdrib%4 !=0){
                nbdrib = nbdrib-1;
            }
            last.push({
                action : 11,
            });
            draw();
            usabledep = true;

        }
        if(nbptsdib < 3 && nbdrideu != 2 && !usabledep){
            window.alert("Il vous faut 4 points pour dribbler en courbe ou 2 pour une ligne")
            while(dribblement.length%4 !=0){
                dribblement.pop();
            }
            nbdrideu == 0;
            while(drideu.length%4 !=0){
                drideu.pop();
            }
            nbptsdib = 0;
            draw();
        }
    }
}

function tire(){
    if(tirable == false){
        if(nbtir >0){
            window.alert("Un tir maximum par schéma");
            untoggletire();
        }
        else{
           tirable = true;
           toggletire();
        }     
    }
    else{
        tirable = false;
        untoggletire();
    }

}

function tournergauche(){
    for (var i = 0; i < adversaire.length; i++) {
            var r = adversaire[i];
            if(r.hig){
                r.angle = r.angle - Math.PI/10;
                r.inverse = r.inverse - Math.PI/10;
                r.rangle = r.rangle - Math.PI/10;
            }
        }
    for (var i = 0;i<deple.length/4;i++){
        var r = deple[3+i*4];
        if(r.hig){
            r.angle = r.angle - Math.PI/10;
            r.inverse = r.inverse - Math.PI/10;
            r.rangle = r.rangle - Math.PI/10;
        }
    }

    for (var i = 0;i<depdeu.length/2;i++){
        var r = depdeu[1+i*2];
        if(r.hig){
            r.angle = r.angle - Math.PI/10;
            r.inverse = r.inverse - Math.PI/10;
            r.rangle = r.rangle - Math.PI/10;
        }
    }
    draw();
}

function tournerdroite(){
    for (var i = 0; i < adversaire.length; i++) {
            var r = adversaire[i];
            if(r.hig){
                r.angle = r.angle + Math.PI/10;
                r.inverse = r.inverse + Math.PI/10;
                r.rangle = r.rangle + Math.PI/10;
            }
        }
    for (var i = 0;i<deple.length/4;i++){
        var r = deple[3+i*4];
        if(r.hig){
            r.angle = r.angle + Math.PI/10;
            r.inverse = r.inverse + Math.PI/10;
            r.rangle = r.rangle + Math.PI/10;
        }
    }

        for (var i = 0;i<depdeu.length/2;i++){
        var r = depdeu[1+i*2];
        if(r.hig){
            r.angle = r.angle + Math.PI/10;
            r.inverse = r.inverse + Math.PI/10;
            r.rangle = r.rangle + Math.PI/10;
        }
    }
    draw();
}

function showData (form) {
    var showData= document.getElementById("myTextBox");
    x = showData.value * (Math.PI/180);
     for (var i = 0; i < adversaire.length; i++) {
            var r = adversaire[i];
            if(r.hig){
                r.angle = x;
                r.inverse = Math.PI +x;
                r.rangle = x - Math.PI/2;
            }
        }
    for (var i = 0; i < deple.length/4; i++) {
            var r = deple[3+i*4];
            if(r.hig){
                r.angle = x;
                r.inverse = Math.PI +x;
                r.rangle = x - Math.PI/2;
            }
        }

    for (var i = 0; i < depdeu.length/2; i++) {
            var r = depdeu[1+i*2];
            if(r.hig){
                r.angle = x;
                r.inverse = Math.PI +x;
                r.rangle = x - Math.PI/2;
            }
        }
    draw();
}

function nextStep(){
    for(var i = 0;i < joueurs.length;i++){
        var r = joueurs[i];
        for(var t =0 ; t< deple.length/4;t++){
            if(deple[0+t*4].jbase == i){
                r.x = deple[3+t*4].x;
                r.y = deple[3+t*4].y;
                deple.splice(0+t*4);
                deple.splice(1+t*4);
                deple.splice(2+t*4);
                deple.splice(3+t*4);
                nbptsdep = nbptsdep-4;
            }
        }
        for(var t =0 ; t< depdeu.length/2;t++){
            if(depdeu[0+t*2].jbase == i){
                r.x = depdeu[1+t*2].x;
                r.y = depdeu[1+t*2].y;
                depdeu.splice(0+t*2);
                depdeu.splice(1+t*2);
                nbdepdeu = nbdepdeu-2;
            }
        }
        for(var t =0 ; t< dribblement.length/4;t++){
            if(dribblement[0+t*4].dbase == i){
                r.x = dribblement[3+t*4].x;
                r.y = dribblement[3+t*4].y;
                dribblement.splice(0+t*4);
                dribblement.splice(1+t*4);
                dribblement.splice(2+t*4);
                dribblement.splice(3+t*4);
                nbptsdib = nbptsdib-4;
            }
        }
        for(var t =0 ; t< drideu.length/2;t++){
            if(drideu[0+t*2].dbase == i){
                r.x = drideu[1+t*2].x;
                r.y = drideu[1+t*2].y;
                drideu.splice(0+t*2);
                drideu.splice(1+t*2);
                nbdrideu = nbdrideu-2;
            }
        }

    }
    draw();

}

function toggleOutilAppui(){
    document.getElementById("gauche").classList.remove('yay');
    document.getElementById("droite").classList.remove('yay');
    document.getElementById("perso").classList.remove('yay');

}

function UntoggleOutilAppui(){
    document.getElementById("gauche").classList.add('yay');
    document.getElementById("droite").classList.add('yay');
    document.getElementById("perso").classList.add('yay');

}

function togglePasse(){
    document.getElementById("bouttonpasse").classList.add('red');

}
function untogglePasse(){
    document.getElementById("bouttonpasse").classList.remove('red');

}

function toggleDeplacer(){
    document.getElementById("bouttondeplacer").classList.add('red');

}
function untoggleDeplacer(){
    document.getElementById("bouttondeplacer").classList.remove('red');

}

function toggleDribble(){
    document.getElementById("bouttondribbler").classList.add('red');

}

function untoggleDribble(){
    document.getElementById("bouttondribbler").classList.remove('red');

}

function toggleDonner(){
    document.getElementById("bouttondonner").classList.add('red');

}

function untoggleDonner(){
    document.getElementById("bouttondonner").classList.remove('red');

}

function togglezone(){
    document.getElementById("bouttoninfluence").classList.add('red');

}
function untogglezone(){
    document.getElementById("bouttoninfluence").classList.remove('red');

}
function toggleediter(){
    document.getElementById("bouttonediter").classList.add('red');

}
function untoggleediter(){
    document.getElementById("bouttonediter").classList.remove('red');

}

function toggletire(){
    document.getElementById("bouttontirer").classList.add('red');

}
function untoggletire(){
    document.getElementById("bouttontirer").classList.remove('red');

}

function toggleecran(){
    document.getElementById("bouttonecran").classList.add('red');

}
function untoggleecran(){
    document.getElementById("bouttonecran").classList.remove('red');

}
 buttonPNG.onclick = function(){
    download(canvas, 'Schema.png');
  }




function download(canvas, filename) {
  var lnk = document.createElement('a'), e;
  lnk.download = filename;


  lnk.href = canvas.toDataURL("image/png;base64");

  /// create a "fake" click-event to trigger the download
  if (document.createEvent) {
    e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, false, false,false, 0, null);
    lnk.dispatchEvent(e);
  } else if (lnk.fireEvent) {
    lnk.fireEvent("onclick");
  }
}








init();


function init() {


        
        
        var button = document.getElementById( 'download' );
        button.addEventListener( 'click', function() {      
            var imgData = canvas.toDataURL("image/jpeg", 1.0);
            var pdf = new jsPDF();
            imgData.width=300;
            imgData.height=200;
           
            pdf.addImage(imgData, 'JPEG',0 ,0);
            pdf.save("Schema.pdf");

        } );
}


function ecraner(){
  
  
  if(ecra ){
    ecra = false;
    untoggleecran();
  }
  else{
    ecra = true;
    toggleecran();
  }
  draw();

}