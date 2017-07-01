$().ready(function(){
    var gallery = $('.imgGallery')
    $.ajax({
        type: 'POST',
        url: '/getImages',
        data: {},
        cache: false,
        success: function(data) {
            gallery.prepend('<button><img src="./img/1/'+ data +'"></button>')
        }
    })
})