$(document).ready(function () {
    var key = $.parseQuery().key;
    $.ajax({
        url: "http://api.wunderground.com/api/" + key + "/conditions/q/autoip.json",
        dataType: "jsonp",
        success: function (data) {
            $("#temp").text(data.current_observation.temp_c);
        },
        error: function () {
            alert("Can't get the current weather conditions");
        }
    });
});