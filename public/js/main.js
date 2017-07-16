$().ready(function(){
    getImages()

    $('.imgSelect').click(() => {
        let src = $('.imgSelect img').attr('src')
        console.log(src)
        $('.item-image').attr('src', src)
    })

    $("#fileuploader").uploadFile({
        url:"/upload",
        fileName:"myfile",
        afterUploadAll: function() {
            getImages()
        }
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
                addPages(1, data.count / 6)

            imgCount = (data.count < 6) ? data.count : 6
            let id = $('#id').val()
            let path = './img/'+ id +'/'
            for (let i = 0; i < imgCount; i++) {
                let name = data.images[i]
                gallery.append('<div class="imgSelect card" id="'+i+'" onclick="setImage(\''+ path + name +'\', ' +i+ '\)"><img src="'+ path + name +'"><br>' +
                    '<i class="glyphicon glyphicon-trash" onclick="deleteImg(\''+ name +'\')">' +
                    '</i><i class="glyphicon glyphicon-zoom-in pull-right" onclick="showModal(\''+ path + name +'\')"></i></div>')
            }
        }
    })
}

function showModal(image) {
    $('#imgModal-content').attr('src', image)
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

function deleteImg(img) {
    $.ajax({
        type: 'POST',
        url: '/delete',
        data: { img: img},
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