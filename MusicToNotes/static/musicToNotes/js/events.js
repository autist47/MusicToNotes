document.oncontextmenu = function (){return false};
document.onkeydown = function (event){
    if (-1 != hotkey_off.indexOf(event.keyCode)){
        event.preventDefault();
    }
};

// $("body").on("click", ".note", function(){
//     $(this).toggleClass("choice")
// })

$("body").on("mousedown", ".note", function(){
    start_index_note_choice = $(".note").index($(this))
})

$("body").on("mouseup", ".note", function(event){
    if (event.which == 1){
        end_index_note_choice = $(".note").index($(this))
        if (end_index_note_choice < start_index_note_choice){
            end_index_note_choice += start_index_note_choice
            start_index_note_choice = end_index_note_choice - start_index_note_choice
            end_index_note_choice -= start_index_note_choice
        }
        for (var i = start_index_note_choice; i <= end_index_note_choice; i++) {
            $($(".note")[i]).toggleClass("choice")
        }
    }
})

$("body").on("contextmenu", ".note", function(event){
    click_for_menu('main_note_menu');
    some_clicked = $(this)
    $(this).addClass("choice-menu")
})

$("body").on("contextmenu", ".key:not('.first')", function(event){
    click_for_menu('main_key_menu');
    some_clicked = $(this)
    $(this).addClass("choice-menu")
})

$("body").on("contextmenu", ".dimension:not('.first')", function(event){
    click_for_menu('main_dimension_menu');
    some_clicked = $(this)
    $(this).addClass("choice-menu")
})

$("body").on("contextmenu", ".key.first", function(event){
    click_for_menu('main_first_key_menu');
    some_clicked = $(this)
    $(this).addClass("choice-menu")
})

$("body").on("contextmenu", ".dimension.first", function(event){
    click_for_menu('main_first_dimension_menu');
    some_clicked = $(this)
    $(this).addClass("choice-menu")
})

$(window).on("resize", function(){
    if (were_changes){
        html_to_json()
        were_changes = false
    }
    close_now_menu()
    all_from_zero(json_arr)
})

$('#setting').on("click", function(){
    $("#settings_size_of_notes").toggleClass("show_settings_size_of_notes")
})

$('#plus').on("click", function(){
    plus()
})

$('#mines').on("click", function(){
    mines()
})

$("#burger-button").on("click", function(){
    $(this).toggleClass("button-menu-off")
    $("#burger-menu").toggleClass("burger-menu-show")
})