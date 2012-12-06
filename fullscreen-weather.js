$(document).ready(function() {
	var key = "weather.time";
	var local_stored_temp = "weather.now.value"
	var local_stored_text = "weather.now.lastupdatedtext"
	var TAKEN_FROM_CACHE_PREFIX = "taken from cache: "
	var delay = 300000;
	var prev_time = localStorage[key];
	var curr_time = $.now();
	if (( typeof (prev_time) == "undefined") || (prev_time + delay < curr_time )) {
		localStorage[key] = curr_time;
		$.ajax({
			url : "http://api.wunderground.com/api/" + $.parseQuery().key + "/conditions/q/autoip.json",
			dataType : "jsonp",
			success : function(data) {
				localStorage[local_stored_temp] = data.current_observation.temp_c
				localStorage[local_stored_text] = data.current_observation.observation_time
				$("#temp").text(data.current_observation.temp_c);
				$("#time").text(data.current_observation.observation_time);
			},
			error : function() {
				alert("Can't get the current weather conditions");
			}
		});
	} else {
		$("#temp").text(localStorage[local_stored_temp]);
		$("#time").text(TAKEN_FROM_CACHE_PREFIX + localStorage[local_stored_text]);
	}
}); 