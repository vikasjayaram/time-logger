var activeEl = 0;
$(document).ready(function() {
	$("#menu-toggle").click(function(e) {
	        e.preventDefault();
	        $("#wrapper").toggleClass("active");
	});
    //$('.datepicker').datepicker();
    // var items = $('.btn-nav');
    // $( items[activeEl] ).addClass('active');
    // $( ".btn-nav" ).click(function() {
    //     $( items[activeEl] ).removeClass('active');
    //     $( this ).addClass('active');
    //     activeEl = $( ".btn-nav" ).index( this );
    // });
});
