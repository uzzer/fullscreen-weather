$(document).ready(function () {
    var key = $.parseQuery().key;
    var update = function () {
        $.ajax({
            url: "http://api.wunderground.com/api/" + key + "/conditions/q/autoip.json",
            dataType: "jsonp",
            success: function (data) {
                $("#temp").text(data.current_observation.temp_c);
                $("#time").text(data.current_observation.observation_time);
            },
            error: function () {
                alert("Can't get the current weather conditions");
            }
        });
    };
    update();
    setInterval(update, 300000);
});