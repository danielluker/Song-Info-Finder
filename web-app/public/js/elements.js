var loading = $('#spinner').hide();

$(document)
// $('')
  .ajaxStart(function () {
    loading.show();
    // console.log("Show");
  })
  .ajaxStop(function () {
    loading.hide();
    // console.log("Hide");
  }
);

$.get('recent_queries', function(result) {
	var scope = 
		angular
		.element($('#recent-queries'))
		// .controller()
		.scope();

		scope.$apply(function() {
			scope.addRecentQueries(result.recent);
			// TODO modify to send entire object to controller
		});
	}
);

$('#spinner').hide(); // Deliberately hiding for the first ajax call
