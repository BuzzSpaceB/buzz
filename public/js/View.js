function addCreateThread() {
    $("body").append("<div class = 'createT'></div>");
    $(".createT").append("<div class = 'createThread'></div>");

    var createPostForm = "<div class='text-center' id='threadPostHead'><span class='glyphicon glyphicon-info-sign'></span> Fill In The Form To Post</div><br>" +
        "<form action ='#'>" +
        "<table id ='createTr'>" +
        "<tr>" +
        "<td>Subject</td>" +
        "<td><input type = 'text'></td>" +
        "</tr>" +
        "<tr>" +
        "<td>Post</td>" +
        "<td><textarea rows='9'></textarea></td>" +
        "</tr>" +
        "<tr>" +
        "<td'> </td>" +
        "<td colspan='2'><button type = 'submit' class='btn btn-sm btn-success'>Submit</button></td>" +
        "</tr>" +
        "</table>" +
        "</form>";

    $('.createThread').append(createPostForm);
}
$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-body input').val(recipient)
})