// GLOBAL

var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
var rankingValue = ["NC", "E6", "E4", "E2", "E0", "D6", "D4", "D2", "D0", "C6", "C4", "C2", "C0", "B6", "B4", "B2", "B0", "A"];

var Divs = [];
var AdvDB = {};
var Calendrier = [];
var NumTeam = 0;

var PlayersByWeek = [];
var HomeWeek = [];
var AwayWeek = [];

// Function


function FistInit() {
    importCalendrier();
    
}

function Init() {
    // List Of Divisions
    for (var int = 0; int < Divs.length; int++) {
        var option = document.createElement("option");
        option.text = Divs[int];
        option.value = "Team" + letters[int];
        document.getElementById("SelectTeam").add(option);

        var select = document.createElement("select");
        select.id = "Team" + letters[int];
        select.style = "display: none;";
        document.getElementById("SelectAdv").appendChild(select)

    }


    // List Adversaire
    var numTeam = document.getElementById("SelectTeam").length;

    for (var int = 0; int < numTeam; int++) {
        var s = letters[int];

        for (var k = 0; k < AdvDB[s].length; k++) {
            if (AdvDB[s][k].team != "BYE") {
                var a = AdvDB[s][k].club + " - " + AdvDB[s][k].team;
                var option = document.createElement("option");
                var week = (parseInt(k) + 1)
                option.text = "J" + week + " : " + AdvDB[s][k].team;
                option.value = a;
                document.getElementById("Team" + s).add(option);
            } else {
                var option = document.createElement("option");
                var week = (parseInt(k) + 1)
                option.text = "J" + week + " : BYE";
                option.value = null;
                option.disabled = true;
                document.getElementById("Team" + s).add(option);
            }

        }
    }
    document.getElementById("TeamA").style = "";


    //LocalStorage
    var check = localStorage.getItem('_Storage_MaxAverage');
    if (check != null) {
        if (check == "true") {
            document.getElementById("MaxAverage").checked = true;
            changeMaxAverage(true);
        }

    }
    var value = localStorage.getItem('_Storage_SelectAffichage');
    if (value != null) {
        var st = document.getElementById("SelectAffichage");
        for (var i = 0; i < st.options.length; i++) {
            if (st.options[i].value == value) {
                st.selectedIndex = i;
            }
        }
        changeAffichage(value);
    }
    var value = localStorage.getItem('_Storage_SelectTeam');
    if (value != null) {
        var st = document.getElementById("SelectTeam");
        for (var i = 0; i < st.options.length; i++) {
            if (st.options[i].value == value) {
                st.selectedIndex = i;
            }
        }
        changeTeam();
    }

	hideLoader();
};

function importCalendrier() {
    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tab="http://api.frenoy.net/TabTAPI">'
            +   '<soapenv:Header/>'
            +   '<soapenv:Body>'
            +       '<tab:GetMatchesRequest>'
            +           '<tab:Club>N115</tab:Club>'
            +       '</tab:GetMatchesRequest>'
            +   '</soapenv:Body>'
            + '</soapenv:Envelope>'


    soap(xml, setCalendrier, importADVDB);
}

function importADVDB() {
	var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tab="http://api.frenoy.net/TabTAPI">'
            +   '<soapenv:Header/>'
            +   '<soapenv:Body>'
            +      '<tab:GetClubTeamsRequest>'
            +          '<tab:Club>N115</tab:Club>'
            +      '</tab:GetClubTeamsRequest>'
            +   '</soapenv:Body>'
            +'</soapenv:Envelope>';


    soap(xml, setADVDB, Init);
    //alert(resp);
};



//Function HTML Dynamic
function changeTeam() {
    var newIndex = document.getElementById("SelectTeam").selectedIndex;
    var oldIndex = document.getElementById("SelectTeam").className;

    localStorage.setItem("_Storage_SelectTeam", document.getElementById("SelectTeam").value)

    document.getElementById("SelectTeam").className = newIndex;

    document.getElementById("SelectAdv").childNodes[oldIndex].style = "display: none;";
    document.getElementById("SelectAdv").childNodes[newIndex].style = "";
}

