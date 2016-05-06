// ONLY WORKS ON BROWSERS THAT SUPPORT MP3 //
$(function () {
	var urlBase = 'https://api.spotify.com/v1/search';

    var songs = [],
		curtime = 0;

	$('form').on('submit', function(event) {
	  event.preventDefault();

	  $.ajax({
	    url: urlBase,
	    data: {
	      type: 'track',
	      query: $('#trackName').val()
	    },
	    success: showTrack,
	    error: function() {
	      console.log('ERROR!!!!');
	    },
	    datatype: 'json'
	  })
	});

	function showTrack(tracks) {
	  if(tracks.tracks.items.length > 0) {
	    createTracks(tracks);
	    hideLogoImage();
	  }
	}

	function hideLogoImage(){
		$(".js-logo-image").hide(2000, function(){
			$(".js-search-bar").addClass('navbar');
			$(".js-logo-little").removeClass('hide');
			$(".js-search-offset").removeClass('col-sm-offset-3');
			$('.js-container-tracks').hide().attr('class','js-container-tracks tracks-container').slideDown(1000);
		});
	}

    $('.js-add-tracks').on('click', '.stop', function(e) {
    	e.preventDefault();
        $(this).addClass('hide');
        $(this).parent().find('.play').removeClass('hide').trigger('click');        
    })

	$('.js-add-tracks').on('click', '.play', function(e) {
		e.preventDefault();
		var song = songs[$(this).data('id')];
        if ($(this).hasClass('active')){
        	song.play();
            $(this).removeClass('active').addClass('hide');
    		$(this).parent().find('.stop').removeClass('hide').addClass('active');
    		$(this).parent().find('.pause').removeClass('active');
        }else{
            stopMusic(song, $(this));
        }
	});

	function stopMusic(song, $this){
		song.pause();
        $this.removeClass('active');
        $(".progress-radial-" + $this.data('id')).attr('class', '').addClass('progress-radial-' + $this.data('id')).addClass('progress');
	    song.currentTime = 0;            
        $this.parent().find('.stop').addClass('hide');
        $this.parent().find('.play').removeClass('hide').addClass('active');
	}

	$('.js-add-tracks').on('click', '.pause', function(e) {
		e.preventDefault();
		songs[$(this).data('id')].pause();
		$(this).addClass('active');
		$(this).parent().find('.stop').addClass('hide');
        $(this).parent().find('.play').removeClass('hide').addClass('active');
	});

	$('.js-add-tracks').on('click', '.mute', function(e) {
		e.preventDefault();
		songs[$(this).data('id')].volume = 0;
		$(this).addClass('hide');
		$(this).parent().find('.muted').removeClass('hide');
	});

	$('.js-add-tracks').on('click', '.muted', function(e) {
		e.preventDefault();
		songs[$(this).data('id')].volume = 1;
		$(this).addClass('hide');
		$(this).parent().find('.mute').removeClass('hide');
	});

	function createTracks(tracks) {
		if(tracks.tracks.items.length > 0) {
			$('.js-add-tracks').html('');
		    tracks.tracks.items.forEach(function logArrayElements(track, index) {
			    fillTrack(track, index);
			});
		}
	}

	function fillTrack(track, index) {
		var html = '<div class="col-sm-6">' + 
						'<div class="row text-center">' +
							'<h2>' + track.artists[0].name + '</h2>' +
							'<p>' + track.album.name + ' - <span>' + track.name + '</span></p>' +
						'</div>' +
						'<div class="row">' +
							'<div class="col-sm-offset-2 col-sm-8">' +
								'<div class="progress-radial-' + index + ' progress">' +
									'<div class="overlay">' +
										'<img class="img-responsive img-circle js-image-url" src="' + track.album.images[0].url + '" alt="">' +
										'<div class="controls">' +
											'<span class="glyphicon glyphicon-volume-up mute" data-toggle="audioplayer" data-icon="muted" data-active="false" data-id="' + index + '"></span>' +
											'<span class="glyphicon glyphicon-volume-off hide muted" data-toggle="audioplayer" data-icon="mute" data-active="false" data-id="' + index + '"></span>' +
											'<span class="glyphicon glyphicon-stop hide stop" data-toggle="audioplayer" data-icon="play" data-id="' + index + '"></span>' +
											'<span class="glyphicon glyphicon-play active play" data-toggle="audioplayer" data-icon="stop" data-id="' + index + '"></span>' +
											'<span class="glyphicon glyphicon-pause pause" data-toggle="audioplayer" data-icon="pause" data-id="' + index + '"></span>' +
										'</div>' +
										'<div class="clearfix"></div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>';
		$('.js-add-tracks').append(html);
		createSong(track, index);
	}

	function createSong(track, index){
		var song = new Audio(track.preview_url);
		song.type = 'audio/mpeg';
		song.src = track.preview_url;
		song.id = index;
		songs[index] = song;

		song.addEventListener('timeupdate', function (){
			curtime = song.currentTime / song.duration * 100;
			$('.progress-radial-'+song.id).removeClass('progress-'+parseInt(curtime-1));
			$('.progress-radial-'+song.id).addClass('progress-'+parseInt(curtime));
		});
	}
});