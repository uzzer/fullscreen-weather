$(document).ready(function () {
    var delay = 10 * 60 * 1000;

    var key = "fullscreen-weather";
    var key_time = key + "." + "time";
    var key_values = key + "." + "values";

    var status = function (message) {
        $("#status").text(message);
    };

    if (!localStorage) {
        status("The browser doesn't support local storage");
        return;
    }

    var then = localStorage[key_time];
    var now = $.now();

    var update = function (values) {
        $("#place").text(values.place);
        $("#temp").text(values.temp);
        status(values.text);
    };

    if (then && (Number(then) + delay > now)) {
        update(JSON.parse(localStorage[key_values]));
        return;
    }

    $.ajax({
        url: "http://api.wunderground.com/api/" + $.parseQuery().key + "/conditions/q/autoip.json",
        dataType: "jsonp",
        success: function (data) {
            localStorage[key_time] = now;

            if (data.response.error) {
                status(data.response.error.description);
                return;
            }

            var values = {
                place: data.current_observation.display_location.full,
                temp: data.current_observation.temp_c,
                text: data.current_observation.observation_time
            };
            localStorage[key_values] = JSON.stringify(values);
            update(values);
        },
        error: function () {
            status("Can't get the current weather conditions");
        }
    });
});