function changeAffichage(value) {
    value = value || document.getElementById("SelectAffichage").value;
    localStorage.setItem("_Storage_SelectAffichage", value);

    var bool = document.getElementById("MaxAverage").checked;

    switch (value) {
        case "Separed":
            affichageSepare();
            displayMaxAverage(bool, bool, bool)
            break;
        case "Full":
            affichageComplet();
            displayMaxAverage(bool, bool, bool)
            break;
        case "1T":
            affichage1T()
            displayMaxAverage(bool, bool, bool)
            break;
        case "2T":
            affichage2T();
            displayMaxAverage(bool, bool, bool)
            break;
        case "Played":
            affichagePlayed();
            displayMaxAverage(bool, bool, bool)
            break;
        case "Home":
            affichageHome();
            displayMaxAverage(false, bool, false)
            break;
        case "Away":
            affichageAway();
            displayMaxAverage(false, false, bool)
            break;
    }

}

function valider() {
    activateLoader()
    clearAllData();

    var divIndex = document.getElementById("SelectTeam").selectedIndex;
    var adv = document.getElementById("SelectAdv").childNodes[divIndex].value.split(" - ");
    var adv = { club: adv[0], team: adv[1] }
    var letter = adv.team[adv.team.length - 1];

    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tab="http://api.frenoy.net/TabTAPI">'
            +   '<soapenv:Header/>'
            +   '<soapenv:Body>'
            +       '<tab:GetMatchesRequest>'
            +           '<tab:Club>' + adv.club + '</tab:Club>'
            +           '<tab:Team>' + letter + '</tab:Team>'
    	    +		    '<tab:DivisionCategory>37</tab:DivisionCategory>'
            +           '<tab:WithDetails>Yes</tab:WithDetails>'
            +       '</tab:GetMatchesRequest>'
            +   '</soapenv:Body>'
            + '</soapenv:Envelope>'


    soap(xml, setData, hideLoader);
}

function activateLoader() {
    document.getElementById("validationButton").disabled = true;
    document.getElementById("loader").className = "loader loader-default is-active";
}

function hideLoader() {
    document.getElementById("validationButton").disabled = false;
    document.getElementById("loader").className = "loader loader-default";
    changeAffichage();
}


//Function Utils

function soap(strRequest, callback, _afterCallback) {
    var xmlhttp = new XMLHttpRequest();

    //replace second argument with the path to your Secret Server webservices
    xmlhttp.open('POST', "https://api.vttl.be/0.7/index.php?s=vttl", true);


    //specify request headers
    xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
    //xmlhttp.setRequestHeader('SOAPAction', '"urn:thesecretserver.com/Authenticate"';);

    //FOR TESTING: display results in an alert box once the response is received
    xmlhttp.onreadystatechange = function () {
        //alert(xmlhttp.readyState);
        if (xmlhttp.readyState == 4) {
            //alert(xmlhttp.responseText);
            callback(xmlhttp.responseText, _afterCallback);
        }
    };

    //send the SOAP request
    xmlhttp.send(strRequest);
};

function clearAllData() {
    clearDataByClassName("HomeTeam");
    clearDataByClassName("AwayTeam");
    clearDataByClassName("HomeScore");
    clearDataByClassName("AwayScore");
    clearDataByClassName("PlayerName");
    clearDataByClassName("PlayerRanking");
    clearDataByClassName("VictoryCount");
	
    PlayersByWeek = [];
    HomeWeek = [];
    AwayWeek = [];
}

function clearDataByClassName(name) {
    var coll = document.getElementsByClassName(name);
    for (var i = 0; i < coll.length; i++) {
        coll[i].innerHTML = "";
        if (name == "AwayTeam") {
            coll[i].className = "AwayTeam";
        } else if (name == "HomeTeam") {
            coll[i].className = "HomeTeam";
        }
    }
}


