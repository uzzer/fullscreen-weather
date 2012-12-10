$(document).ready(function() {

	var local_stored_temp = "weather.now.value",
	  	local_stored_text = "weather.now.lastupdatedtext",
	    local_stored_timestamp = "weather.localstoredtimestamp";

	var WeatherIndicator = function(args) {
		this.setWeatherData = function(temp, time_in_words, timestamp) {
			this.temp = temp;
			this.time_in_words = time_in_words;
			this.timestamp = timestamp;
		};
		this.setLocaLStorageWeather = function(temp, observation_time, timestamp) {
			localStorage[local_stored_temp] = temp;
			localStorage[local_stored_text] = observation_time;
			localStorage[local_stored_timestamp] = timestamp
		};
		this.saveWeatherDataFromWundergroundAPI = function(data) {
			var temp_from_API_repsonse = data.current_observation.temp_c;
			var observation_time_from_API_repsonse = data.current_observation.observation_time;
			var now = $.now()
			this.setWeatherData(temp_from_API_repsonse, observation_time_from_API_repsonse, now);
			this.setLocaLStorageWeather(temp_from_API_repsonse, observation_time_from_API_repsonse, now)
		};
		this.isStoredDataNotDefined = function() {
			return typeof (localStorage[local_stored_timestamp]) == "undefined"
		};
		this.isStoredDataOutOfDate = function() {
			var DELAY = 300000
			return this.timestamp + DELAY < $.now()
		};
		this.showWeather = function(args) {
			$("#temp").text(this.temp);
			TAKEN_FROM_CACHE_PREFIX = "Cache:"
			if (args.cache == true) {
				$("#time").text(TAKEN_FROM_CACHE_PREFIX + this.time_in_words);
			} else {
				$("#time").text(this.time_in_words);
			}
		};
		this.updateAndShowWeather = function() {
			if (this.mode == 'autoip'){
				this.api_request_url = "http://api.wunderground.com/api/" + $.parseQuery().key + "/conditions/q/autoip.json"
			}
			var link_to_this = this.name;
			$.ajax({
				url : this.api_request_url,
				dataType : "jsonp",
				success : function(data) {
					processWeatherResponse({'link_to_parent':link_to_this, 'cache':false, 'data':data});
					/*mainWeatherIndicator.saveWeatherDataFromWundergroundAPI(data)
					mainWeatherIndicator.showWeather({
					'cache' : false
					})*/
				},
				error : function() {
					/*mainWeatherIndicator.showWeather({
					'cache' : true
					})*/
				}
			});
		}
		this.loadLocalCache=function(){
			this.temp = localStorage[local_stored_temp];
			this.time_in_words = localStorage[local_stored_text];
			this.timestamp = localStorage[local_stored_timestamp];
		}
		//main
		this.refresh = function() {
			var now = $.now()
			if (this.isStoredDataNotDefined() || this.isStoredDataOutOfDate()) {
				this.updateAndShowWeather()
			} else {
				this.showWeather({
					'cache' : true
				})
			}
		}
		//constructor
		this.constructor = function(args) {
			this.args = args//for future use
			this.name = args.name
			this.temperature_Locator = args.temperature_Locator
			this.comment_line_Locator = args.comment_line_Locator
			this.mode = args.mode
			this.loadLocalCache()
		};
		this.constructor(args);
	};
	
	function processWeatherResponse(instance){
		return function (data) {
   			var target = indicators[instance.link_to_instance];
   			target.saveWeatherDataFromWundergroundAPI(data);
   			target.showWeather({
					'cache' : false
					})
 		}
	}

	var indicators = [];
	
	// Use the object, passing in an initializer:
	indicators.mainWeatherIndicator = new WeatherIndicator({
		name: 'mainWeatherIndicator',
		temperature_Locator : $("#temp"),
		comment_line_Locator : $("#time"),
		mode : 'autoip'
	});

	indicators.mainWeatherIndicator.refresh();
	
}); 