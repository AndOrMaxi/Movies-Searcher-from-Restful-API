var page=1;

window.onload = function()
{
    var hasSearched = false;
    var typingTimer;                //timer identifier
    var doneTypingInterval = 1800;  //time in ms (3 seconds)
    var userInput = document.getElementById('submit');


    userInput.addEventListener('keyup', () => {
		clearTimeout(typingTimer);
		
		if (userInput.value ) 
		{			
			typingTimer = setTimeout(doneTyping, doneTypingInterval);
			document.getElementById('myContainer').innerHTML='';
			document.getElementById('footer').innerHTML='';
		}
		else
		{
			document.getElementById('myContainer').innerHTML='<img id="wallpaper" src="https://boygeniusreport.files.wordpress.com/2016/03/movies-tiles.jpg?quality=98&strip=all">';
			document.getElementById('footer').innerHTML='<p id="team">© Marios & Andromachi 2019</p>';
			hasSearched = false;
		}
    });
	

    function doneTyping(p) 
	{
		console.log(page);
		addResponseToDivsInFrontEnd(hasSearched);
		restoreButtonsIfGone();
		//hasSearched = true;
		
		var title = document.getElementById("submit").value;
		document.getElementById('footer').innerHTML ='<button type="button" class=button id="previous">Previous</button> <span id="page"> </span><button type="button" class=button id="next">Next</button>';
		
		search(title);
		
		var butP = document.getElementById('previous');
			
		butP.addEventListener("click", function() {if (page>1) { page--; restoreButtonsIfGone();search(title);} }	);
	
		var butN = document.getElementById('next');
	
		butN.addEventListener("click", function() {if (page<100) {page++;restoreButtonsIfGone(); search(title); }});			
			
		for(let i=0;i<10;i++)
		{
			document.getElementById("button"+i).addEventListener("click", function() { more(i); });
		}
	}
}

function search(t)
{
	var urlForTitleAndPoster = "https://www.omdbapi.com/?s=" + t +"&page="+ page +"&apikey=640d2cde";
	
	if(page>=1)
	{
		document.getElementById("page").innerHTML="Page "+page;
	}
	if(page==1 )
	{
		document.getElementById("previous").disabled = true;
	}
	else
	{
		document.getElementById("previous").disabled = false;
	}
	if(page==100 )
	{
		document.getElementById("next").disabled = true;
	}
	else
	{
		document.getElementById("next").disabled = false;
	}
	
	

	// Retrieve json query
	var result = getData(urlForTitleAndPoster)
	.then( function(data) {
		console.log(data);console.log(page);
		console.log(data.Response);
		console.log(data.totalResults);

		var releasedClasses = document.getElementsByClassName("released");
		var titleShowClasses = document.getElementsByClassName("titleShow");
		var posterClasses = document.getElementsByClassName("poster");
		

		for (var i = 0; i < 10; i++)
		{
			// Add Title and Poster to html
			titleShowClasses[i].innerText = data.Search[i].Title;
			posterClasses[i].src = data.Search[i].Poster;
			releasedClasses[i].innerHTML = "<strong>Released:</strong> " + data.Search[i].Year;
				
		}
		
		return data;
		  
	});

	// Retrieve plot summaries
	for (let i = 0; i < 10; i++) 
	{
		result.then(function (data) 
		{
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
			var director = document.getElementsByClassName("director");
			var actors = document.getElementsByClassName("actors");
			genreClasses[i].innerText = data.Genre;
			director[i].innerHTML = "<strong>Director:</strong> " + data.Director;
			actors[i].innerHTML = "<strong>Actors:</strong> " + data.Actors;
		});
	}
}

async function more( num ) 
{
	var title = document.getElementById("submit").value;
	var urlForTitleAndPoster = "https://www.omdbapi.com/?s=" + title +"&page="+ page +"&apikey=640d2cde";

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

async function getData(url)
{
	let response = await fetch(url);

	let data = await response.json();

	return data;
}

function restoreButtonsIfGone()
{
	var boxClasses = document.getElementsByClassName("box");
	
	for (var i =0 ; i < 10 ; i++)
	{
		if(! $("#button"+i+"").length)
		{  
			$(boxClasses[i]).append($("<button>More</>").attr("id", "button"+i+"").attr("value", i).addClass("button")); 
		}
	}
}

function addResponseToDivsInFrontEnd(hasSearched)
{
	if (!hasSearched)
	{
		for (var i = 0; i < 10; i++)
		{
			$("#myContainer").append(
				$("<div/>").addClass("container").append(
					$("<div/>").addClass("box").append(
						$("<figure/>").addClass("myimg").append(
							$('<img src="http://placehold.it/250x200"/>').addClass("poster")

						)
						
					)
					.append($("<h3/>").addClass("titleShow"))
					.append($("<p/>").attr("id", "text"+i+""))
					.append($("<button>More</>").attr("id", "button"+i).attr("value", i).addClass("button"))
					.append($("<div/>").addClass("info").append(
						$("<p/>").addClass("director"))
						.append($("<p/>").addClass("actors"))
						.append($("<p/>").addClass("released"))
						.append($("<p/>").addClass("genre"))
					)
				)
			).append($("<br/>"))
		}
	}
}
