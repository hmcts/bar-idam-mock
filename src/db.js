export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	var db = (function(){
		var storage = {};
		var bin = {};
		return ({
			insert: function(value){
				let key = value.sub;
				storage[key] = value;
				return key;
			},
			list: function(){
				return Object.keys(storage).map(key => {
					return storage[key];
				});
			},
			find: function(sub){
				return storage[sub];
			}
		});		
	})();
	
	callback(db);
}
