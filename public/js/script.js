var daysEN = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
var daysPL = ['Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela']

$(function() {
    $.getJSON( "settings.txt", {} )
    .done(function( json ) {
        $('#brightness>[type="range"]').val(json.brightness);
        $("#brightness>p").text((json.brightness/255*100).toFixed(0)+"%");
    })
});

var i=0;
var consumptionData=[];
var consumptionLabels=[];

function loop() {
    var todayIndex = daysEN.findIndex(function(day){return day==$.format.date(new Date(), "E")});
    $("#dateFormat>p:nth-child(1)").text(daysPL[todayIndex]);
    $("#dateFormat>p:nth-child(2)").text($.format.date(new Date(), "HH:mm"));
    $("#dateFormat>p:nth-child(3)").text($.format.date(new Date(), "dd.MM.yyyy"));

    $.getJSON( "diagnostics.txt", {} )
    .done(function( json ) {
        $("#startTime p").text("Od "+$.format.date(json.startTime, "HH:mm"));
        $("#sinceStart p:first").text($.format.date(new Date() - new Date(json.startTime) - 3600000, "HH:mm"));
        $("#distance p:first").text(Math.round((json.distTraveled)/1000));
        $("#fuel p:first").text(parseFloat(json.fuelConsumpt).toFixed(1));
        $("#averageCons p:nth-child(3)").text((json.averageCons).toFixed(1)+" L/100km");
        $("#averageSpeed p:nth-child(3)").text((json.averageSpeed).toFixed(0)+" km/h");
        $("#averageRPM p:nth-child(3)").text(parseFloat(json.averageRPM/1000).toFixed(1)+" tyś obr/min");
        $("#coolant p:nth-child(3)").text(json.coolantTemp+"°C");
        $("#consumption p:nth-child(3)").text(parseFloat(json.consumption).toFixed(1)+" L/100km");
        $("#engineLoad p:nth-child(3)").text(parseFloat(json.engineLoad).toFixed(1)+"%");
        $("#temperature p:nth-child(3)").text(parseFloat(json.temperature).toFixed(0)+"°C");
        $("#humidity p:nth-child(3)").text(parseFloat(json.humidity).toFixed(0)+"%");
        $("#speed").text((json.speed).toFixed(0));
        $("#acceleration").text((json.acceleration).toFixed(1)+" g");
        consumptionData.push((json.consumption).toFixed(1));
    })

    $.getJSON( "settings.txt", {} )
    .done(function( json ) {
        data2.datasets[0].data=[((json.space-json.freeSpace)/json.space*100).toFixed(0), (json.freeSpace/json.space*100).toFixed(0)];
        $(".blue").text(json.freeSpace+" GB");
        $(".gray").text(json.space-json.freeSpace+" GB");
        $("#spacePercent").text((json.freeSpace/json.space*100).toFixed(0)+"%");
    })
    myDoughnutChart.update();

    consumptionLabels.push($.format.date(new Date(), "HH:mm:ss"));
    if(i>=60) {
        consumptionData.shift();
        consumptionLabels.shift();
    }
    data.datasets[0].data=consumptionData;
    data.labels=consumptionLabels;
    myChart.update();
    i++;
}

var interval = self.setInterval(function(){loop()},1000);

var old="main";
var oldImage="speed"

function activate(wat, image) {
    $("#"+old).removeClass('active');
    $("#"+old+">.container>img").attr('src','/images/'+oldImage+'.svg');
    $("#"+old+"Grid").css("display","none");
    $("#"+wat).addClass('active');
    $("#"+wat+">.container>img").attr('src','/images/'+image+'Active.svg');
    $("#"+wat+"Grid").css("display","grid");
    old=wat;
    oldImage=image;
}

$(function() {
	var rangeValue = $('#brightness>[type="range"]').val();
	$('#brightness>[type="range"]').on('change input', function() {
        rangeValue = $('[type="range"]').val();
        $("#brightness>p").text((rangeValue/255*100).toFixed(0)+"%");
	});
});

var state="open";

function shuffle() {
    if(state=="open") {
        $("#mainGrid").css("grid-template-columns","280px 60px 1fr");
        $(".inactive").css("display","none");
        $(".activated").css("display","block");
        $("#engine p").css("transform","rotate(270deg)");
        $("#engine p").text("Wróć");
        $("#details h1").text("Silnik");
        $("#atmosphere .icons p:nth-child(odd)").css({"transform" : "rotate(270deg)",
                                    "color" : "white",
                                    "font-size" : "19px",
                                    "place-self" : "center",
                                    "font-weight" : "300"});
        $("#atmosphere").css({"grid-template-columns" : "1fr",
                            "grid-template-rows": "1fr 1fr"});
        $("#details").css({"grid-template-columns" : "1fr 1fr",
                        "column-gap" : "0"});   
        state="close";
    } else {
        $("#mainGrid").css("grid-template-columns","280px 1fr 1fr");
        $(".inactive").css("display","block");
        $(".activated").css("display","none");
        $("#engine p").css("transform","rotate(0deg)");
        $("#engine p").text("Silnik");
        $("#details h1").text("Szczegóły");
        $("#atmosphere .icons p:nth-child(odd)").css({"transform" : "rotate(0deg)",
                                    "color" : "#B2BEC3",
                                    "font-size" : "13px",
                                    "font-weight" : "400"});
        $("#atmosphere").css({"grid-template-columns" : "1fr 1fr",
                            "grid-template-rows": "1fr"});
        $("#details").css({"grid-template-columns" : "1fr",
                        "column-gap" : "0px"});  
        state="open"; 
    }                      
}
