$(document).keydown(function(event){
    if (event.keyCode == 16){
        shift = true
    }
    if (event.keyCode == 17){
        ctrl = true
    }
    if (event.keyCode == 18){
        alt = true
    }
    if (!ctrl && event.keyCode == 83){
        $("#settings_size_of_notes").toggleClass("show_settings_size_of_notes")
    }
    if (ctrl && event.keyCode == 83){
        alert("save")
        html_to_json()
        were_changes = false
    }
    if (!ctrl && event.keyCode == 109){
        mines()
    }
    if (!ctrl && event.keyCode == 107){
        plus()
    }
    if (ctrl && event.keyCode == 109){
        $("#settings_size_of_notes input").val( Number($("#settings_size_of_notes input").val())-5 )
        sizePic()
    }
    if (ctrl && event.keyCode == 107){
        $("#settings_size_of_notes input").val( Number($("#settings_size_of_notes input").val())+5 )
        sizePic()
    }
    if (event.keyCode == 38) {
        for (let i = 0; i < $(".choice").length; i++) {
            change_pos_y($(".choice")[i], 1)
        }
    }
    if (event.keyCode == 40) {
        for (let i = 0; i < $(".choice").length; i++) {
            change_pos_y($(".choice")[i], -1)
        }
    }
    if (event.keyCode == 39) {
        for (let i = $(".choice").length-1; i >= 0; i--) {
            let ind = $(".note").index($(".choice")[i]) + 1
            $($(".choice")[i]).toggleClass("choice")
            if (ind < $(".note").length){
                $($(".note")[ind]).toggleClass("choice")
            }
        }
    }
    if (event.keyCode == 37) {
        for (let i = 0; i < $(".choice").length; i++) {
            let ind = $(".note").index($(".choice")[i]) - 1
            $($(".choice")[i]).toggleClass("choice")
            if (ind > 0){
                $($(".note")[ind]).toggleClass("choice")
            }
        }
    }
    if (event.keyCode == 27) {
        if (circle){
            close_now_menu()
        } else {
            $(".choice").toggleClass("choice")
        }
    }
    if (event.keyCode == 46) {
        for (let i = $(".choice").length; i >= 0; i--) {
            delete_note($(".choice")[i])
        }
    }
    if (event.keyCode == 76) {
        if ($(".choice").length > 1){
            prev_choice = $(".choice")[0]
            $($(".choice")[0]).parent().attr("league", "start")
            for (let i = 1; i < $(".choice").length; i++) {
                if ( $($('.note')[$('.note').index($('.choice')[i]) - 1]).is($(prev_choice)) ){
                    if ($($(".choice")[i]).parent().attr("league") != "start"){
                        $($(".choice")[i]).parent().attr("league", "middle")
                    }
                } else {
                    if ($($(".choice")[i-1]).parent().attr("league") == "start"){
                        $($(".choice")[i-1]).parent().removeAttr("league")
                    } else if ($($(".choice")[i-1]).parent().attr("league") == "middle"){
                        $($(".choice")[i-1]).parent().attr("league", "end")
                    }
                    $($(".choice")[i]).parent().attr("league", "start")
                }
                prev_choice = $(".choice")[i]
            }
            if ($($(".choice")[$(".choice").length-1]).parent().attr("league") == "start"){
                $($(".choice")[$(".choice").length-1]).parent().removeAttr("league")
            } else if ($($(".choice")[$(".choice").length-1]).parent().attr("league") == "middle"){
                $($(".choice")[$(".choice").length-1]).parent().attr("league", "end")
            }
            draw_league()
        }
    }
    console.log(event.keyCode)
})

$(document).keyup(function(event){
    if (event.keyCode == 16){
        shift = false
    }
    if (event.keyCode == 17){
        ctrl = false
    }
    if (event.keyCode == 18){
        alt = false
    }
})