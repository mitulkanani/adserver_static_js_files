(async function() {
  var styles = `
   .adsbyadserver{
     display: inline-block;
     position: relative;
     background-color: #e7e7e7;
   }
   .link-container{
      background-color: #f8f8f8;
      position: relative;
      display: inline-block;
    }
    span.adserver-label {
      position: absolute;
      z-index: 1;
      right: 0;
      top: 0;
      color: #000;
      background-color: #ddd;
      border-bottom-left-radius: 2px;
      font-size: 12px;
      padding: 2px 4px;
    }
  `;
  var styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  var adObject = document.getElementsByClassName("adsbyadserver");
  if (adObject.length > 0) {
    var xhr = [];
    (async function loop() {
      // Set up our HTTP request
      // Setup our listener to process completed requests

      // const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      for (let i = 0; i < adObject.length; i++) {
        const adObjectRender = adObject[i].getAttribute("data-ad-client");
        if (adObjectRender !== undefined && adObjectRender !== "") {
          xhr[i] = new XMLHttpRequest();
          // await delay(Math.random() * 1000);
          await xhr[i].open("POST", "https://adserverbackend.onrender.com/");
          await xhr[i].setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          xhr[i].onreadystatechange = function() {
            if (xhr[i].readyState === 4 && xhr[i].status === 200) {
              var adServerContainer = document.createElement("div");
              adServerContainer.className = "adserver-container";

              // Main Container
              var adServerLabel = document.createElement("span");
              adServerLabel.className = "adserver-label";
              adServerLabel.textContent = "By AdServer";
              adServerContainer.appendChild(adServerLabel);

              // -> LinkContainer
              var adServerLink = document.createElement("a");
              adServerLink.className = "link-container";

              // Ad Image Container
              var image = document.createElement("img");
              image.className = "adserver-img";
              const jsonObj = JSON.parse(xhr[i].response);
              if (xhr[i].status >= 200 && xhr[i].status < 300) {
                // Setting up div height and width
                adServerContainer.style.width = `${jsonObj.data.width}px`;
                adServerContainer.style.height = `${jsonObj.data.height}px`;

                // Setting up image for adserver
                adServerLink.href = `${jsonObj.data.url}`;
                adServerLink.target = "_blank";
                image.src = `${jsonObj.data.banner}`;
              } else {
                image.alt = `${jsonObj.errorMessage}`;
              }
              adServerLink.appendChild(image);
              adServerContainer.append(adServerLink);
              // eslint-disable-next-line
              let value = parseInt(`${jsonObj.data.adPosition}`);
              adObject[value].appendChild(adServerContainer);
            }
          };
          await xhr[i].send(`adZoneCode=${adObjectRender}&adPosition=${i}`);
        } else {
          console.log("Please Add Campaign Key");
        }
      }
    })();
  }
}.call(window.onload));
