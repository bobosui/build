Tea.context(function () {
	this.isLoaded = false;
	this.values = [];
	this.lastId = "";

	this.$delay(function () {
		this.testMongo();
		this.loadValues();
	});

	this.loadValues = function () {
		this.$post("$")
			.params({
				"agentId": this.agentId,
				"appId": this.app.id,
				"itemId": this.item.id,
				"lastId": this.lastId
			})
			.success(function (resp) {
				if (resp.data.values.length == 0) {
					return;
				}
				this.lastId = resp.data.values.$first().id;
				this.values = resp.data.values.$map(function (k, v) {
					v.datetime = v.timeFormat.second.substr(0, 4) + "-" + v.timeFormat.second.substr(4, 2) + "-" + v.timeFormat.second.substr(6, 2) + " " + v.timeFormat.second.substr(8, 2) + ":" + v.timeFormat.second.substr(10, 2) + ":" + v.timeFormat.second.substr(12);
					v.value = JSON.stringify(v.value);
					return v;
				}).concat(this.values);
			})
			.fail(function (resp) {
				if (resp != null) {
					console.log(resp.message);
				}
			})
			.done(function () {
				this.isLoaded = true;

				this.$delay(function () {
					this.loadValues();
				}, 3000);
			});
	};

	this.clearValues = function () {
		this.$post("/agents/apps/clearItemValues")
			.params({
				"agentId": this.agentId,
				"appId": this.app.id,
				"itemId": this.item.id
			})
			.refresh();
	};
});