// Callback Function

function setCalendrier(resp, callback) {
    Calendrier = [];
    for (var i = 1; i <= 22; i++) { Calendrier[(i)] = {} }

    var oParser = new DOMParser();
    var oDOM = oParser.parseFromString(resp, "application/xml");

    var matches = oDOM.firstElementChild.firstElementChild.firstElementChild.children;
    var nameSpace = matches[0].namespaceURI;

    var LastTeamLetter = "";
    var NumberOfTeam = 0;

    for (i = 1; i < matches.length; i++) {

        var week = null;
        var MatchId = null;
        var HomeClub = null;
        var HomeTeam = null;
        var AwayClub = null;
        var AwayTeam = null;
        var IsHomeForfeited = null;
        var IsAwayForfeited = null;

        var Date = "";
        var Time = "";
        var _Date = "";
        var _Time = "";

        for (var _i = 0; _i < matches[i].children.length; _i++) {
            switch (matches[i].children[_i].localName) {
                case "WeekName":
                    week = matches[i].children[_i].innerHTML;
                    if (week[0] == 0) { week = week.substr(1) }
                    week = parseInt(week);
                    break;
                case "MatchId":
                    MatchId = matches[i].children[_i].innerHTML;
                    break;
                case "HomeClub":
                    HomeClub = matches[i].children[_i].innerHTML;
                    break;
                case "HomeTeam":
                    HomeTeam = matches[i].children[_i].innerHTML;
                    break;
                case "AwayClub":
                    AwayClub = matches[i].children[_i].innerHTML;
                    break;
                case "AwayTeam":
                    AwayTeam = matches[i].children[_i].innerHTML;
                    break;
                case "IsHomeForfeited":
                    IsHomeForfeited = matches[i].children[_i].innerHTML;
                    break;
                case "IsAwayForfeited":
                    IsAwayForfeited = matches[i].children[_i].innerHTML;
                    break;
                case "Date":
                    _Date = matches[i].children[_i].innerHTML;
                    break;
                case "Time":
                    _Time = matches[i].children[_i].innerHTML;
                    break;
            }
        }

        if (AwayClub != "-" && HomeClub != "-") {
            Date = _Date;
            Time = _Time.substring(0, _Time.length - 3);
        } else if (AwayClub == "-") { AwayTeam = "BYE" }
        else if (HomeClub == "-") { HomeTeam = "BYE" }


        var isHome = (HomeClub == "N115");

        var TeamLetter;
        if (isHome) {
            TeamLetter = HomeTeam[HomeTeam.length - 1];
        } else {
            TeamLetter = AwayTeam[AwayTeam.length - 1];
        }
        if (TeamLetter != LastTeamLetter) {
            NumberOfTeam++;
            LastTeamLetter = TeamLetter;
        }


        Calendrier[week][TeamLetter] = {};

        Calendrier[week][TeamLetter]["MatchId"] = MatchId;
        Calendrier[week][TeamLetter]["Date"] = Date;
        Calendrier[week][TeamLetter]["Time"] = Time;
        Calendrier[week][TeamLetter]["HomeClub"] = HomeClub;
        Calendrier[week][TeamLetter]["HomeTeam"] = HomeTeam;
        Calendrier[week][TeamLetter]["AwayClub"] = AwayClub;
        Calendrier[week][TeamLetter]["AwayTeam"] = AwayTeam;
        Calendrier[week][TeamLetter]["isHome"] = isHome;
        Calendrier[week][TeamLetter]["IsHomeForfeited"] = IsHomeForfeited;
        Calendrier[week][TeamLetter]["IsAwayForfeited"] = IsAwayForfeited;

    }

    NumTeam = NumberOfTeam;
    callback()
}

