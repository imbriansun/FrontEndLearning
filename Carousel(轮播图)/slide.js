var items = document.getElementById("list").getElementsByTagName("li");
var goPrevBtn = document.getElementById("goPrevBtn");
var goNextBtn = document.getElementById("goNextBtn");
var points = document.getElementsByClassName("point");

var index = 0;
var wanted_index = 0;
var left = 0;
var count = 0;
var time = 0;
var mark = 1;	//Prevent violent clicks
points[index].className = "point active";


function goNext (){
    try{clearInterval(timer);
    }catch{}
    
    count = 0;
    index++;
    var timer = setInterval(function(){
        if(left <= -480*4){
            left = -10;
        }else{
            left -= 10;
        }
        list.style.marginLeft = left + "px";
        
        count++;
        if(count == 48){
            clearInterval(timer);
            count = 0;
            mark = 1;
        }
        //console.log(left);
    },10);
    if(index == 4){
        index = 0; 
    }
    clearActive();
    points[index].className = "point active";
}

function goPrev (){
    try{clearInterval(timer);
    }catch{}
    count = 0;
    index--;
    var timer = setInterval(function(){
        if(left >= 0){
            left = -480*4;
        }
            left += 10;
        
        list.style.marginLeft = left + "px";	
        count++;
        if(count == 48){
            clearInterval(timer);
            count = 0;
            mark = 1;
        }
        console.log(left);
    },10);
    if(index == -1){
        index = 3; 
    }
    clearActive();
    points[index].className = "point active";
}

function auto(){
    setInterval(function(){
        time++;
        if(time >= 20){
            goNext();
            time = 0;
        }
    }, 100);
}

auto();

goNextBtn.addEventListener("click", function(){
    time = 0;
    if(mark == 1){
        goNext();
        mark = 0;
    }
})

goPrevBtn.addEventListener("click", function(){
    time = 0;
    if(mark == 1){
        goPrev();
        mark = 0;
    }
})

var clearActive = function(){
    for(var i = 0; i < 4; i++){
        points[i].className="point";
    }
}

var goIndex = function(wanted_index){
    clearActive();
    while(index != wanted_index){
        if(index < wanted_index){
            goNext();
        }else if(index > wanted_index){
            goPrev();
        }
    }
}		

for(var i = 0; i < points.length; i++){
    points[i].addEventListener("click", function(){
        time = 0;
        var point_index = this.getAttribute("data");
        wanted_index = parseInt(point_index);
        if(mark == 1){
            goIndex(wanted_index);
            mark = 0;
        }
    })
}


