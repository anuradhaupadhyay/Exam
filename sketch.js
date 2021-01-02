var createTest, limit;
var questions = [];
var joinCodeDB;
var db;
var bg;
var joinTest;
var askCode;
var problems;
var video;
var value = 0;
var poseNet;
var noseX = 0;
var noseY = 0;
var gameState = "Nothing";
var answers = [];
var ind = 1;

function preload(){
  bg = loadImage("bg.jpg")
}

function setup(){
  createCanvas(displayWidth,displayHeight - 100);
  db = firebase.database();

  // Creating the test button
  createTest = createButton("Create Test");
  createTest.style("background-color","green");
  createTest.position(displayWidth/2,displayHeight/2);
  createTest.size(150,100);

  //Join Test button
    joinTest = createButton("Join a test");
    joinTest.style("background-color","red");
    joinTest.position(displayWidth/2 + 200,displayHeight/2);
    joinTest.size(150,100);


    //Create Test code
    createTest.mousePressed(function (){
    joinTest.hide();
    addQuestion = createButton("Add Question");
    addQuestion.style('background-color',"red");
    addQuestion.size(150,100);
    addQuestion.position(displayWidth/2 + 300, displayHeight/2);
    var y = 300;
    
    for(var i = 0; i< 500; i++){
      addQuestion.mousePressed(function (){
        y+=50;
        var question = createInput("Type your Question");
        question.position(0,y);
        question.size(600,40);
        question.style('background-color',"#FFFF00")
        confirm = createButton("Confirm");
        confirm.position(650,y);
        confirm.style('background-color',"#00FF00");
        confirm.size(70,40);
        confirm.mousePressed(function (){
          questions.push(question.value());
          confirm.hide();
          
          done = createButton("Done");
          done.style('background-color',"pink");
          done.size(150,100)
          done.position(displayWidth/2 + 300,displayHeight/2 - 100);
          swal({
            icon: 'info',
            text: "Please click on the Done button twice with a gap of 5 seconds when you are done."
        })
          done.mousePressed(function (){
            db.ref("/join").on("value",function (data){
              joinCodeDB = data.val();
            },console.log("error"));
            db.ref("/join").set(joinCodeDB+1);

            var index = 0;
            for(var i =0; i < questions.length; i++){
              index++;
              db.ref("/" + joinCodeDB + "/" + index).set(questions[i]);
              console.log(questions[i]);
            }

            swal({title: "The examinee's join code is "+ joinCodeDB});
        });
        });
      });
    }
  createTest.hide();
  });
}

function draw(){
  background(bg);

  // Join Test code
  joinTest.mousePressed(function (){
    joinTest.hide();
    createTest.hide();
    examineeName = createInput("Name");
    examineeName.position(0,displayHeight/2);
    examineeName.size(600,40);
    examineeName.style('background-color',"#FFFF00");
    ok = createButton("OK");
    ok.position(650,displayHeight/2);
    ok.style('background-color',"#00FF00");
    ok.size(70,40);
    ok.mousePressed(function (){
    examineeName.hide();
    ok.hide();
    video = createCapture(VIDEO);
    video.size(200,200);
    video.position(1000,100);
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', gotPoses);
    gameState = "join";
    askCode = createInput("Join code");
    askCode.position(0,displayHeight/2);
    askCode.size(600,40);
    askCode.style('background-color',"#FFFF00");
    Ok = createButton("OK");
    Ok.position(650,displayHeight/2);
    Ok.style('background-color',"#00FF00");
    Ok.size(70,40);
    Ok.mousePressed(function (){
      Ok.hide();
      askCode.hide();
      joinCode = askCode.value();
      db.ref("/" + joinCode).on("value",function (data){
        problems = data.val();
        var y1 = 5;
        var y2 = 45;
        for(var i = 1; i < problems.length; i++){
          var query = problems[i];
          y1+=40;
          y2+=40;
          createElement('h5',query).position(0,y1);
          var questionA = createInput();
          questionA.position(0,y2);
          questionA.style('background-color',"#FFFF00");
      }
    }
      );
      
    });
  });
  });
  console.log(answers);
  /*if(video != undefined && gameState === "join"){
    if(noseX < 90 || noseX > 130){
      swal({title: "Please do not look away from the webcam"});
    }
  }

  if(mouseY < 10 || mouseY > displayHeight - 50 || mouseX < 10){
    swal({
      title:"Please don't hover your cursor outside the Canvas",
      click:false
    });
  }

  if(keyCode === 17 || keyCode === 18){
        swal({
      title:"Please don't press control or Alt during the test",
      click:false
    })
    
    keyCode = null;
  }*/
}

function gotPoses(poses){
  if(poses.length>0){
   noseX = poses[0].pose.nose.x;
   noseY = poses[0].pose.nose.y;
  }
}
function modelReady(){
 console.log("face detection ready");
}

function anyEvent(){
  answers.push(this.value());
}