function setADVDB(resp, callback) {
	var oParser = new DOMParser();
    var oDOM = oParser.parseFromString(resp, "application/xml");

    var Teams = [];
	
	var xmlTeams = oDOM.firstElementChild.firstElementChild.firstElementChild.children;
  	var nameSpace = xmlTeams[0].namespaceURI;
	//alert(xmlTeams);

	var name = xmlTeams[0].innerHTML;

  
    for (var i = 2; i < xmlTeams.length; i++){
        var letter = "";
    	var div = "";

        for (var _i = 0; _i < xmlTeams[i].children.length; _i++) {
            switch (xmlTeams[i].children[_i].localName) {
                case "Team":
                    letter = xmlTeams[i].children[_i].innerHTML;
                    break;
                case "DivisionName":
                    div = xmlTeams[i].children[_i].innerHTML.split(" ")[1];
                    break;
            }
        }
    
    	AdvDB[letter] = []; 
    	Teams.push(div + "  -  " + name + " " + letter);
    }

    for(var i = 1; i < (Calendrier.length+1)/2; i++){   
	    for(var j = 0; j < NumTeam; j++){
	      var adv = {club: "", team: ""};
	      var teamLetters = letters[j];
	      if(Calendrier[i][teamLetters].isHome){
	        adv.club = Calendrier[i][teamLetters].AwayClub ;
	        adv.team = Calendrier[i][teamLetters].AwayTeam ;
	      } else {
	        adv.club = Calendrier[i][teamLetters].HomeClub;
	        adv.team = Calendrier[i][teamLetters].HomeTeam;
	      }
	      
	      //if(adv.team != "BYE"){
	        AdvDB[teamLetters].push(adv);
	      //}
	      
	    }
	}
    Divs = Teams;
    //alert("end Import");
    callback();
	
	};

