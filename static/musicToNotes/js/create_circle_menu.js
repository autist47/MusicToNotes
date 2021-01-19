function close_now_menu_with_save(){
    $(".choice-menu").addClass("choice-menu-flag")
    close_now_menu();
    $(".choice-menu-flag").addClass("choice-menu")
    $(".choice-menu-flag").removeClass("choice-menu-flag")
}
function click_change_note(){
    close_now_menu_with_save()
    click_for_menu("key_setting", center[0], center[1]);
}

function click_plus_note(flag){
    global_flag = flag
    close_now_menu_with_save()
    click_for_menu("add_note_menu", center[0], center[1]);
}

function click_plus_key(flag){
    global_flag = flag
    close_now_menu_with_save()
    click_for_menu("add_key_menu", center[0], center[1]);
}

function click_plus_dimension(){
    close_now_menu_with_save()
    click_for_menu("add_dimension_menu", center[0], center[1]);
}

function click_change_key(){
    close_now_menu_with_save()
    click_for_menu("change_key_menu", center[0], center[1]);
}

function click_change_dimension(){
    close_now_menu_with_save()
    click_for_menu("change_dimension_menu", center[0], center[1]);
}

function click_delete_note(){
    delete_note(some_clicked)
    close_now_menu()
}

function click_del_key(flag){
    delete_key(some_clicked, flag)
    close_now_menu()
}

function click_del_dimension(){
    delete_dimension(some_clicked)
    close_now_menu()
}

