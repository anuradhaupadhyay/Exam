var createTest, limit;
var questions = [];
var joinCodeDB;
var db;
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
var checkTest;
var questionForCheck,answerActual;

function setup(){
  createCanvas(displayWidth,displayHeight - 100);
  db = firebase.database();

  createElement('h1',"EXAM").position(displayWidth/2-100,50);
  var p =createP("Beauty isn't about being pretty but about having a good soul, heart and mind.").position(displayWidth/2-300,200).style('font-family',"Jokerman");
  p.style('font-size', '25px');
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

    //Check test
    checkTest = createButton("Check a test");
    checkTest.style("background-color","blue");
    checkTest.position(displayWidth/2 - 200,displayHeight/2);
    checkTest.size(150,100);

    checkTest.mousePressed(function (){
      checkTest.hide();
      joinTest.hide();
      createTest.hide();
      askJoinForCheck = createInput("Join Code of the test you want to check please");
      askJoinForCheck.position(0,displayHeight/2);
      askJoinForCheck.size(600,40);
      askJoinForCheck.style('background-color',"#FF0000");
      joinCodeCheck = createButton("Ok");
      joinCodeCheck.position(650,displayHeight/2);
      joinCodeCheck.style('background-color',"#00FF00");
      joinCodeCheck.size(70,40);
      joinCodeCheck.mousePressed(function (){
        joinCodeCheck.hide();
        askJoinForCheck.hide();
        db.ref("/" + askJoinForCheck.value() + "/Answers").on("value",function (data){
          check = data.val();
          askNameForCheck = createInput("Name of the examinee whose paper you wish to check");
          askNameForCheck.position(0,displayHeight/2 - 100);
          askNameForCheck.size(600,40);
          askNameForCheck.style('background-color',"#00FF00");
          CheckPaper = createButton("Check");
          CheckPaper.position(650,displayHeight/2 - 100);
          CheckPaper.style('background-color',"#FFFF00");
          CheckPaper.size(70,40);
          CheckPaper.mousePressed(function (){
            CheckPaper.position(displayWidth-70,50);
            askNameForCheck.position(displayWidth-670,50);
            db.ref("/" + askJoinForCheck.value() + "/Answers" + "/" + askNameForCheck.value()).on("value",function (data){
              answerActual = data.val();              
            })
            var y1 = 50;
            var y2 = 80;
            db.ref("/" + askJoinForCheck.value() + "/questions").on("value",function (data){
              questionForCheck = data.val();
              console.log(questionForCheck);
              
              for(var i in questionForCheck){
                y1+=50;
                createElement('h3',questionForCheck[i] + ":").position(0,y1);
              }
            })
            
            for(var i in answerActual){
              y2+=50;
              createElement('h3',answerActual[i]).position(0,y2);
            }
            
          });
        });
      })
    });

    //Create Test code
    createTest.mousePressed(function (){
    joinTest.hide();
    checkTest.hide();
    swal({title: "You can make a maximum no. of 5 questions"});
    addQuestion = createButton("Add Question");
    addQuestion.style('background-color',"red");
    addQuestion.size(150,100);
    addQuestion.position(displayWidth/2 + 300, displayHeight/2);
    var y = 300;
    
    for(var i = 0; i< 5; i++){
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
            text: "Please click on the Done button until you get a message"
        })
          done.mousePressed(function (){
            db.ref("/join").on("value",function (data){
              joinCodeDB = data.val();
            },console.log("error"));
            db.ref("/join").set(joinCodeDB+1);

            var index = -1;
            for(var i =0; i < questions.length; i++){
              index++;
              db.ref("/" + joinCodeDB + "/questions" + "/" + index).set(questions[i]);
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
  background(89, 247, 239);

  // Join Test code
  joinTest.mousePressed(function (){
    joinTest.hide();
    createTest.hide();
    checkTest.hide();
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
      db.ref("/" + joinCode + "/questions").on("value",function (data){
        problems = data.val();
        var y1 = 5;
        console.log(problems);
        for(var i = 0; i < problems.length; i++){
          var query = problems[i];
          y1+=40;
          createElement('h5',query).position(0,y1);
      }
      if(problems.length >= 1){
        var questionA = createInput();
        questionA.position(0,85);
        questionA.style('background-color',"#00FFFF");
        buttonA = createButton("Submit");
        buttonA.position(200,85);
        buttonA.mousePressed(function (){
          questionA.hide();
          buttonA.hide();
          answers.push(questionA.value());
          db.ref("/" + joinCode + "/Answers" + "/" + examineeName.value() + "/0").set(questionA.value());
        });
      }
      if(problems.length >= 2){
        var questionB =  createInput();
        questionB.position(0,125);
        questionB.style('background-color',"#00FFFF");
        buttonB = createButton("Submit");
        buttonB.position(200,125);
        buttonB.mousePressed(function (){
          questionB.hide();
          buttonB.hide();
          answers.push(questionB.value());
          db.ref("/" + joinCode + "/Answers" + "/" + examineeName.value() + "/1").set(questionB.value());
        })
      }
      if(problems.length >= 3){
        var questionC =  createInput();
        questionC.position(0,165);
        questionC.style('background-color',"#00FFFF");
        buttonC = createButton("Submit");
        buttonC.position(200,165);
        buttonC.mousePressed(function (){
          questionC.hide();
          buttonC.hide();
          answers.push(questionC.value());
          db.ref("/" + joinCode + "/Answers" + "/" + examineeName.value() + "/2").set(questionC.value());
        })
      }
      if(problems.length >= 4){
        var questionD = createInput();
        questionD.position(0,205);
        questionD.style('background-color',"#00FFFF");
        questionD.position(0,205);
        buttonD = createButton("Submit");
        buttonD.position(200,205);
        buttonD.mousePressed(function (){
          questionD.hide();
          buttonD.hide();
          answers.push(questionD.value());
          db.ref("/" + joinCode + "/Answers" + "/" + examineeName.value() + "/3").set(questionD.value());
        })
      }
      if(problems.length === 5){
        var questionE =  createInput();
        questionE.position(0,245);
        questionE.style('background-color',"#00FFFF");
        buttonE = createButton("Submit");
        buttonE.position(200,245);
        buttonE.mousePressed(function (){
          questionE.hide();
          buttonE.hide();
          answers.push(questionE.value());
          db.ref("/" + joinCode + "/Answers" + "/" + examineeName.value() + "/4").set(questionE.value());
        })
      }
      }
      );
      
    });
  });
  });
  if(video != undefined && gameState === "join"){
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
  }
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