const maxHistoryLength = 10;

function readHistory()
{
	var history = JSON.parse(localStorage.getItem('gpt_history'));
	if (history === null)
		return;

	var cur_historyStart = parseInt(localStorage.getItem('gpt_historyStart'));
	var cur_historyEnd = parseInt(localStorage.getItem('gpt_historyEnd'));
	var position = (cur_historyEnd + maxHistoryLength) % maxHistoryLength;
	var historyText = "";
	let counter = 0;
	do 
	{
		if (history.length <= 0)
		{
			return;
		}
		position = ((position - 1) + maxHistoryLength) % maxHistoryLength;

		historyPrompt = history[position];
		question = historyPrompt['prompt'];
		answer = historyPrompt['answer'];
		historyText += '<div class="historyBox" id="' +
			toString(position) +
			'">' + 
			'<p><h2>Question: </h2>' + question + '</p>' +
			'<p><h2>Answer: </h2>' + answer + '</p>' +
		  	'</div>';
		counter = counter + 1;

	} while (position != cur_historyStart && counter < maxHistoryLength);
	document.querySelector("#history").innerHTML = historyText;
}

function clearHistory(wipeLocalStorage)
{
	if (wipeLocalStorage === true)
	{
		localStorage.clear();

	}
	else
	{
		localStorage.removeItem('gpt_history');
		localStorage.removeItem('gpt_historyStart');
		localStorage.removeItem('gpt_historyEnd');

	}

	document.querySelector("#answers").innerHTML = "<p>History cleared</p>";
	document.querySelector("#history").innerHTML = "";
}

async function sendPHPRequest(prompt)
{
	return fetch("gpt.php",
	{
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		},body: `prompt=${prompt}`
	})
	.then((response) => response.text())
	.then((res) => (document.querySelector("#answers").innerHTML = res));
}

async function query(prompt)
{
	if (prompt === "")
	{
		document.querySelector("#answers").innerHTML = "<p>Please enter your prompt again</p>";
		return;
	}
	document.querySelector("#answers").innerHTML = "<p>Please wait</p>";
    await sendPHPRequest(prompt);
	if (document.querySelector("#answers").innerHTML === null)
	{
		return;
	}

	var history = JSON.parse(localStorage.getItem('gpt_history'));
	var cur_historyStart = parseInt(localStorage.getItem('gpt_historyStart'));
	var cur_historyEnd = parseInt(localStorage.getItem('gpt_historyEnd'));

	if (history === null) history = new Array();
	if (isNaN(cur_historyStart)) cur_historyStart = 0;
	if (isNaN(cur_historyEnd)) cur_historyEnd = 0;

	const ans = document.querySelector("#answers").innerHTML;
	history[cur_historyEnd] = {'prompt' : prompt, 'answer' : ans};

	if (history.length < 10)
	{
		cur_historyEnd += 1;
	}
	else
	{
		if (cur_historyEnd < cur_historyStart)
			cur_historyStart = (cur_historyStart + 1) % maxHistoryLength;
		
			cur_historyEnd = (cur_historyEnd + 1) % maxHistoryLength;	

	}
	
	localStorage.setItem('gpt_history', JSON.stringify(history));
	localStorage.setItem('gpt_historyStart', cur_historyStart);
	localStorage.setItem('gpt_historyEnd', cur_historyEnd);

	readHistory();
}

window.addEventListener("load", function()
{
    document.getElementById("query-form").addEventListener("submit",function(form){

        form.preventDefault();
        var prompt = document.getElementById('prompt').value;

        query(prompt);
    });
})

document.querySelector('#history').innerHTML = "Reading history";
readHistory();