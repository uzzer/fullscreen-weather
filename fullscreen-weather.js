$(document).ready(function () {
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
});