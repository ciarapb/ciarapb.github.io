var NUMARMS = 5;
//var PROBS = [0.6, 0.2, 0.55, 0.7, 0.5];
var REWARDS = [0,0,0,0,0];
var NUMPLAYS = [0,0,0,0,0];
var UCBS = [0,0,0,0,0];
var HORIZON = 100;
var UCB_PLAYS = 0;

var PROBS = [0,0,0,0,0];
for (var i = 0; i < PROBS.length; i++) {
    PROBS[i] = Math.random().toFixed(3);
}

    
d3.select( "#reveal-div" )
    .selectAll("p")
    .data( PROBS )
    .enter()
    .append("p")
    .text( function(d,i){ return "Arm " + (i + 1) + ": " +d; } )
    

function setseed(){
    // sets a seed for random number generation
    Math.seedrandom('ilovebandits');

    // also set check box to unchecked on load
    c1.checked = false;
}


function sample_arm( p ){
    // for a given probability p, samples the arm with mean reward p
    if (  Math.random() < p){ return 1 } else { return 0 }
}
     
    
function update_arm( arm_number ){
    // updates parameter values for the played arm
    var result = sample_arm(PROBS[arm_number] );
    UCB_PLAYS += 1;
    NUMPLAYS[arm_number] += 1;
    REWARDS[arm_number] += result;

    // need to update all ucbs as they all depend on the total number of plays so far
    for(var i=0; i<NUMARMS; i++){
        if(NUMPLAYS[i]<1){
            UCBS[i] = 0.000;
        } else{
            cb = Math.sqrt(2*Math.log(UCB_PLAYS)/NUMPLAYS[i]);
            UCBS[i] = (REWARDS[i]/NUMPLAYS[i] + cb).toFixed(3);
        }
    }

    // update data that is printed
    update_scoreboard(arm_number, result)
    // redraw(arm_number); //makes the plots
    return
}
     
    
    function bayesian_bandits(){
        //for (var i = 0; i < n_pulls; i++ ){
            //sample from Beta distributions
            var samples = rbeta_array(ARMS);
            var select = samples.indexOf( d3.max( samples) );
            update_arm( select );
            if (BB_RUN < 300){
                BB_RUN += 1;
                window.setTimeout( bayesian_bandits, 100 )
            }
            else{
                return 
            }
        //}
    }
    
    

function update_scoreboard(arm_number, result){
    // updates the numbers shown on screen

    // rewards
    document.getElementById("reward1").innerHTML = REWARDS[0];
    document.getElementById("reward2").innerHTML = REWARDS[1];
    document.getElementById("reward3").innerHTML = REWARDS[2];
    document.getElementById("reward4").innerHTML = REWARDS[3];
    document.getElementById("reward5").innerHTML = REWARDS[4];

    // pulls
    document.getElementById("pulls1").innerHTML = NUMPLAYS[0];
    document.getElementById("pulls2").innerHTML = NUMPLAYS[1];
    document.getElementById("pulls3").innerHTML = NUMPLAYS[2];
    document.getElementById("pulls4").innerHTML = NUMPLAYS[3];
    document.getElementById("pulls5").innerHTML = NUMPLAYS[4];

    // means
    document.getElementById("mean1").innerHTML = (REWARDS[0]/Math.max(NUMPLAYS[0],1)).toFixed(3);
    document.getElementById("mean2").innerHTML = (REWARDS[1]/Math.max(NUMPLAYS[1],1)).toFixed(3);
    document.getElementById("mean3").innerHTML = (REWARDS[2]/Math.max(NUMPLAYS[2],1)).toFixed(3);
    document.getElementById("mean4").innerHTML = (REWARDS[3]/Math.max(NUMPLAYS[3],1)).toFixed(3);
    document.getElementById("mean5").innerHTML = (REWARDS[4]/Math.max(NUMPLAYS[4],1)).toFixed(3);

    //ucbs
    //var colors = set_ucb_colors();
    //document.getElementById("ucb1").innerHTML = UCBS[0];
    //document.getElementById("ucb1").style.color = colors[0];
    //document.getElementById("ucb2").innerHTML = UCBS[1];
    //document.getElementById("ucb2").style.color = colors[1];
    //document.getElementById("ucb3").innerHTML = UCBS[2];
    //document.getElementById("ucb3").style.color = colors[2];
    //document.getElementById("ucb4").innerHTML = UCBS[3];
    //document.getElementById("ucb4").style.color = colors[3];
    //document.getElementById("ucb5").innerHTML = UCBS[4];
    //document.getElementById("ucb5").style.color = colors[4];

    //ucbs if box checked
    if (document.getElementById('c1').checked) {
        var colors = set_ucb_colors();
        document.getElementById("ucb1a").innerHTML = UCBS[0];
        document.getElementById("ucb1a").style.color = colors[0];
        document.getElementById("ucb2a").innerHTML = UCBS[1];
        document.getElementById("ucb2a").style.color = colors[1];
        document.getElementById("ucb3a").innerHTML = UCBS[2];
        document.getElementById("ucb3a").style.color = colors[2];
        document.getElementById("ucb4a").innerHTML = UCBS[3];
        document.getElementById("ucb4a").style.color = colors[3];
        document.getElementById("ucb5a").innerHTML = UCBS[4];
        document.getElementById("ucb5a").style.color = colors[4];
    }

    // total reward
    document.getElementById("totalreward").innerHTML = REWARDS.reduce(get_sum);

    // total plays
    document.getElementById("totalplays").innerHTML = NUMPLAYS.reduce(get_sum);

    // add new row of the reward for each play which dissappears quickly
    var instrewards = ["","","","",""];
    instrewards[arm_number] = result;
    document.getElementById("inst1").innerHTML = instrewards[0];
    document.getElementById("inst2").innerHTML = instrewards[1];
    document.getElementById("inst3").innerHTML = instrewards[2];
    document.getElementById("inst4").innerHTML = instrewards[3];
    document.getElementById("inst5").innerHTML = instrewards[4];
    setTimeout(revertToNone, 1000);

    // display pop-up box at 100 plays
    if(NUMPLAYS.reduce(get_sum)>=100){
        var resmodal = document.getElementById('result');
        resmodal.style.display = "block";
        document.getElementById("finalplays").innerHTML = NUMPLAYS.reduce(get_sum);
        document.getElementById("finalreward").innerHTML = REWARDS.reduce(get_sum);
        document.getElementById("probs").innerHTML = PROBS;

        //alert("Congratulations!"
        //    + "\n" + "After " + NUMPLAYS.reduce(get_sum) + "plays, your reward was " + REWARDS.reduce(get_sum)
        //    + "\n" + "The true probabilities are: " + PROBS
        //    );
    }
}    



