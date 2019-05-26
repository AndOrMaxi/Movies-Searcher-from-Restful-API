window.onload = function()
{
    // var buttonHasBeenPressedOnce = false;
	
    document.getElementById("movieTitle").oninput = function()
	{
      addResponseToDivsInFrontEnd();
      restoreButtonsIfGone();
      //buttonHasBeenPressedOnce = true;

      var title = document.getElementById("movieTitle").value;

      var urlForTitleAndPoster = "https://www.omdbapi.com/?s=" + title +"&page=5&apikey=640d2cde";

      // Retrieve json query
      var result = getData(urlForTitleAndPoster)
        .then( function(data) 
		{
          console.log(data);
          var releasedClasses = document.getElementsByClassName("released");
          var titleShowClasses = document.getElementsByClassName("titleShow");
          var posterClasses = document.getElementsByClassName("poster");

          for (var i = 0; i < 10; i++){
            // Add Title and Poster to html
            titleShowClasses[i].innerText = data.Search[i].Title;
            posterClasses[i].src = data.Search[i].Poster;
            releasedClasses[i].innerText = "Released : " + data.Search[i].Year;

          }
          return data;
        });

        // Retrieve plot summaries
        for (let i = 0; i < 10; i++) {
          result.then(function (data) {
            var urlForPlotSummary = "https://www.omdbapi.com/?i=" + data.Search[i].imdbID + "&apikey=640d2cde";
            return fetch(urlForPlotSummary);
          })
          .then( function(response) 
		  {
            return response.json();
          })
          // Add plot summaries to html
          .then( function(data) 
		  {
              document.getElementById("text"+i+"").innerText = data.Plot;
              var genreClasses = document.getElementsByClassName("genre");
              genreClasses[i].innerText = data.Genre;
          });
        }


        document.getElementById("button0").addEventListener("click", function() { more(0); });
        document.getElementById("button1").addEventListener("click", function() { more(1); });
        document.getElementById("button2").addEventListener("click", function() { more(2); });
        document.getElementById("button3").addEventListener("click", function() { more(3); });
        document.getElementById("button4").addEventListener("click", function() { more(4); });
        document.getElementById("button5").addEventListener("click", function() { more(5); });
        document.getElementById("button6").addEventListener("click", function() { more(6); });
        document.getElementById("button7").addEventListener("click", function() { more(7); });
        document.getElementById("button8").addEventListener("click", function() { more(8); });
        document.getElementById("button9").addEventListener("click", function() { more(9); });

    }
}

async function more( num ) 
{
  var title = document.getElementById("movieTitle").value;
  var urlForTitleAndPoster = "https://www.omdbapi.com/?s=" + title +"&page=5&apikey=640d2cde";

  getData(urlForTitleAndPoster)
    .then( function(data) {
      var urlForFullPlotSummary = "https://www.omdbapi.com/?i=" + data.Search[num].imdbID + "&plot=full&apikey=640d2cde";
      return getData(urlForFullPlotSummary);
    })
    .then( function(data){
      document.getElementById("text"+num).innerText = data.Plot;
    });
    var element = document.getElementById("button"+num+"");
    element.parentNode.removeChild(element);
}

async function getData(url){
  let response = await fetch(url);

  let data = await response.json();

  return data;
}

function restoreButtonsIfGone(){
  var boxClasses = document.getElementsByClassName("box");
  for (var i =0 ; i < 10 ; i++){
    if(! $("#button"+i+"").length){  $(boxClasses[i]).append($("<button>More</>").attr("id", "button"+i+"").attr("value", i).addClass("button")); }
  }
}

function addElement(parentId, elementTag, elementId, html) {
    // Adds an element to the document
    var p = document.getElementById(parentId);
    var p = document.getElementsByClassName(box);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    newElement.innerHTML = html;
    p.appendChild(newElement);
}

function addResponseToDivsInFrontEnd(){
  //if (!buttonHasBeenPressedOnce){
    for (var i = 0; i < 10; i++){
        $("#myContainer").append(
          $("<div/>").addClass("container").append(
            $("<div/>").addClass("box").append(
              $("<figure/>").addClass("myimg").append(
                $('<img src="http://placehold.it/250x200"/>').addClass("poster")

              )
              )
              .append($("<h3/>").addClass("titleShow"))
              .append($("<p/>").attr("id", "text"+i+""))
               .append($("<span/>").addClass("released"))
               .append($("<span/>").addClass("genre"))
               .append($("<button>More</>").attr("id", "button"+i).attr("value", i).addClass("button"))


          )
        )
    }
  //}

}
