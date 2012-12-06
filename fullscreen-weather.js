$(document).ready(function () {
    var key = "weather.time";
    var delay = 300000;
    var prev_time = localStorage[key];
    var curr_time = $.now();
    if ((typeof(prev_time) == "undefined") || (prev_time + delay < curr_time )) {
        localStorage[key] = curr_time;
        $.ajax({
            url: "http://api.wunderground.com/api/" + $.parseQuery().key + "/conditions/q/autoip.json",
            dataType: "jsonp",
            success: function (data) {
                $("#temp").text(data.current_observation.temp_c);
                $("#time").text(data.current_observation.observation_time);
            },
            error: function () {
                alert("Can't get the current weather conditions");
            }
        });
    }
});