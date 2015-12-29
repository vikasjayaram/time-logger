$(document).ready(function() {
//  alert('I am ready');
    TableTools.DEFAULTS.aButtons = [ "pdf", "csv", "xls"];
    var nEditing = null;
    var deleteData = null;
    var oTable = $('#projectList').dataTable( {});
    var oTable = $('#projectList').dataTable( {
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
        "sAjaxSource": "/project/getAllData",
        "aoColumns":[
          {"mData": "_id", "bSearchable": false, "sClass": "center", "sWidth": "8%"},

          {"mData": "name"},
          {"mData": "clientName", "sWidth": "15%"},
          {"mData": "createdBy", "sWidth": "15%"},
          {"mData":  function (obj) {
              var status = '';
              if (obj.status === "active") {
                  status = '<span class="glyphicon glyphicon-eye-open">';
              } else {
                status = '<span class="glyphicon glyphicon-eye-close">';
              }
              return status;
          }, "sClass": "center", "sWidth": "20%"},
          {
              "mDataProps": null,
              "sDefaultContent": '<p><a class="btn btn-primary btn-xs" href="#edit_project"><span class="glyphicon glyphicon-pencil"></span></a></p><p><a class="btn btn-danger btn-xs" href="#delete_project"><span class="glyphicon glyphicon-trash"></span></a></p>',
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
    $('#projectList').on('click', 'a[href="#edit_project"]', function (e) {
        e.preventDefault();
        //oTable.fnSetColumnVis( 0, true );
        var nRow = $(this).parents('tr')[0];
        editProjectRow( oTable, nRow );
        nEditing = nRow;
    } );
    $('#projectList').on('click', 'a[href="#delete_project"]', function (e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var aData = oTable.fnGetData(nRow);
        console.log(JSON.stringify(aData));
        deleteData = aData;
        $('#deleteProject input#_id').val(aData._id)
        $('#deleteProject').modal('show');
        //alert('Click');
    });
    $('#modal-delete-project-btn').click(function (e) {
        $.ajax({
          type: "POST",
          url: '/project/delete',
          data: deleteData,
          success: function (data, status) {
            //window.location = '/projects';
          },
          error: function (data, status) {
            alert('Something Bad Happened!! Try again later');
          }
        });
        $('#deleteProject').modal('hide');
    });
});

function editProjectRow ( oTable, nRow )
{
  console.log('editProjectRow');
    var aData = oTable.fnGetData(nRow);
    console.log(JSON.stringify(aData));
    $("#editProject input#_id").val(aData._id);
    $("#editProject input#name").val(aData.name);
    $("#editProject select#clientName").val(aData.clientName);
    $('#editProject select#status').val(aData.status);
    $('#editProject').modal('show');

}
