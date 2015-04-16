
function postThread()
{
    var subj, cont;
    subj=$("#subject").val();
    cont=$("#content").val();
    console.log(subj + " " + cont);
    var path = window.location.pathname;
    var realURL = path.split('/');
    var realPath = "/" + realURL[1] + "/" + realURL[2];
    $.post(path,{subject: subj,content: cont}, function(data)
    {
        if(data==='done')
        {
            alert("post success");
        }
        else alert(data);
    });
}

function postSpace() {
    var subj, cont;
    subj = $("#spaceName").val();
    cont = $("#spaceYear").val();
    console.log("GAH" + " " + subj + " " + cont);
    var path = window.location.pathname;
    $.post(path, {spaceName: subj, spaceYear: cont}, function (data) {
        if (data === 'done') {
            alert("post success");
        }
        else alert(data);
    });
}
$('#exampleModal').on('show.bs.modal', function (event) {
    alert("Haha");
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)

    modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-body input').val(recipient)
});
