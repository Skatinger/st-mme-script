javascript:
/**
 * @author Skatinger W41
 */
if (top.frames.length > 1){
	var doc = (top.frames[1].document.URL.match('game.php') == 'game.php') ? top.frames[1].document : top.frames[0].document;
} else {
	var doc = document;
};
if (!doc.URL.match('mode=units')){
	UI.InfoMessage("Du muesch di ufder Truppe-Übersicht befinde.");

} else {
	eta(doc);
};

function eta(doc){
	units = Array(Array(0,'Speere'),Array(1,'Schwerter'),Array(2,'Axt'),Array(3,'Bogis'),Array(4,'Spys'),Array(5,'Leichte Kavallerie'),Array(6,'Berittener Bogi'),Array(7,'Schwere Kavallerie'),Array(8,'Ramme'),Array(9,'Katapulte'));	
	units_count = units.length;
	var troops_cells = document.getElementById('units_table').getElementsByTagName('td');
	var villages = document.getElementById('units_table').getElementsByTagName('tbody');
	
	var troops = new Array(villages.length);
	for(var p = 0; p<villages.length; p++){
		troops[p] = new Array(units_count);
	}
	//all troops in all villages to zero  [village][troops]
	for (var i = 0; i < villages.length; i++){
		for(var j = 0; j<units_count; j++){
			troops[i][j]=0;
		}
	}

	village_count = -1;
	for (var x = 0; x < troops_cells.length; x++) {
		if (troops_cells[x].firstChild.nodeValue == 'eigeni' || troops_cells[x].firstChild.nodeValue == 'uswärts') {
			if(troops_cells[x].firstChild.nodeValue == 'eigeni'){
				village_count += 1;
			}
			next = troops_cells[x].nextSibling;
			for (var y = 0; y < units_count; y++) {
				do {next = next.nextSibling;} while (next.nodeType != 1)
				troops[village_count][y] += parseInt(next.firstChild.nodeValue);
			}
		} else if (troops_cells[x].firstChild.nodeValue == 'untrwägs'){
			next = troops_cells[x].nextSibling;
			for (var y = 0; y < units_count; y++) {
				do {next = next.nextSibling;} while (next.nodeType != 1)
				troops[village_count][y] += parseInt(next.firstChild.nodeValue);
			}
		} else {/*skip*/}
	}

	//villages
	var elementsList = document.getElementById('units_table').getElementsByClassName('quickedit-label');
	//ETA of villages
	eta = new Array();

	//calc eta
	for(var i = 0; i< villages.length; i++) {
		eta.push(calc_larg_time(troops[i][2], troops[i][5], troops[i][8]));
	}

	//output generation
	if (elementsList.length > 0) {
		var output ='';
		for (var i = 0; i < elementsList.length; i++) {
			if(eta[i] < 1){
				output += "<tr><td style='color:green; font-weight: bold;'>" + elementsList[i].innerText + "</td>" + 
				"<td style='color:green; text-align:right'>" + toDDHHMM(eta[i]) + "</td></tr>";
			} else if(eta[i] < 172800){
				output += "<tr><td style='color:orange; font-weight: bold;'>" + elementsList[i].innerText + "</td>" + 
				"<td style='color:orange; text-align:right'>" + toDDHHMM(eta[i]) + "</td></tr>";
			} else {
				output += "<tr><td style='color:blue; font-weight: bold;'>" + elementsList[i].innerText + "</td>" + 
				"<td style='color:red; text-align:right'>" + toDDHHMM(eta[i]) + "</td></tr>";
			}
		}
		if ($('#ADS_Display').size()==0){
			$('.maincell').append("<div id='ADS_Display' style='position: fixed; top: 51px; left: 20px; border-radius: 8px; border: 2px #804000 solid; background-color: #F1EBDD'><div id='inline_popup_menu' style='cursor: auto; text-align:center;'>Off-Bau Übersicht: </div><div style='padding: 15px 10px 5px 10px;'><table id='ADS_Display_Main' style='vertical-align:middle;'></table><br><a onclick='$(\"#ADS_Display\").remove();' style='cursor: pointer;'>Schliessen</a></div></div>");
		} else {
			$("#ADS_Display").show();
		}
		$("#ADS_Display_Main").html(output);
	} else {
		UI.InfoMessage('Fehler! Keine Dörfer/Truppen gefunden!',3000,true);
	}
};

//calc longest duration in seconds
function calc_larg_time(axt_count, lk_count, rams_count){
	axt_eta = calc_time('axt', axt_count);
	lk_eta = calc_time('lk', lk_count);
	rams_eta = calc_time('rams', rams_count);
	max = Math.max(axt_eta, lk_eta, rams_eta);
	if(max < 0) max = 0;
	return max;//in seconds
}

function calc_time(typ, anzahl){
	/*
	///////////////////////////////////////////////////////////////////////////////////////*

	Hier kannst du die Zahlen durch die maximale Grösse deiner Standard off ersetzen.

	/////////////////////////////////////////////////////////////////////////////////////
	*/
	max_axt = 5950;
	max_lk = 2510;
	max_rams = 289;

	/*
	///////////////////////////////////////////////////////////////////////////////////////*

	Hier kannst du die Zahlen durch die Anzahl sekunden ersetzen die eine Einheit zum Bau benötigt.
	1. ist axt, 2. ist rams und 3. ist lk. Die Zeit muss in sekunden angegeben werden.

	/////////////////////////////////////////////////////////////////////////////////////
	*/
	if(typ == 'axt'){
		return (max_axt - anzahl) * 205; //ausbauzeit/axt bei kaserne 25: 205s ohne effekte
	} else if (typ == 'rams'){
		return (max_rams - anzahl) * 2415; //ausbauzeit/rams bei werkstatt xy: 2415s ohne effekte
	} else {
		return (max_lk - anzahl) * 346; //ausbauzeit/lk bei stall 20: 346sek ohne effekte
	}
	UI.InfoMessage('Ups. Irgendwas hat nicht geklappt.');
	return null;
}

//construct useful format
function toDDHHMM(seconds) {
	var seconds = parseInt(seconds, 10);
	var days = Math.floor(seconds / (3600*24));
	seconds  -= days*3600*24;
	var hours   = Math.floor(seconds / 3600);
	seconds  -= hours*3600;
	var minutes = Math.floor(seconds / 60);
	seconds  -= minutes*60;
	if (days < 10) {days = "0"+days;}
	if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    //if (seconds < 10) {seconds = "0"+seconds;}
	return days+' d '+hours+'h '+minutes+'mins';
}
