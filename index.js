const SERVER = "http://localhost:3000";



window.onload = () => {


    document.getElementById("weight").value = ""
    document.getElementById("weight").focus()


      //give the server 10 seconds to hopefully boot and query the last PBI tag in the bale file for the current day
      //this is to prevent having to reenter the tag sequence in case of intra day reboot/ chrome autorefresh
      setTimeout(() => {
        

        let xhr1 = new XMLHttpRequest;
        xhr1.open('GET', `${SERVER}/lastbale`);
        xhr1.send();

        xhr1.onload = () => {

          let tag = document.getElementById("tag")


          if(xhr1.status == 200){
            let lasttag = JSON.parse(xhr1.response).tag
            let next = (parseInt(lasttag) + 1).toString().padStart(12,"0");
            tag.value = next
          }else{
            tag.value = "000000000001";
          }
          
        }


      },10000);


      setInterval(()=> {

        let d = new Date();
        

       document.getElementById("time").innerHTML = d.toLocaleTimeString();


      }, 1000);

      

      document.getElementById("send").addEventListener("click", function() {
        
        let tagval = document.getElementById("tag").value;
        let weightval = parseInt(document.getElementById("weight").value);


        if( tagval.length != 12 ){

          displayError("Invalid PBI Tag")

          
        }
        else if ( weightval < 400 || weightval > 600  || !(typeof weightval =="number" && weightval >= 0) )  {
          displayError("weight invalid or out of range")
          
        }else{

          
          console.log("Sent bale ", tagval," ", weightval)
          let xhr = new XMLHttpRequest;
          xhr.open('POST', SERVER);
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

          let d = new Date();

          xhr.send(JSON.stringify({ "tag": tagval, "weight": weightval, "time": d.getTime() }));

          //if XHR send response is OK- presume it was written and increment tag, zero weight
          xhr.onload = () => {

            if(xhr.status == 200){
              let current = document.getElementById("tag").value;
              let next = (parseInt(current) + 1).toString().padStart(12,"0");
              document.getElementById("tag").value = next;

              document.getElementById("weight").value = ""
              document.getElementById("weight").focus()
            }else{
              displayError(`Connectivity issue at ${SERVER}`)
            }
            

          }

        }

        
      });

}

function displayError(errorMessage){

  console.log("Error: ", errorMessage)
  playSound("err.mp3")

  let modal = document.querySelector("#modal");
  modal.innerHTML = "Error:" + errorMessage;
  modal.style.display = "inherit";

  setTimeout(() => {
    
    modal.style.display = "none";

  }, 3000)

}

function playSound(url) {
  const audio = new Audio(url);
  audio.play();
}