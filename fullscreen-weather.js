$(document).ready(function () {
    var weather_version = "1";
    var delay = 10 * 60 * 1000;

    var weather_base = "http://api.wunderground.com/api/";
    var weather_location = "/q/autoip.json";
    var weather_current = "/conditions" + weather_location;
    var weather_hourly = "/hourly" + weather_location;

    var key = "fullscreen-weather";
    var key_time = key + "." + "time";
    var key_current = key + "." + "current";
    var key_hourly = key + "." + "hourly";
    var key_version = key + "." + "version";


	var today_is_winter = function (){
		var this_year = new Date().getFullYear();
		var start_of_winter = new Date(this_year,12,1);
		var end_of_winter = new Date(this_year,3,1);
		var today = new Date();
		return ( today > start_of_winter || today < end_of_winter)
	}
	
	if (today_is_winter()){
    	$.fn.snow({minSize: 5, maxSize: 50, newOn: 500, flakeColor: '#FFFFFF'});
    }

    var status = function (message) {
        $("#status").text(message);
    };

    if (!localStorage) {
        status("The browser doesn't support local storage");
        return;
    }

    if (localStorage[key_version] != weather_version) {
        localStorage.clear();
        localStorage[key_version] = weather_version;
    }

    var then = localStorage[key_time];
    var now = $.now();

    var update_current = function (weather) {
        $("#temp").text(weather.temp);
        status("Measured at " + weather.time + " in " + weather.place);
    };

    var update_hourly = function (weather) {
        $("#hourly").children().each(function (i) {
            $(this).find(".time").text(weather[i].time);
            $(this).find(".temp").text(weather[i].temp);
        });
    };

    if (then && (Number(then) + delay > now)) {
        update_current(JSON.parse(localStorage[key_current]));
        update_hourly(JSON.parse(localStorage[key_hourly]));
        return;
    }

    $.ajax({
        url: weather_base + $.parseQuery().key + weather_current,
        dataType: "jsonp",
        success: function (data) {
            localStorage[key_time] = now;

            if (data.response.error) {
                status(data.response.error.description);
                return;
            }

            var format_time = function (epoch) {
                var pad = function (number) {
                    return number < 10 ? "0" + number : String(number)
                };

                var date = new Date(Number(epoch) * 1000);
                return pad(date.getHours()) + ":" + pad(date.getMinutes());
            };

            var weather = {
                place: data.current_observation.display_location.full,
                temp: data.current_observation.temp_c,
                time: format_time(data.current_observation.observation_epoch)
            };
            localStorage[key_current] = JSON.stringify(weather);
            update_current(weather);
        },
        error: function () {
            status("Can't get the current weather conditions");
        }
    });

    $.ajax({
        url: weather_base + $.parseQuery().key + weather_hourly,
        dataType: "jsonp",
        success: function (data) {
            localStorage[key_time] = now;

            if (data.response.error) {
                status(data.response.error.description);
                return;
            }

            var weather = [];
            for (var i = 0; i < data.hourly_forecast.length; i++) {
                weather[i] = {
                    time: data.hourly_forecast[i].FCTTIME.hour_padded + ":" + data.hourly_forecast[i].FCTTIME.min,
                    temp: data.hourly_forecast[i].temp.metric
                }
            }
            localStorage[key_hourly] = JSON.stringify(weather);
            update_hourly(weather);
        },
        error: function () {
            status("Can't get hourly weather forecast");
        }
    });
});