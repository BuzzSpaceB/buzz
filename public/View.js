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
