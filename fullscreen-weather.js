$(document).ready(function() {
	//constants
	var TAKEN_FROM_CACHE_PREFIX = "taken from cache: "
	//define local storage indexes
	var local_stored_timestamp = "weather.lastupdate_timestamp";
	var local_stored_temp = "weather.now.value"
	var local_stored_text = "weather.now.observation_time"
	//variables
	var delay = 300000;
	//code
	var prev_time = localStorage[local_stored_timestamp];
	var curr_time = $.now();
	if (( typeof (prev_time) == "undefined") || (prev_time + delay < curr_time )) {
		localStorage[local_stored_timestamp] = curr_time;
		$.ajax({
			url : "http://api.wunderground.com/api/" + $.parseQuery().key + "/conditions/q/autoip.json",
			dataType : "jsonp",
			success : function(data) {
				if(data.response.error){
					$("#time").text(data.response.error.description); 
				}else{
					var temp =  data.current_observation.temp_c;
					var text =  data.current_observation.observation_time;
					localStorage[local_stored_temp] = temp;
					localStorage[local_stored_text] = text;
					$("#temp").text(temp);
					$("#time").text(text); 
				}
			},
			error : function() {
				alert("Can't get the current weather conditions");
			}
		});
	} else { //Use cache value
		$("#temp").text(localStorage[local_stored_temp]);
		$("#time").text(TAKEN_FROM_CACHE_PREFIX + localStorage[local_stored_text]);
	}
}); 