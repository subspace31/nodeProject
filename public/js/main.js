$().ready(function(){
    getImages()

    $('.imgSelect').click(() => {
        let src = $('.imgSelect img').attr('src')
        console.log(src)
        $('.item-image').attr('src', src)
    })
})



function getImages() {
    let gallery = $('.imgGallery')
    gallery.empty()
    $.ajax({
        type: 'POST',
        url: '/getImages',
        data: {},
        cache: false,
        success: function(data) {
            if (data.count > 6)
                addPages(1, data.count)

            imgCount = (data.count < 6) ? data.count : 6
            let id = $('#id').val()
            let path = './img/'+ id +'/'
            for (let i = 0; i < imgCount; i++) {
                let name = data.images[i]
                gallery.append('<div class="imgSelect card" id="'+i+'" onclick="setImage(\''+ path + name +'\', ' +i+ '\)"><img src="'+ path + name +'"><br><i class="glyphicon glyphicon-trash" onclick="delete(\''+ name +'\')"></i></div>')
            }

        }
    })
}

function showModal(image) {
    $('#imgModal-content').attr('src', './img/1/' + image)
    $('#imgModal').show()
}

function hideModal() {
    $('#imgModal').hide()
}

function setImage(source, id) {
    $('.imgSelected').removeClass('imgSelected')
    $('.item-image').attr('src', source)
    $('#' + id).addClass('imgSelected')
}

function upload() {
    let image = $('#imgUpload').prop('files')
    $.ajax({
        type: 'POST',
        url: '/upload',
        data: image,
        cache: false,
    }).success(data => {
        if (data === 'success') {
            getImages()
        }
    })
}

function addPages(currentPage, pageCount) {
    let pagination = ''
    if (pageCount > 1) {
        pagination += '<ul class="pagination">'
        if (currentPage > 1) {
            pagination += '<li><a href="/?page=1">&laquo;</a></li>'
        }
        let i = 1;
        if (currentPage > 5) {
            i = +currentPage - 4;
        }
        if (i !== 1) {
            pagination += '<li class="disabled"><a href="#">...</a></li>'
        }
        for (i; i<=pageCount; i++) {
            if (currentPage === i) {
                pagination += '<li class="active"><span>${i}<span class="sr-only">(current)</span></span></li>'
            } else {
                pagination += '<li><a href="getImages()">${i}</a></li>'
            }
            if (i === (+currentPage + 4)) {
                pagination += '<li class="disabled"><a href="#">...</a></li>'
                break; }
        }
        if (currentPage !== pageCount) {
            pagination += '<li><a href="getImages()>">&raquo;</a></li>'
        }
        pagination += '</ul>'
    }
}

/*$(function() {
 // We can attach the `fileselect` event to all file inputs on the page
 $(document).on('change', ':file', function() {
 var input = $(this),
 numFiles = input.get(0).files ? input.get(0).files.length : 1,
 label = input.val().replace(/\\/g, '/').replace(/.*\//, '')
 input.trigger('fileselect', [numFiles, label])
 })

 // We can watch for our custom `fileselect` event like this
 $(document).ready( function() {
 $(':file').on('fileselect', function(event, numFiles, label) {

 var input = $(this).parents('.input-group').find(':text'),
 log = numFiles > 1 ? numFiles + ' files selected' : label

 if( input.length ) {
 input.val(log)
 } else {
 if( log ) alert(log)
 }
 })
 })
 })*/

$(document).ready(function()
{
    $("#fileuploader").uploadFile({
        url:"/upload",
        fileName:"myfile",
        afterUploadAll: function() {
            getImages()
        }
    })
})