/*global Backbone */
var app = app || {};




(function($){
    app.map = app.map || {};

    app.map.currentCity="当前城市更新中";

    app.map.locations = [
        {id: 0, title: '人民广场', location: {lat: 31.229670, lng: 121.476200}, address: "上海市黄浦区人民大道120号"},
        {id: 1, title: '杜莎夫人蜡像馆', location: {lat: 31.234590, lng: 121.473410}, address: " 上海市黄浦区南京西路68号新世界城10层"},
        {id: 2, title: '环球金融中心', location: {lat: 31.234870, lng: 121.507400}, address: "上海市浦东新区世纪大道100号"},
        {id: 3, title: '外滩观光隧道', location: {lat: 31.239800, lng: 121.490410}, address: "上海市黄浦区中山东一路外滩"},
        {id: 4, title: '马勒别墅', location: {lat: 31.223030, lng: 121.456260}, address: "上海市静安区陕西南路30号"},
        {id: 5, title: '朱家角', location: {lat: 31.112570, lng: 121.050530}, address: "上海市青浦区朱家角"},
        {id: 6, title: '泰晤士小镇', location: {lat: 31.0293500, lng: 121.197840}, address: "上海市松江区三新北路900弄"},
        {id: 7, title: '海湾国家森林公园', location: {lat: 30.860830, lng: 121.686410}, address: "上海市奉贤区随塘河路1677号"},
         {id: 8, title: '迪士尼乐园', location: {lat: 31.144190, lng: 121.660340}, address: "上海市浦东新区川沙新镇赵行村"},
         {id: 2, title: '野生动物园', location: {lat: 31.055220, lng: 121.722160}, address: "中国上海市上海市浦东新区南六公路178号"}

      ];

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

            let markArray = app.map.locations.map(function(item){
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

    function searchFromWikipedia(key_word){
        let url = `https://zh.wikipedia.org/w/api.php?action=query&titles=${key_word}&redirects=&converttitles=&prop=revisions&rvprop=content&format=json`;
    }



    function searchFromBaike(key) {
        // let url = `https://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=9886122&bk_key=${key}&bk_length=600`;
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






