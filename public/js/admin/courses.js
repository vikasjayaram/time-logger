$(document).ready(function() {
//  alert('I am ready');
    TableTools.DEFAULTS.aButtons = [ "pdf", "csv", "xls"];
    var nEditing = null;
    var deleteData = null;
    var oTable = $('#courseList').dataTable( {});
    var oTable = $('#courseList').dataTable( {
        //"sDom": "<'row'<'dataTables_header clearfix'<'col-md-12'Tf>r>>t<'row'<'dataTables_footer clearfix'<'col-md-6'i><'col-md-6'p>>>",
        "sDom": "<'row'<'col-6'Tf><'col-6'l>r>t<'row'<'col-6'i><'col-6'p>>",
        "oTableTools": {
              "sSwfPath": "../../../css/TableTools/swf/copy_csv_xls_pdf.swf",
              "aButtons": [
                  {
                      "sExtends": "csv",
                      "sButtonText": "CSV",
                      "mColumns": [ 1, 2, 3, 4, 5]
                  },
              ]
        },

        "iDisplayLength": 100,
        //"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "bProcessing": true,
        "bDestroy": true,
        "sAjaxSource": "/getCourseList",
        "aoColumns":[
          {"mData": "_id", "bSearchable": false, "sClass": "center", "sWidth": "8%"},
          {"mData":  function (obj) {
              var status = '';
              if (obj.status === "active") {
                  status = '<span class="glyphicon glyphicon-eye-open">';
              } else {
                status = '<span class="glyphicon glyphicon-eye-close">';
              }
              return status;
          }, "sClass": "center"},
          {"mData": "courseCode", "sWidth": "15%"},
          {"mData": "courseName", "sWidth": "20%"},
          {"mData": "cricosCode", "sWidth": "15%"},
          {"mData": function (obj) {
              var details = '';
              details = '<b>Duration :</b> ' + obj.duration + ' Weeks<br/>';
              details += '<b>Study Weeks :</b> ' + obj.studyWeeks + ' Weeks<br/>';
              details += '<b>Holiday Weeks :</b> ' + obj.holidayWeeks + ' Weeks<br/>';
              details += '<b>Tution Fee :</b> $' + obj.tutionFee + '<br/>';
              details += '<b>Material Fee :</b> $' + obj.materialFee + '<br/>';
              return details;
            }, "sWidth": "25%"
          },
          {
              "mDataProps": null,
              "sDefaultContent": '<p><a class="btn btn-primary btn-xs" href="#edit_course"><span class="glyphicon glyphicon-pencil"></span></a></p><p><a class="btn btn-danger btn-xs" href="#delete_course"><span class="glyphicon glyphicon-trash"></span></a></p>',
              "sWidth": "10%",
              "sClass": "center"
          }
        ],
        "fnDrawCallback":function(oSettings){
      if ( oSettings.bSorted || oSettings.bFiltered )
      {
        for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
        {
          $('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
        }
      }
        }

    });
    $('#courseList').on('click', 'a[href="#edit_course"]', function (e) {
        e.preventDefault();
        //oTable.fnSetColumnVis( 0, true );
        var nRow = $(this).parents('tr')[0];
        /*
        if ( nEditing !== null && nEditing != nRow ) {
            // A different row is being edited - the edit should be cancelled and this row edited
            //restoreRow( oTable, nEditing );
            //editRow( oTable, nRow );
            //nEditing = nRow;
        }
        else if ( nEditing == nRow && this.innerHTML == "Update" ) {
            // This row is being edited and should be saved
            //saveRow( oTable, nEditing );
            nEditing = null;
        }
        else if ( nEditing == nRow && this.innerHTML == "Cancel" ) {
            // This row is being edited and should be saved
            //saveRowNoChange( oTable, nEditing );
            nEditing = null;
        }
        else {
            // No row currently being edited
            editRow( oTable, nRow );
            nEditing = nRow;
        }
        */
        editRow( oTable, nRow );
        nEditing = nRow;
    } );
    $('#courseList').on('click', 'a[href="#delete_course"]', function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var aData = oTable.fnGetData(nRow);
        console.log(JSON.stringify(aData));
        deleteData = aData;
        $('#deleteCourse input#_id').val(aData._id)
        $('#deleteCourse').modal('show');
        //alert('Click');
    });
    $('#modal-delete-course-btn').click(function (e) {
        $.ajax({
          type: "POST",
          url: '/deleteCourse/' + deleteData._id,
          data: deleteData,
          success: function (data, status) {
            //window.location = '/courses';
          },
          error: function (data, status) {
            alert('Something Bad Happened!! Try again later');
          }
        });
        $('#deleteCourse').modal('hide');
    });
});

function editRow ( oTable, nRow )
{
    var aData = oTable.fnGetData(nRow);
    console.log(JSON.stringify(aData));
    $("#editCourse input#_id").val(aData._id);
    $("#editCourse input#courseCode").val(aData.courseCode);
    $("#editCourse input#courseName").val(aData.courseName);
    $("#editCourse input#cricosCode").val(aData.cricosCode);
    $("#editCourse input#duration").val(aData.duration);
    $("#editCourse input#studyWeeks").val(aData.studyWeeks);
    $("#editCourse input#holidayWeeks").val(aData.holidayWeeks);
    $("#editCourse input#tutionFee").val(aData.tutionFee);
    $("#editCourse input#materialFee").val(aData.materialFee);
    $("#editCourse #studyPeriod").text(aData.studyPeriod);
    $('#editCourse select#status').val(aData.status);
    $('#editCourse').modal('show');

}
