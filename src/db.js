export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	var db = (function(){
		var storage = {};
		var bin = {};
		return ({
			insert: function(value){
				let key = value.email;
				storage[key] = value;
				return key;
			},
			list: function(){
				return Object.keys(storage).map(key => {
					return storage[key];
				});
			},
			find: function(email){
				return storage[email];
			}
		});		
	})();
	
	callback(db);
}