function setData(resp, callback) {
    //alert("Start Data Parsing");
    var oParser = new DOMParser();
    var oDOM = oParser.parseFromString(resp, "application/xml");

    var divIndex = document.getElementById("SelectTeam").selectedIndex;
    var adv = document.getElementById("SelectAdv").childNodes[divIndex].value.split(" - ");
    var adv = { club: adv[0], team: adv[1] }
    var letter = adv.team[adv.team.length - 1];

    var matches = oDOM.firstElementChild.firstElementChild.firstElementChild.children;
    var nameSpace = matches[0].namespaceURI;

    for (i = 1; i < matches.length; i++) {

        var week = null;
        var MatchId = null;
        var HomeClub = null;
        var HomeTeam = null;
        var AwayClub = null;
        var AwayTeam = null;
        var IsHomeForfeited = null;
        var IsAwayForfeited = null;
        var Score = ["", ""];
        var details = null;


        for (var _i = 0; _i < matches[i].children.length; _i++) {
            switch (matches[i].children[_i].localName) {
                case "WeekName":
                    week = matches[i].children[_i].innerHTML;
                    if (week[0] == 0) { week = week.substr(1) }
                    week = parseInt(week);
                    break;
                case "MatchId":
                    MatchId = matches[i].children[_i].innerHTML;
                    break;
                case "HomeClub":
                    HomeClub = matches[i].children[_i].innerHTML;
                    break;
                case "HomeTeam":
                    HomeTeam = matches[i].children[_i].innerHTML;
		    //HomeTeam = HomeTeam.replace("Palette", "Pal.");
                    break;
                case "AwayClub":
                    AwayClub = matches[i].children[_i].innerHTML;
                    break;
                case "AwayTeam":
                    AwayTeam = matches[i].children[_i].innerHTML;
		    //AwayTeam = AwayTeam.replace("Palette", "Pal.");
                    break;
                case "IsHomeForfeited":
                    IsHomeForfeited = matches[i].children[_i].innerHTML;
                    break;
                case "IsAwayForfeited":
                    IsAwayForfeited = matches[i].children[_i].innerHTML;
                    break;
                case "Score":
                    Score = matches[i].children[_i].innerHTML.split("-");
                    break;
                case "MatchDetails":
                    details = matches[i].children[_i];
                    break;
            }
        }

        if (HomeClub == "-") { HomeTeam = "BYE" };
        if (AwayClub == "-") { AwayTeam = "BYE" };

        if (IsHomeForfeited == "true") {
            Score = ["FF", "16"];
        } else if (IsAwayForfeited == "true") {
            Score = ["16", "FF"];
        }

        document.getElementById("J" + week).getElementsByClassName("HomeTeam")[0].innerHTML = HomeTeam;
        document.getElementById("J" + week).getElementsByClassName("AwayTeam")[0].innerHTML = AwayTeam;
        document.getElementById("J" + week).getElementsByClassName("HomeScore")[0].innerHTML = Score[0];
        document.getElementById("J" + week).getElementsByClassName("AwayScore")[0].innerHTML = Score[1];

        var isHome = (HomeTeam == adv.team);
        if (isHome) {
            document.getElementById("J" + week).getElementsByClassName("HomeTeam")[0].classList.add("myTeam");
            document.getElementById("J" + week).className = "isHome";
            
        } else {
            document.getElementById("J" + week).getElementsByClassName("AwayTeam")[0].classList.add("myTeam");
            document.getElementById("J" + week).className = "isAway";
            
        }

        if (details.children[0].innerHTML == "true") {
            if (isHome) {
                HomeWeek.push(week);
            } else {
                AwayWeek.push(week);
            }

            //alert("Details OK");
            var detailedTeam = null;

            for (var j = 0; j < details.children.length; j++) {
                if (isHome && details.children[j].localName == "HomePlayers") {
                    detailedTeam = details.children[j].children;
                } else if ( (!isHome) && details.children[j].localName == "AwayPlayers") {
                    detailedTeam = details.children[j].children;
                }
            }      

            //Save Data for Max/Average
            PlayersByWeek[week] = [];

            for (var k = 0; k < detailedTeam.length; k++) {
                if (detailedTeam[k].localName == "Players") {
                    var Player = { position: 0,id: 0, firstName: "", lastName: "", ranking: "", victoryCount: "", IsForfeited: false };

                    for (var l = 0; l < detailedTeam[k].children.length; l++) {
                        switch (detailedTeam[k].children[l].localName) {
                            case "Position":
                                Player.position = parseInt( detailedTeam[k].children[l].innerHTML );
                                break;
                            case "FirstName":
                                Player.firstName = detailedTeam[k].children[l].innerHTML;
                                break;
                            case "LastName":
                                Player.lastName = detailedTeam[k].children[l].innerHTML;
                                break;
                            case "Ranking":
                                Player.ranking = detailedTeam[k].children[l].innerHTML;
                                if (Player.ranking == "NG") {
                                    Player.ranking = "NC";
                                }
                                break;
                            case "VictoryCount":
                                Player.victoryCount = parseInt( detailedTeam[k].children[l].innerHTML );
                                break;
                            case "IsForfeited":
                                Player.IsForfeited = detailedTeam[k].children[l].innerHTML == "true";
                                break;
                            case "UniqueIndex":
                                Player.UniqueIndex = parseInt(detailedTeam[k].children[l].innerHTML);
                                break;
                        }
                    }

                    //Save Data for Max/Average
                    PlayersByWeek[week][Player.position] = Player;

                    //Affichage Data
                    if (Player.position > 0 && Player.position < 5) {
                        document.getElementById("J" + week).getElementsByClassName("Player" + Player.position)[0].getElementsByClassName("PlayerName")[0].innerHTML = Player.lastName + " " + Player.firstName;
                        document.getElementById("J" + week).getElementsByClassName("Player" + Player.position)[0].getElementsByClassName("PlayerRanking")[0].innerHTML = Player.ranking;
                        if (Player.IsForfeited) {
                            document.getElementById("J" + week).getElementsByClassName("Player" + Player.position)[0].getElementsByClassName("VictoryCount")[0].innerHTML = "WO";
                        } else {
                            document.getElementById("J" + week).getElementsByClassName("Player" + Player.position)[0].getElementsByClassName("VictoryCount")[0].innerHTML = Player.victoryCount;
                        }
                    }

                }
            }

        }
    }
    var weekPlayed = [];
    for (var i = 1; i < PlayersByWeek.length; i++) {
    	if (PlayersByWeek[i] != undefined) {weekPlayed.push(i)}    
    }
    setMaxAverage(weekPlayed, "Max", "Average");
    setMaxAverage(HomeWeek, "MaxHome", "AverageHome");
    setMaxAverage(AwayWeek, "MaxAway", "AverageAway");
	callback();

}

