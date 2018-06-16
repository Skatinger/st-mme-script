
javascript:

/* init document */
if (top.frames.length > 1){
	var doc = (top.frames[1].document.URL.match('game.php') == 'game.php') ? top.frames[1].document : top.frames[0].document;
} else {
	var doc = document;
};

/* correct overview ?*/
if (!doc.URL.match('mode=units')){
	UI.InfoMessage('Du musst dich auf der "Truppen"-Ãœbersicht befinden!',3000,true);
} else {
	ETA(doc);
};





/* Welt mit Bogenschützen; zu oBogen ändern wenn ohne Bogenschützen */
var world = mBogen;
function ETA(doc){
	if (typeof(world) == 'undefined') {
		units = Array(Array(0,'Speere'),Array(1,'Schwerter'),Array(2,'Axt'),Array(3,'Bogis'),Array(4,'Spys'),Array(5,'Leichte Kavallerie'),Array(6,'Berittener Bogi'),Array(7,'Schwere Kavallerie'),Array(8,'Ramme'),Array(9,'Katapulte'));	
	} else {	
		if (world == 'oBogen') {
			units = Array(Array(0,'Speere'),Array(1,'Schwerter'),Array(2,'Axt'),Array(3,'Spys'),Array(4,'Leichte Kavallerie'),Array(5,'Schwere Kavallerie'),Array(6,'Ramme'),Array(7,'Katapulte'));		
		} else if (world == 'mBogen') {
			units = Array(Array(0,'Speere'),Array(1,'Schwerter'),Array(2,'Axt'),Array(3,'Bogis'),Array(4,'Spys'),Array(5,'Leichte Kavallerie'),Array(6,'Berittener Bogi'),Array(7,'Schwere Kavallerie'),Array(8,'Ramme'),Array(9,'Katapulte'));	
		}
	}

	units_count = units.length;
	troops = new Array(units_count);
	//init array troops
	for (var i = 0; i < units_count; i++)
		troops[i]=0;
	village_count = 0;

	//dörfer = new Array(document.getElementById('units_table')).getElementsByTagName('td');


	var troops_cells = document.getElementById('units_table').getElementsByTagName('a');

	for (var x = 0; x < troops_cells.length; x++) {	
		if (typeof(art) == 'undefined') {
			art = "Gesamt";
			if (troops_cells[x].firstChild.nodeValue == 'eigeni' || troops_cells[x].firstChild.nodeValue == 'uswärts'  || troops_cells[x].firstChild.nodeValue == 'untrwägs') {
				village_count += 1;
				next = troops_cells[x].nextSibling;
				for (var y = 0; y < units_count; y++) {
					do {next = next.nextSibling;} while (next.nodeType != 1)
					troops[y] += parseInt(next.firstChild.nodeValue);
				}
			}
		} else {	
			if (art == 'im Dorf') {
				if (troops_cells[x].firstChild.nodeValue == 'eigeni') {
					village_count += 1;
					next = troops_cells[x].nextSibling;
					for (var y = 0; y < units_count; y++) {
						do {next = next.nextSibling;} while (next.nodeType != 1)
						troops[y] += parseInt(next.firstChild.nodeValue);
					}
				}
			} else if (art == 'Uswärts') {
				if (troops_cells[x].firstChild.nodeValue == 'uswärts'  || troops_cells[x].firstChild.nodeValue == 'untrwägs') {
					village_count += 1;
					next = troops_cells[x].nextSibling;
					for (var y = 0; y < units_count; y++) {
						do {next = next.nextSibling;} while (next.nodeType != 1)
						troops[y] += parseInt(next.firstChild.nodeValue);
					}
				}
			} else if (art == 'Gesamt') {
				if (troops_cells[x].firstChild.nodeValue == 'eigeni' || troops_cells[x].firstChild.nodeValue == 'uswärts'  || troops_cells[x].firstChild.nodeValue == 'untrwägs') {
					village_count += 1;
					next = troops_cells[x].nextSibling;
					for (var y = 0; y < units_count; y++) {
						do {next = next.nextSibling;} while (next.nodeType != 1)
						troops[y] += parseInt(next.firstChild.nodeValue);
					}
				}	
			}
		}
	}



	if (village_count > 0) {
		var output ='';
		for (var i = 0; i < units_count; i++) {
			output += "<tr><td style='color:blue; font-weight: bold;'>" + units[i][1] + "</td><td style='color:red; text-align:right'>" + troops[i] + "</td></tr>";
		}
		if ($('#ADS_Display').size()==0){
			$('.maincell').append("<div id='ADS_Display' style='position: fixed; top: 51px; left: 20px; border-radius: 8px; border: 2px #804000 solid; background-color: #F1EBDD'><div id='inline_popup_menu' style='cursor: auto; text-align:center;'>Truppenübersicht: "+ art +"</div><div style='padding: 15px 10px 5px 10px;'><table id='ADS_Display_Main' style='vertical-align:middle;'></table><br><a onclick='$(\"#ADS_Display\").remove();' style='cursor: pointer;'>Ficken ist Geil</a></div></div>");
		} else {
			$("#ADS_Display").show();
		}
		$("#ADS_Display_Main").html(output);
	} else {
		UI.InfoMessage('Fehler! Keine Dörfer/Truppen gefunden!',3000,true);
	} 
};

/*
function calc_larg_time(axt_count, lk_count, rams_count){
	axt_eta = calc_time('axt', axt_count);
	lk_eta = calc_time('lk', lk_count);
	rams_eta = calc_time('rams', rams_count);
	return Math.max(axt_eta, lk_eta, rams_eta);
}

// berittene bogis sind nicht einbezogen
function calc_time(typ, anzahl){
	if(typ == 'axt'){
		return anzahl * 206; //ausbauzeit/axt bei kaserne 25: 206sek
	} else if (typ 'rams'){
		return anzahl * 1336; //ausbauzeit/rams bei werkstatt xy: 1336sek
	} else {
		return anzahl * 375; //ausbauzeit/lk bei stall 20: 375sek
	}
	UI.InfoMessage('Ups. Irgendwas hat nicht geklappt.');
	return null;
}*/





var troops_cells = document.getElementById('units_table').getElementsByTagName('td');

for (var x = 0; x < troops_cells.length; x++) {
	if (troops_cells[x].firstChild.nodeValue == 'eigeni' || troops_cells[x].firstChild.nodeValue == 'uswärts'  || troops_cells[x].firstChild.nodeValue == 'untrwägs') {
		console.log("begin new entry");
		village_count += 1;
		village_count = Math.floor((village_count + 1) / 3);
		next = troops_cells[x].nextSibling;
		for (var y = 0; y < units_count; y++) {
			do {next = next.nextSibling;} while (next.nodeType != 1)
			troops[0, y] += parseInt(next.firstChild.nodeValue);
			console.log("this is unit nb " + y + ", adding " + next.firstChild.nodeValue);
		}
	}
}