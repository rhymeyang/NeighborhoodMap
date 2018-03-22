/*global Backbone */
var app = app || {};




(function($){
    app.map = app.map || {};
    app.map.currentCity="当前城市更新中";

    getJson();

    // fix on Shanghai
    app.map.init = function mapInit(){
        // center: [116.397428, 39.90923]
        // center: [121.476200, 31.229670]
        //
         app.map.mapObj =  new AMap.Map('map-container', {
            resizeEnable: true,
            zoom : 13,
            animateEnable: true,
            center: [121.476200, 31.229670]
        });
        getCityInfo();
        initMark();

    };

     function getCityInfo(){
        //实例化城市查询类
        app.map.citySearch = app.map.citySearch || new AMap.CitySearch();

        let mapObj = app.map.mapObj;
        //自动获取用户IP，返回当前城市
        app.map.citySearch.getLocalCity(function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                if (result && result.city && result.bounds) {
                    var cityinfo = result.city;
                    // var citybounds = result.bounds;
                    app.ViewModel.currentCity(cityinfo);
                    //地图显示当前城市
                    // mapObj.setBounds(citybounds);
                }
            } else {
                app.ViewModel.currentCity(result.info);

            }
        });
    };



    function initMark(){
        AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'], function(MarkerList, SimpleMarker, SimpleInfoWindow) {

            let mapObj = app.map.mapObj;

            app.map.marks= {
                defaultIconStyle: 'red', //默认的图标样式
                hoverIconStyle : 'green', //鼠标hover时的样式
                selectedIconStyle : 'purple' //选中时的图标样式
            }

            let infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -20) });
            // infoWindow.on('close', this.onInfoWindowClose.bind(this));

            let markArray = app.ViewModel.locations().map(function(item){
                    let itemMark =  new SimpleMarker({
                        iconLabel: String.fromCharCode('A'.charCodeAt(0) + item.id),
                        // iconStyle: 'img/mark_b.png',
                        iconStyle: app.map.marks.defaultIconStyle,
                        title: item.title,

                        //设置基点偏移
                        offset: new AMap.Pixel(-19, -60),
                        map: app.map.mapObj,
                        showPositionPoint: true,
                        animation: 'AMAP_ANIMATION_DROP',
                        clickable: true,
                        position: [item.location.lng, item.location.lat],
                        zIndex: 100
                    });

                    itemMark.on('click', function(e){
                        showInfoWindow(e);
                    });
                    itemMark.on('mouseover', function(e){
                        this.setIconStyle(app.map.marks.hoverIconStyle);
                    });
                    itemMark.on('mouseout', function(e){
                        this.setIconStyle(app.map.marks.defaultIconStyle);
                    });

                    return {id: item.id, mark: itemMark}
                });
            app.ViewModel.markArray(markArray);

             function showInfoWindow(e) {
                infoWindow.setContent('Loading');
                let title = e.target.opts.title;
                console.log(title);
                searchFromBaike(title).then((result) => {
                    infoWindow.setContent(`<h3>${result.title}</h3><p>${result.abstract.substring(0,80)}</p>`);},
                    (msg) => {
                    infoWindow.setContent(`<p>An error occured, infomation:</p><p>${msg.statusText}</p>`);
                });
                infoWindow.open(mapObj, e.target.getPosition());
        }

        });
    }

    function getJson(){
        let url = './data/location.json';
        fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log("get init locations success");
            app.ViewModel.locations(data);
            // app.map.locations = data;
        })
        .catch(function(err){
            console.log(err);
            // app.map.locations = [];
        })
    }

    function searchFromWikipedia(key_word){
        let url = `https://zh.wikipedia.org/w/api.php?action=query&titles=${key_word}&redirects=&converttitles=&prop=revisions&rvprop=content&format=json`;
    }



    function searchFromBaike(key) {
        let baikeUrl = `https://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_key=${key}&bk_length=600`;
        baikeUrl=encodeURI(baikeUrl);

        return new Promise((resolve, reject) => {
            console.log('search ' + key);
            console.log(baikeUrl);
            jQuery.ajax({
                type: 'get',
                url: baikeUrl,
                dataType: 'jsonp',
                success: (result) => {
                    resolve(result);
                },
                error: (msg) => {
                    console.log(msg);
                    reject(msg);
                }
            });
        });
    }


})(this);






