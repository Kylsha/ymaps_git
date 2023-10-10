var heading, yaw
var url = new URL("https://pereverzev.info/ymaps_test/?x=1&y=2&heading=3&yaw=4");
const queryString = window.location.search;

// const urlParams = new window.URLSearchParams(queryString);
var currentURL = window.location.href;
var urlParams = getURLParameters(currentURL);


var x = Number(urlParams.x)
var y = Number(urlParams.y)
var heading = Number(urlParams.heading)
var yaw = Number(urlParams.yaw)
// https://pereverzev.info/ymaps_test/?x=37.4132&y=55.7722&h=0&y=85

function getURLParameters(url) {
    var params = {};
    var urlParts = url.split("?");
    if (urlParts.length > 1) {
        var paramPairs = urlParts[1].split("&");
        for (var i = 0; i < paramPairs.length; i++) {
            var pair = paramPairs[i].split("=");
            if (pair.length === 2) {
                params[pair[0]] = decodeURIComponent(pair[1]);
            }
        }
    }
    return params;
}

function get_hs(player){
    heading = player.getDirection()[0].toFixed(2)
    yaw = player.getSpan()[0].toFixed(2)
    pano_pos = player.getPanorama().getPosition()
    // console.log('-->', pano_pos)
    x = pano_pos[0].toFixed(4)
    y = pano_pos[1].toFixed(4)
    
    /*
    url.searchParams.set('x', y);
    url.searchParams.set('y', x);
    url.searchParams.set('heading', heading);
    url.searchParams.set('yaw', yaw);
    // window.location = url;
    history.pushState({}, null, url);
    */
    console.log(pano_pos, heading, yaw)
}
ymaps.ready(function () {
    // Для начала проверим, поддерживает ли плеер браузер пользователя.
    if (!ymaps.panorama.isSupported()) {
        // Если нет, то просто ничего не будем делать.
        return;
    }
    
    console.log(x, y)

    // Ищем панораму в переданной точке.
    ymaps.panorama.locate([y, x]).done(
        function (panoramas) {
            // Убеждаемся, что найдена хотя бы одна панорама.
            if (panoramas.length > 0) {
                // Создаем плеер с одной из полученных панорам.
                var player = new ymaps.panorama.Player(
                        'player1',
                        // Панорамы в ответе отсортированы по расстоянию
                        // от переданной в panorama.locate точки. Выбираем первую,
                        // она будет ближайшей.
                        panoramas[0],
                        // Зададим направление взгляда, отличное от значения
                        // по умолчанию.
                        { direction: [heading, 0],
                          span:[yaw, yaw],
                          controls: []
                            
                        }
                    );
                    player.events.add('directionchange', function () {
                        get_hs(player)
                    });
                    player.events.add('spanchange', function () {
                        get_hs(player)
                     });
                    player.events.add('panoramachange', function () {
                        get_hs(player)
                     });
                    
                     
                  
                    
            }
            $('[class*=panorama-control]').css({"display":"none"});
        },
        function (error) {
            // Если что-то пошло не так, сообщим об этом пользователю.
            alert(error.message);
        }
    );
    
    // Для добавления панорамы на страницу также можно воспользоваться
    // методом panorama.createPlayer. Этот метод ищет ближайщую панораму и
    // в случае успеха создает плеер с найденной панорамой.
    /*
    ymaps.panorama.createPlayer(
       'player2',
       [59.938557, 30.316198],
       // Ищем воздушную панораму.
       { layer: 'yandex#airPanorama' }
    )
        .done(function (player) {
            // player – это ссылка на экземпляр плеера.
        });
    */
});
