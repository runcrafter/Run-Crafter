var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

$(function() {
    $("#searchInput").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "https://nominatim.openstreetmap.org/search?format=json",
                dataType: "json",
                data: {
                    q: request.term
                },
                success: function(data) {
                    response($.map(data, function(item) {
                        return {
                            label: item.display_name,
                            value: item.display_name,
                            lat: item.lat,
                            lon: item.lon
                        };
                    }));
                }
            });
        },
        minLength: 2,
        select: function(event, ui) {
            var latlng = [parseFloat(ui.item.lat), parseFloat(ui.item.lon)];
            map.setView(latlng, 13);
            L.marker(latlng).addTo(map);
        }
    });
});

function searchPlace() {
    var query = document.getElementById('searchInput').value;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var result = data[0];
                var latlng = [result.lat, result.lon];
                map.setView(latlng, 13);
                L.marker(latlng).addTo(map);
            } else {
                alert('Place not found');
            }
        })
        .catch(error => console.error('Error:', error));
}
