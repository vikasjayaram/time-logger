$(document).ready(function() {
//  alert('I am ready');
    TableTools.DEFAULTS.aButtons = [ "pdf", "csv", "xls"];
    var nEditing = null;
    var deleteData = null;
    var oTable = $('#clientList').dataTable( {});
    var oTable = $('#clientList').dataTable( {
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
        "sAjaxSource": "/client/getAllData",
        "aoColumns":[
          {"mData": "_id", "bSearchable": false, "sClass": "center", "sWidth": "8%"},

          {"mData": "name"},
          {"mData": "money", "sWidth": "15%"},
          {"mData":  function (obj) {
              var status = '';
              if (obj.status === "active") {
                  status = '<span class="glyphicon glyphicon-eye-open">';
              } else {
                status = '<span class="glyphicon glyphicon-eye-close">';
              }
              return status;
          }, "sClass": "center", "sWidth": "20%"},          {
              "mDataProps": null,
              "sDefaultContent": '<p><a class="btn btn-primary btn-xs" href="#edit_client"><span class="glyphicon glyphicon-pencil"></span></a></p><p><a class="btn btn-danger btn-xs" href="#delete_client"><span class="glyphicon glyphicon-trash"></span></a></p>',
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
    $('#clientList').on('click', 'a[href="#edit_client"]', function (e) {
        e.preventDefault();
        //oTable.fnSetColumnVis( 0, true );
        var nRow = $(this).parents('tr')[0];
        editClientRow( oTable, nRow );
        nEditing = nRow;
    } );
    $('#clientList').on('click', 'a[href="#delete_client"]', function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var aData = oTable.fnGetData(nRow);
        console.log(JSON.stringify(aData));
        deleteData = aData;
        $('#deleteClient input#_id').val(aData._id)
        $('#deleteClient').modal('show');
        //alert('Click');
    });
    $('#modal-delete-client-btn').click(function (e) {
        $.ajax({
          type: "POST",
          url: '/client/delete',
          data: deleteData,
          success: function (data, status) {
            //window.location = '/clients';
          },
          error: function (data, status) {
            alert('Something Bad Happened!! Try again later');
          }
        });
        $('#deleteClient').modal('hide');
    });
});

function editClientRow ( oTable, nRow )
{
    var aData = oTable.fnGetData(nRow);
    console.log(JSON.stringify(aData));
    $("#editClient input#_id").val(aData._id);
    $("#editClient input#name").val(aData.name);
    $("#editClient input#money").val(aData.money);
    $('#editClient select#status').val(aData.status);
    $('#editClient').modal('show');

}