function setMaxAverage(weekToCheck, MaxId, AverageId) {
    
    var result = getMaxAverage(weekToCheck);
    //Max
    for (var i = 0; i < result.BestTeam.length; i++) {
        var p = result.BestTeam[i];
        var el = document.getElementById(MaxId).getElementsByClassName("Player" + p.position)[0];
        el.children[1].innerText = p.lastName + " " + p.firstName;
        el.children[2].innerText = p.ranking;
    }
    //Average
    var ranks = [];
    for (var i = 1; i < result.AverageP.length; i++) {
        var t = 0;
        for (var j = 0; j < result.AverageP[i].length; j++) {
            t += result.AverageP[i][j];
        }
        t = t / (result.AverageP[i].length);
        t = Math.round(t);
        ranks.push(rankingValue[t]);
    }
    // Player who played all matchs
    var allM = [];
    for (var i = 0; i < result.PlayerMatchCount.length; i++) {
        if (result.PlayerMatchCount[i] == weekToCheck.length) {
            allM.push(result.PlayerInTeam[i]);
        }
    }
    //Write in HTML
    for (var i = 0; i < ranks.length; i++) {
        var p = {firstName: " ?????", lastName: "????? ", ranking: ranks[i]};
        for (var j = 0; j < allM.length; j++) {
            if (allM[j] != null && allM[j].ranking == ranks[i]) {
                p = allM[j];
                allM[j] = null;
                j = allM.length + 7777; // Exit FOR
            }
        }
        var el = document.getElementById(AverageId).getElementsByClassName("Player" + (i+1))[0];
        el.children[1].innerText = p.lastName + " " + p.firstName;
        el.children[2].innerText = p.ranking;
    }
    return;
}


function getMaxAverage(weekToCheck) {
    var BestTeam = [];
    var BestTeamForce = 0;

    var AverageP = [null, [], [], [], []];

    var MatchPlayed = weekToCheck.length - 1;
    var PlayerInTeamId = []
    var PlayerInTeam = []
    var PlayerMatchCount = [];

    for (var i = 0; i < weekToCheck.length; i++) {  // every week
        var week = weekToCheck[i];
        var team = [];
        var teamForce = 0;
        if (PlayersByWeek[week] != undefined) {
	        for (var j = 1; j < PlayersByWeek[week].length; j++) { //every Player
	            var p = PlayersByWeek[week][j];

	            AverageP[p.position].push(rankingValue.indexOf(p.ranking));
	            var index = PlayerInTeamId.indexOf(p.UniqueIndex);
	            if (index == -1) {
	                PlayerInTeamId.push(p.UniqueIndex);
	                PlayerInTeam.push(p);
	                PlayerMatchCount.push(1);
	            } else {
	                PlayerMatchCount[index] += 1;
	            }

	            team.push(p);
	            teamForce += rankingValue.indexOf(p.ranking);
	        }
	    }
        if (teamForce >= BestTeamForce) {
            BestTeam = team;
            BestTeamForce = teamForce;
        }

    }

    return { "BestTeam": BestTeam, "AverageP": AverageP, "PlayerInTeam": PlayerInTeam, "PlayerMatchCount": PlayerMatchCount };
}


//Function Affichage

