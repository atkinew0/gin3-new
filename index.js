const SERVER = "http://localhost:3000";



window.onload = () => {


    document.getElementById("weight").value = ""
    document.getElementById("weight").focus()


      setInterval(()=> {

        let d = new Date();
        

       document.getElementById("time").innerHTML = d.toLocaleTimeString();


      }, 1000);

      

      document.getElementById("send").addEventListener("click", function() {
        
        let tagval = document.getElementById("tag").value;
        let weightval = parseInt(document.getElementById("weight").value);


        if(tagval.length != 12 || ( weightval < 400 || weightval > 600 ) || !(typeof weightval =="number" && weightval >= 0) ){

          console.log("Error:  weight or tag out of range, tag:",tag.value, "weight: ", weight.value);
          playSound("err.mp3")
        }else{

          
          console.log("Sent bale ", tagval," ", weightval)
          let xhr = new XMLHttpRequest;
          xhr.open('POST', SERVER);
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

          let d = new Date();

          xhr.send(JSON.stringify({ "tag": tagval, "weight": weightval, "time": d.getTime() }));

          //if XHR send response is OK- presume it was written and increment tag, zero weight
          xhr.onload = () => {
            let current = document.getElementById("tag").value;
            let next = (parseInt(current) + 1).toString().padStart(12,"0");
            document.getElementById("tag").value = next;

            document.getElementById("weight").value = ""
            document.getElementById("weight").focus()

          }

        }

        
      });

}

function playSound(url) {
  const audio = new Audio(url);
  audio.play();
}