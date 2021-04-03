$(document).ready(function() {
	$('#audio-player').mediaelementplayer({
		alwaysShowControls: true,
		features: ['playpause','volume','progress'],
		audioVolume: 'horizontal',
		audioHeight: 120
	});
});

$(".check-song:not('.disable')").on('click', function(){
	if (!$(this).hasClass('active')) {
		$('.check-song').toggleClass('active')
		$('#audio-player').attr('src', $('.active').attr('data-url'))
	}
})