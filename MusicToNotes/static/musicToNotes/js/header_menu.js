$("li").on("click", function () {
	if ($(this).hasClass("nav-select")){
		$(this).removeClass("nav-select")
	} else {
		$(".nav-select").removeClass("nav-select")
		$(this).addClass("nav-select")
	}
})