function create_menu(){
    $('#place-for-circle-menu').html('')
    center = [1, 50, 'transparent', 250]

    circle_1 = [3, 100, ['#70716B'], [["static/musicToNotes/img/note1_2.png", "static/musicToNotes/img/note1_4.png", "static/musicToNotes/img/note1_8.png"], [false]], ["add_note(some_clicked, [1, 2], global_flag)", "add_note(some_clicked, [1, 4], global_flag)", "add_note(some_clicked, [1, 8], global_flag)"] ]
    myArr = [circle_1]
    add_note_menu = CreateCircleMenu(center, myArr, "add_note_menu", "main2")
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+add_note_menu[0])
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+add_note_menu[1])

    circle_1 = [2, 100, ['#70716B'], [["static/musicToNotes/img/scripka.png", "static/musicToNotes/img/bas.png"], [false]], ["add_key(some_clicked, 'scripka', global_flag)", "add_key(some_clicked, 'bas', global_flag)"] ]
    myArr = [circle_1]
    add_key_menu = CreateCircleMenu(center, myArr, "add_key_menu", "main2")
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+add_key_menu[0])
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+add_key_menu[1])

    circle_1 = [3, 100, ['#70716B'], [["static/musicToNotes/img/2_4.png", "static/musicToNotes/img/3_4.png", "static/musicToNotes/img/4_4.png"], [false]], ["add_dimension(some_clicked, [2, 4])", "add_dimension(some_clicked, [3, 4])", "add_dimension(some_clicked, [4, 4])"] ]
    myArr = [circle_1]
    add_dimension_menu = CreateCircleMenu(center, myArr, "add_dimension_menu", "main2")
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+add_dimension_menu[0])
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+add_dimension_menu[1])

    // --------------------------------------------------------------note menu --------------------------------------------------------------
    circle_1 = [3, 100, ['gray','gray',"gray"], [["static/musicToNotes/img/key_setting.png", "static/musicToNotes/img/rubbish.png", "static/musicToNotes/img/plus.png"], [false]], ["click_change_note()", "click_delete_note()", "DefaultFuncForMenu()"], [false, false, true] ]
    circle_2 = [[3], 165, ['gray','gray',"gray"], [["static/musicToNotes/img/note1_4.png", "static/musicToNotes/img/scripka.png", "static/musicToNotes/img/3_4.png"], [true]], ["DefaultFuncForMenu()", "DefaultFuncForMenu()", "click_plus_dimension()"], [true, true, false] ]
    circle_3 = [[2], 205, ['gray','gray',"gray"], [["static/musicToNotes/img/y.png", "static/musicToNotes/img/n.png"], [true]], ["click_plus_note(true)", "click_plus_note(false)", "click_plus_key(true)", "click_plus_key(false)"] ]
    myArr = [circle_1, circle_2, circle_3]
    main_note_menu = CreateCircleMenu(center, myArr, "main_note_menu", "main2")
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+main_note_menu[0])
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+main_note_menu[1])


    circle_1 = [3, 100, ['#70716B'], [["static/musicToNotes/img/note1_2.png", "static/musicToNotes/img/note1_4.png", "static/musicToNotes/img/note1_8.png"], [false]], ["change_note(some_clicked, \'1/2\', false)", "change_note(some_clicked, \'1/4\', false)", "change_note(some_clicked, \'1/8\', false)"] ]
    myArr = [circle_1]
    change_note_menu = CreateCircleMenu(center, myArr, "key_setting", "main2")
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+change_note_menu[0])
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+change_note_menu[1])

    // --------------------------------------------------------------key menu --------------------------------------------------------------
    circle_1 = [3, 100, ['#70716B'], [["static/musicToNotes/img/key_setting.png", "static/musicToNotes/img/rubbish.png", "static/musicToNotes/img/plus.png"], [false]], ["click_change_key()", "DefaultFuncForMenu()", "DefaultFuncForMenu()"], [false, true, true] ]
    circle_2 = [[2], 165, ['gray','gray',"gray"], [["static/musicToNotes/img/y.png", "static/musicToNotes/img/y.png", "static/musicToNotes/img/y.png", "static/musicToNotes/img/n.png", "static/musicToNotes/img/note1_4.png", "static/musicToNotes/img/3_4.png"], [true]], ["DefaultFuncForMenu()", "DefaultFuncForMenu()", "click_del_key(true)", "click_del_key(false)", "click_plus_note(true)", "click_plus_dimension()"] ]
    myArr = [circle_1, circle_2]
    main_key_menu = CreateCircleMenu(center, myArr, "main_key_menu", "main2")
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+main_key_menu[0])
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+main_key_menu[1])


    circle_1 = [4, 100, ['#70716B'], [["static/musicToNotes/img/scripka.png", "static/musicToNotes/img/bas.png"], [false]], ["change_key(some_clicked, \'scripka\')", "change_key(some_clicked, \'bas\')", "change_key(some_clicked, \'scripka\', true)", "change_key(some_clicked, \'bas\', true)"] ]
    myArr = [circle_1]
    change_key_menu = CreateCircleMenu(center, myArr, "change_key_menu", "main2")
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+change_key_menu[0])
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+change_key_menu[1])


    // --------------------------------------------------------------first key menu --------------------------------------------------------
    circle_1 = [4, 100, ['#70716B'], [["static/musicToNotes/img/scripka.png", "static/musicToNotes/img/bas.png"], [false]], ["change_key(some_clicked, \'scripka\')", "change_key(some_clicked, \'bas\')", "change_key(some_clicked, \'scripka\', true)", "change_key(some_clicked, \'bas\', true)"] ]
    myArr = [circle_1]
    main_first_key_menu = CreateCircleMenu(center, myArr, "main_first_key_menu", "main2")
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+main_first_key_menu[0])
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+main_first_key_menu[1])


    // --------------------------------------------------------------dimension menu --------------------------------------------------------------
    circle_1 = [3, 100, ['#70716B'], [["static/musicToNotes/img/key_setting.png", "static/musicToNotes/img/rubbish.png", "static/musicToNotes/img/plus.png"], [false]], ["click_change_dimension()", "click_del_dimension()", "DefaultFuncForMenu()"], [false, false, true] ]
    circle_2 = [[2], 165, ['gray','gray',"gray"], [["static/musicToNotes/img/note1_4.png", "static/musicToNotes/img/scripka.png"], [true]], ["click_plus_note(true)", "DefaultFuncForMenu()"],[false, true] ]
    circle_3 = [[2], 205, ['gray','gray',"gray"], [["static/musicToNotes/img/y.png", "static/musicToNotes/img/n.png"], [true]], ["click_plus_key(true)", "click_plus_key(false)"] ]
    myArr = [circle_1, circle_2, circle_3]
    main_dimension_menu = CreateCircleMenu(center, myArr, "main_dimension_menu", "main2")
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+main_dimension_menu[0])
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+main_dimension_menu[1])


    circle_1 = [3, 100, ['#70716B'], [["static/musicToNotes/img/2_4.png", "static/musicToNotes/img/3_4.png", "static/musicToNotes/img/4_4.png"], [false]], ["change_dimension(some_clicked, [2,4])", "change_dimension(some_clicked, [3,4])", "change_dimension(some_clicked, [4,4])"] ]
    myArr = [circle_1]
    change_dimension_menu = CreateCircleMenu(center, myArr, "change_dimension_menu", "main2")
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+change_dimension_menu[0])
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+change_dimension_menu[1])


    // -------------------------------------------------------------first dimension menu -----------------------------------------------------
    circle_1 = [3, 100, ['#70716B'], [["static/musicToNotes/img/2_4.png", "static/musicToNotes/img/3_4.png", "static/musicToNotes/img/4_4.png"], [false]], ["change_dimension(some_clicked, [2,4])", "change_dimension(some_clicked, [3,4])", "change_dimension(some_clicked, [4,4])"] ]
    myArr = [circle_1]
    main_first_dimension_menu = CreateCircleMenu(center, myArr, "main_first_dimension_menu", "main2")
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+main_first_dimension_menu[0])
    $('#place-for-circle-menu').html($('#place-for-circle-menu').html()+main_first_dimension_menu[1])

}

$(document).ready(function(){
    sizePic()

    create_menu()
    
    $(".center").on("click", function(){
        close_now_menu();
    })
})