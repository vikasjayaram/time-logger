$(document).ready(function() {
//  alert('I am ready');
    TableTools.DEFAULTS.aButtons = [ "pdf", "csv", "xls"];
    var nEditing = null;
    var deleteData = null;
    var oTable = $('#logList').dataTable( {});
    var oTable = $('#logList').dataTable( {
        //"sDom": "<'row'<'dataTables_header clearfix'<'col-md-12'Tf>r>>t<'row'<'dataTables_footer clearfix'<'col-md-6'i><'col-md-6'p>>>",
        "sDom": "<'row'<'col-6'Tf><'col-6'l>r>t<'row'<'col-6'i><'col-6'p>>",
        "oTableTools": {
              "sSwfPath": "../../../css/TableTools/swf/copy_csv_xls_pdf.swf",
              "aButtons": [
                  {
                      "sExtends": "csv",
                      "sButtonText": "CSV",
                      "mColumns": [ 1, 2, 3, 4, 5, 6]
                  },
              ]
        },

        "iDisplayLength": 100,
        //"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "bProcessing": true,
        "bDestroy": true,
        "sAjaxSource": "/logtime/getAllData",
        "aoColumns":[
          {"mData": "_id", "bSearchable": false, "sClass": "center", "sWidth": "8%"},

          {"mData":function(obj) {return moment(obj['date']).format('DD/MM/YYYY')}, "sWidth": "7%"},
          {"mData": "name", "sWidth": "15%"},
          {"mData": "clientName", "sWidth": "15%"},
          {"mData": "projectName", "sWidth": "15%"},
          {"mData": "hours", "sWidth": "15%"},
          {"mData": "description", "sWidth": "15%"},
          {
              "mDataProps": null,
              "sDefaultContent": '<p><a class="btn btn-primary btn-xs" href="#edit_log"><span class="glyphicon glyphicon-pencil"></span></a></p><p><a class="btn btn-danger btn-xs" href="#delete_log"><span class="glyphicon glyphicon-trash"></span></a></p>',
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
    $('#logList').on('click', 'a[href="#edit_log"]', function (e) {
        e.preventDefault();
        //oTable.fnSetColumnVis( 0, true );
        var nRow = $(this).parents('tr')[0];
        editRow( oTable, nRow );
        nEditing = nRow;
    } );
    $('#logList').on('click', 'a[href="#delete_log"]', function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var aData = oTable.fnGetData(nRow);
        console.log(JSON.stringify(aData));
        deleteData = aData;
        $('#deleteLogEntry input#_id').val(aData._id)
        $('#deleteLogEntry').modal('show');
        //alert('Click');
    });
    $('#modal-delete-log-btn').click(function (e) {
        $.ajax({
          type: "POST",
          url: '/logtime/delete',
          data: deleteData,
          success: function (data, status) {
            //window.location = '/logs';
          },
          error: function (data, status) {
            alert('Something Bad Happened!! Try again later');
          }
        });
        $('#deleteLogEntry').modal('hide');
    });
});

function editRow ( oTable, nRow )
{
    var aData = oTable.fnGetData(nRow);
    console.log(JSON.stringify(aData));
    $("#editLogEntry input#_id").val(aData._id);
    $("#editLogEntry input#date").attr('value', moment(aData.date).format('DD/MM/YYYY'));
    $("#editLogEntry select#name").val(aData.name);
    $("#editLogEntry select#clientName").val(aData.clientName);
    $('#editLogEntry select#projectName').val(aData.projectName);
    $("#editLogEntry input#hours").val(aData.hours);
    $("#editLogEntry textarea#description").val(aData.description);
    $('#editLogEntry').modal('show');

}
