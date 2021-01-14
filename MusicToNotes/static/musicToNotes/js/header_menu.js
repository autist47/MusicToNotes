$("li").on("click", function () {
	if ($(this).hasClass("nav-select")){
		$(this).removeClass("nav-select")
		$("#drop-menu").removeClass("menu-on")
	} else {
		$(".nav-select").removeClass("nav-select")
		$(this).addClass("nav-select")
		$("#drop-menu").addClass("menu-on")
	}
})