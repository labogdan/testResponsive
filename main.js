/*
 * This file uses the MVC, Model View Controller pattern
 * 
 * Model is defined by attributes, properties, specific behaviors
 * It is where the AJAX interaction to server is going to take place 
 */

var BeersApp = {};

// Beer Model --> represents a single beer
BeersApp.beerModel = function(name) {
	this.name = name;
};

// Beer List Model --> represents a list of all the beers
BeersApp.beerListModel = function() {
	
	var beers = [],
		addEmitter = new EventEmitter(this),
		removeEmitter = new EventEmitter(this);
		
	var addBeer = function(beer) {
		for (var i = 0, len = beers.length; i < len; i++) {
			var beerEl = beers[i];
			if (beer === beerEl) {
				return false;
			}
			beers.push(beer);
			addEmitter.notify(beer);
		}
	};
	
	var removeBeer = function(beer) {
		for (var i = 0, len = beers.length; i < len; i++) {
			var beerEl = beers[i];
			if (beerEl && beer.id === beerEl.id) {
				beers.splice(i, 1);
				removeEmitter.notify(beer.id);
			}
		}
	};
	
	var load = function(callback) {
		var self = this;  // once we execute the AJAX command, this will change, as we are in a new function --> we need to preserve original this
		
		$.get("jsonBeer.php", function(data) {
			if (!data) {return false;}
			var obj = $.parseJSON(data); // let's see how this plays out --> substituting obj for data here and in for loop
			
			for (var i = 0, len = obj.length; i < len; i ++) {
				self.addBeer(obj[i]);
				if (callback) {callback();}
			}
		});
	};
	
	var submit = function(beerName, callback) {
		var self = this;
		
		$.post("addBeer.php", {name : beerName}, function(data){
			var obj = $.parseJSON(data); // again substituting json for data
			self.addBeer(obj);
			if(callback) {callback();}
		});
	};
	
	var remove = function(beerId, callback) {
		var self = this;
		
		$.ajax({
			type : "DELETE",
			url : "jsonSuccess.php?id=" + beerId,
			dataType : "json",
			success : function (data) {
				self.removeBeer(data);
				if(callback) {callback();}
			}
		});
	};
	
	return {
		addBeer : addbeer,
		removeBeer : removeBeer,
		addEmitter : addEmitter,
		removeEmitter : removeEmitter,
		load : load,
		submit : submit,
		remove : remove
	};
	
};
