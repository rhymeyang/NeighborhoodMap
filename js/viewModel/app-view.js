var app = app || {};

// currentCity: ko.observable(app.map.currentCity),
(function($){
    app.ViewModel = {
    currentCity: ko.observable(),
    // areaFilter : ko.observable("选择感兴趣的地点"),
    selectedLocation: ko.observable(),
    locations: ko.observableArray(),
    markArray: ko.observableArray(),
    selectChanged: function(data){
        app.ViewModel.selectLocation(app.ViewModel.selectedLocation());
    },
    selectLocation: function(data){
        if (typeof(data) === 'undefined'){
            return;
        }
        // console.log(data);
        app.ViewModel.selectedLocation(data);
        for (let item of app.ViewModel.markArray()){
            if (item.id === data.id){
                item.mark.setIconStyle(app.map.marks.selectedIconStyle);
                app.map.mapObj.setCenter([data.location.lng, data.location.lat])
            }
            else{
                item.mark.setIconStyle(app.map.marks.defaultIconStyle);
            }
        }
    }

}
// observableArray
ko.applyBindings(app.ViewModel);
})(this);