function affichageSepare() {
    document.getElementById("Titre1T").style.display = "block";
    document.getElementById("Titre2T").style.display = "block";
    var l = Calendrier.length - 1;
    for (var i = 1; i <= l; i++) {
        document.getElementById("J" + i).style.display = "block";
    }
}

function affichageComplet() {
    document.getElementById("Titre1T").style.display = "none";
    document.getElementById("Titre2T").style.display = "none";
    var l = Calendrier.length - 1;
    for (var i = 1; i <= l; i++) {
        document.getElementById("J" + i).style.display = "block";
    }

}

function affichage1T() {
    document.getElementById("Titre1T").style.display = "block";
    document.getElementById("Titre2T").style.display = "none";
    var l = Calendrier.length -1;
    for (var i = 1; i <= l ; i++) {
        if (i <= l/2) {
            document.getElementById("J" + i).style.display = "block";
        } else {
            document.getElementById("J" + i).style.display = "none";
        }
        
    }

}

function affichage2T() {
    document.getElementById("Titre1T").style.display = "none";
    document.getElementById("Titre2T").style.display = "block";
    var l = Calendrier.length - 1;
    for (var i = 1; i <= l; i++) {
        if (i <= l / 2) {
            document.getElementById("J" + i).style.display = "none";
        } else {
            document.getElementById("J" + i).style.display = "block";
        }

    }
}

function affichagePlayed() {
    document.getElementById("Titre1T").style.display = "none";
    document.getElementById("Titre2T").style.display = "none";
    var l = Calendrier.length - 1;
    for (var i = 1; i <= l; i++) {
        var HS = document.getElementById('J' + i).getElementsByClassName("HomeScore")[0].innerHTML;
        var AS = document.getElementById('J' + i).getElementsByClassName("AwayScore")[0].innerHTML;
        if (HS == "" && AS == "") {
            document.getElementById("J" + i).style.display = "none";
        } else {
            document.getElementById("J" + i).style.display = "block";
        }
    }
}

function affichageAway() {
    document.getElementById("Titre1T").style.display = "none";
    document.getElementById("Titre2T").style.display = "none";
    var l = Calendrier.length - 1;
    for (var i = 1; i <= l; i++) {
        var cn = document.getElementById('J' + i).className;
        if (cn == "isAway") {
            document.getElementById("J" + i).style.display = "block";
        } else {
            document.getElementById("J" + i).style.display = "none";
        }
    }
}

function affichageHome() {
    document.getElementById("Titre1T").style.display = "none";
    document.getElementById("Titre2T").style.display = "none";
    var l = Calendrier.length - 1;
    for (var i = 1; i <= l; i++) {
        var cn = document.getElementById('J' + i).className;
        if (cn == "isHome") {
            document.getElementById("J" + i).style.display = "block";
        } else {
            document.getElementById("J" + i).style.display = "none";
        }
    }

}

function changeMaxAverage(check) {
    localStorage.setItem("_Storage_MaxAverage", check);
    changeAffichage();
}

function displayMaxAverage(all,home,away) {
    if (all) {
        document.getElementById("Max").className = "MaxAverage";
        document.getElementById("Average").className = "MaxAverage";
    } else {
        document.getElementById("Max").className = "MaxAverage displayNone";
        document.getElementById("Average").className = "MaxAverage displayNone";
    }
    if (home) {
        document.getElementById("MaxHome").className = "MaxAverage";
        document.getElementById("AverageHome").className = "MaxAverage";
    } else {
        document.getElementById("MaxHome").className = "MaxAverage displayNone";
        document.getElementById("AverageHome").className = "MaxAverage displayNone";
    }
    if (away) {
        document.getElementById("MaxAway").className = "MaxAverage";
        document.getElementById("AverageAway").className = "MaxAverage";
    } else {
        document.getElementById("MaxAway").className = "MaxAverage displayNone";
        document.getElementById("AverageAway").className = "MaxAverage displayNone";
    }
}
