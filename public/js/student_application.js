$(document).ready(function() {
    var date = new Date();

    //$('#dob').datepicker('update');
    $('#dob').datepicker({
        "setDate": '-3y',
        "autoclose": true
    });
    //alert("test");
});
