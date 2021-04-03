$("#recording-btn").on("click", function () {
	if ($(this).hasClass('start')){
		start_recording(2000)
		$('#timer').html('00:00')
		timer_timeinterval = setTimeout(timer, 1000)
		$(this).removeClass('start')
		$(this).addClass('stop')
		$(this).addClass('stop-recording')
	} else {
		stop_timer()
		$(this).removeClass('stop')
		$(this).addClass('start')
	}
})
$('#list-menu > div > div').on('click', function(){
	if ($(this).hasClass('active')){
		$(this).removeClass('active')
	} else {
		$('#list-menu .active').removeClass('active')
		$(this).addClass('active')
	}
})

function timer(time_start='00:00'){
	time_start = time_start.split(':');
	sec = parseInt(time_start[1]);
	min = parseInt(time_start[0]);

	sec++;
	if (sec >= 60){
		sec = 0;
		min++;
	}
	min_str = ''+min
	min_str = '0'.repeat(2-min_str.length)+min_str
	sec_str = ''+sec
	sec_str = '0'.repeat(2-sec_str.length)+sec_str

	new_time = min_str+':'+sec_str
	$('#timer').html(new_time)
	timer_timeinterval = setTimeout(timer, 1000, new_time)
}
function stop_timer(){
	clearInterval(timer_timeinterval)
}