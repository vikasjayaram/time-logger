$(document).ready(function() {
//  alert('I am ready');
    TableTools.DEFAULTS.aButtons = [ "pdf", "csv", "xls"];
    var nEditing = null;
    var deleteUser = null;
    var oTable = $('#usersList').dataTable( {});
    var oTable = $('#usersList').dataTable( {
        //"sDom": "<'row'<'dataTables_header clearfix'<'col-md-12'Tf>r>>t<'row'<'dataTables_footer clearfix'<'col-md-6'i><'col-md-6'p>>>",
        "sDom": "<'row'<'col-6'Tf><'col-6'l>r>t<'row'<'col-6'i><'col-6'p>>",
        "oTableTools": {
              "sSwfPath": "../../../css/TableTools/swf/copy_csv_xls_pdf.swf",
              "aButtons": [
                   {
                       "sExtends": "csv",
                       "sButtonText": "CSV",
                       "mColumns": [1, 2, 3, 4, 5 ]
                   },
              ]
        },
        "iDisplayLength": 100,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "bProcessing": true,
        "bDestroy": true,
        "sAjaxSource": "/getUsersList",
        "aoColumns":[
          {"mData": "_id", "bSearchable": false, "sClass": "center", "sWidth": "8%"},
          {"mData": "profile.name", "sWidth": "15%"},
          {"mData": "profile.location", "sWidth": "10%"},
          {"mData": "profile.phoneNumber", "sWidth": "10%"},
          {"mData": "email", "sWidth": "15%"},
          {"mData": "role", "sWidth": "8%"},
          {
              "mDataProps": null,
              "sDefaultContent": '<p><a class="btn btn-primary btn-xs" href="#edit_user"><span class="glyphicon glyphicon-pencil"></span></a></p><p><a class="btn btn-danger btn-xs" href="#delete_user"><span class="glyphicon glyphicon-trash"></span></a></p>',
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
    $('#usersList').on('click', 'a[href="#edit_user"]', function (e) {
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
        editUserRow( oTable, nRow );
        nEditing = nRow;
    } );

    $('#usersList').on('click', 'a[href="#delete_user"]', function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var aData = oTable.fnGetData(nRow);
        console.log(JSON.stringify(aData));
        deleteUser = aData;
        $('#deleteUser input#_id').val(aData._id)
        $('#deleteUser').modal('show');
        //alert('Click');
    });
    $('#modal-delete-user-btn').click(function (e) {
        $.ajax({
          type: "POST",
          url: '/deleteUser/' + deleteUser._id,
          data: deleteUser,
          success: function (data, status) {
            window.location = '/users';
          },
          error: function (data, status) {
            alert('Something Bad Happened!! Try again later');
          }
        });
        $('#deleteUser').modal('hide');
    });
});

function editUserRow ( oTable, nRow )
{
    var aData = oTable.fnGetData(nRow);
    console.log(JSON.stringify(aData));
    $("#editUser input#_id").val(aData._id);
    $("#editUser input#name").val(aData.profile.name);
    $("#editUser input#location").val(aData.profile.location);
    $("#editUser input#phoneNumber").val(aData.profile.phoneNumber);
    $("#editUser input#editEmail").val(aData.email);
    $("#editUser select#editRole").val(aData.role);
    $('#editUser').modal('show');

}
