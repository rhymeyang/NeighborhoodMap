var app = app || {};

// currentCity: ko.observable(app.map.currentCity),
(function($){
    app.ViewModel = {
    currentCity: ko.observable(),
    areaFilter : ko.observable(),
    cleanFilter: function(){
        this.areaFilter('');
        for(let item of app.ViewModel.markArray()){
            item.mark.setMap(app.map.mapObj);
        }
        // app.map.mapObj.setCenter([121.476200, 31.229670])
    },
    selectedLocation: ko.observable(),
    locations: ko.observableArray(),
    markArray: ko.observableArray(),
    selectChanged: function(data){
        app.ViewModel.selectLocation(app.ViewModel.selectedLocation());
    },
    filterLocations: ko.computed(function(){
        if ( app.ViewModel.areaFilter()){
             let re = new RegExp(app.ViewModel.areaFilter(),'i');
            let result = [];

            let ids = [];
            for(let location of app.ViewModel.locations() ){
                if(location.title.match(re)){
                    result.push(location);
                    ids.push(location.id);
                }
            }
            if (result.length >0){
                app.map.mapObj.setCenter([result[0].location.lng, result[0].location.lat])
            }
            for(let item of app.ViewModel.markArray()){
                if (ids.includes(item.id)){
                    console.log(`set mark ${item.id}`);
                    item.mark.setMap(app.map.mapObj);
                } else{
                    item.mark.setMap(null);
                }
            }

            return result;
        }
        else {

            return app.ViewModel.locations();
        }

    }, this, {pure: true}),
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


