var video;
var value = 0;
var poseNet;
var noseX = 0;
var noseY = 0;

function setup(){
  createCanvas(400,400);
  video = createCapture(VIDEO);
  video.hide();
  video.size(200,200);
  video.position(1000,100)
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
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
function draw(){
  background(0);
  image(video, 0 ,0);
  fill("red");
  if(poses.length === 0){
    
  }
  if(noseX < 90 || noseX > 130){
    swal({
      title: "Please don't look away from the webcam"
    })
  }
  if(mouseY < 10 || mouseY > 490 || mouseX < 10){
    swal({
      title:"Please don't hover your cursor outside the Canvas",
      click:false
    });
  }

  if(keyCode === 17){
        swal({
      title:"Please don't press control during the test",
      click:false
    })
    
    keyCode = null;
  }

}