function get_sum(total, num) {
    return total + num;
}


function set_ucb_colors(){
    var colors = ['black','black','black','black','black'];
    var maxucb = Math.max.apply(null, UCBS);

    for (var i = 0; i < UCBS.length; i++) {
        if (UCBS[i]==maxucb) {
            colors[i] = 'red';
        }
    }

    return colors
}


function addUCBS(tableID) {

    var table = document.getElementById(tableID);

    var rowCount = table.rows.length;
    if(rowCount==6){
        var row = table.insertRow(rowCount);

        var colors = set_ucb_colors();

        var rowname = row.insertCell(0);
        rowname.innerHTML = "UCBs:";
        rowname.style.fontWeight = "bolder";

        var ucb1 = row.insertCell(1);
        ucb1.innerHTML = UCBS[0];
        ucb1.style.color = colors[0];
        ucb1.id = "ucb1a";

        var ucb2 = row.insertCell(2);
        ucb2.innerHTML = UCBS[1];
        ucb2.style.color = colors[1];
        ucb2.id = "ucb2a";

        var ucb3 = row.insertCell(3);
        ucb3.innerHTML = UCBS[2];
        ucb3.style.color = colors[2];
        ucb3.id = "ucb3a";

        var ucb4 = row.insertCell(4);
        ucb4.innerHTML = UCBS[3];
        ucb4.style.color = colors[3];
        ucb4.id = "ucb4a";

        var ucb5 = row.insertCell(5);
        ucb5.innerHTML = UCBS[4];
        ucb5.style.color = colors[4];
        ucb5.id = "ucb5a";
    }
}


function showMe (box) {
    var chboxs = document.getElementById("c1");
    var vis = "none";
    if(chboxs.checked){
        vis = "block";
    }
    document.getElementById(box).style.display = vis;   
}

function revertToNone(){
    document.getElementById("inst1").innerHTML = "";
    document.getElementById("inst2").innerHTML = "";
    document.getElementById("inst3").innerHTML = "";
    document.getElementById("inst4").innerHTML = "";
    document.getElementById("inst5").innerHTML = "";
}


// show instructions on click
var mymodal = document.getElementById('myModal');
var btn = document.getElementById("myBtn");
var spanclose = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    mymodal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
spanclose.onclick = function() {
    mymodal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == mymodal) {
        mymodal.style.display = "none";
    }
}