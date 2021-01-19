function add_note(from_obj=some_clicked, note_length=[1, 8], on_right=true, new_column=true, save_row=false, only_this=false) {
    str_length = note_length[0]+"/"+note_length[1]
    if(save_row && $(from_obj).attr("data-type") == "note"){
        pos_y = $(from_obj).attr("data-row")
    } else {
        pos_y = 3
    }
    // array_of_all_notes.splice($(".note").index($(from_obj))+1, 0, str_length)
    type = $(from_obj).attr("data-type")
    if (new_column){
        if (on_right){
            if (type == "note"){
                $('<div class="column-in-tact" data-length="'+str_length+'" all_pos_y="'+pos_y+'"><div class="note on-'+pos_y+'-row" data-row="'+pos_y+'" data-length="'+str_length+'">'+notes_svg[str_length]+'</div></div>').insertAfter($(from_obj).parent())
            } else if (type == "dimension" || type == "key"){
                if ( $($(".column-in-row")[$(".column-in-row").index($(from_obj))-1]).attr("data-type") == "tact" ){
                    asd = $($(".column-in-row")[$(".column-in-row").index($(from_obj))-1])
                } else {
                    asd = $($(".column-in-row")[$(".column-in-row").index($(from_obj))-2])
                }
                from_obj = $($(asd).children()[$(asd).children().length-1]).children()[0]
                add_note(from_obj, note_length, true, new_column, false, only_this)
                only_this = true
            }
        } else {
            if ($(from_obj).attr("data-type") == "note"){
                $('<div class="column-in-tact" data-length="'+str_length+'" all_pos_y="'+pos_y+'"><div class="note on-'+pos_y+'-row" data-row="'+pos_y+'" data-length="'+str_length+'">'+notes_svg[str_length]+'</div></div>').insertBefore($(from_obj).parent())
            }
        }
    } else {
        if (on_right){
            if (type == "note"){
                $($(".column-in-tact")[$(".column-in-tact").index($(from_obj).parent())+1]).append($('<div class="note on-'+pos_y+'-row" data-row="'+pos_y+'" data-length="'+str_length+'">'+notes_svg[str_length]+'</div>'))
                $($(".column-in-tact")[$(".column-in-tact").index($(from_obj).parent())+1]).attr("all_pos_y", $($(".column-in-tact")[$(".column-in-tact").index($(from_obj).parent())+1]).attr("all_pos_y") + ',' + pos_y)
                change_pos_y($($(".column-in-tact")[$(".column-in-tact").index($(from_obj).parent())+1]).children()[0], 0)
            } else if (type == "dimension" || type == "key"){
                if ( $($(".column-in-row")[$(".column-in-row").index($(from_obj))-1]).attr("data-type") == "tact" ){
                    asd = $($(".column-in-row")[$(".column-in-row").index($(from_obj))-1])
                } else {
                    asd = $($(".column-in-row")[$(".column-in-row").index($(from_obj))-2])
                }
                from_obj = $($(asd).children()[$(asd).children().length-1]).children()[0]
                add_note(from_obj, note_length, true, new_column, false, only_this)
                only_this = true
            }
        } else {
            if ($(from_obj).attr("data-type") == "note"){
                $($(".column-in-tact")[$(".column-in-tact").index($(from_obj).parent())-1]).append($('<div class="note on-'+pos_y+'-row" data-row="'+pos_y+'" data-length="'+str_length+'">'+notes_svg[str_length]+'</div>'))
                $($(".column-in-tact")[$(".column-in-tact").index($(from_obj).parent())-1]).attr("all_pos_y", $($(".column-in-tact")[$(".column-in-tact").index($(from_obj).parent())-1]).attr("all_pos_y") + ',' + pos_y)
                change_pos_y($($(".column-in-tact")[$(".column-in-tact").index($(from_obj).parent())-1]).children()[0], 0)
            }
        }
    }

    if (!only_this && new_column){
        relocate($(from_obj), note_length)
    }
    draw_league()
    were_changes = true
    close_now_menu()
}

function change_note(obj=some_clicked, new_length="1/4", only_img=true){
    if (only_img){
        $(obj).attr("data-length", new_length)
        $(obj).parent().attr("data-length", new_length)
        $(obj).html(notes_svg[new_length])
    } else {
        new_length_array = new_length.split('/')
        difference = parseFloat( new_length_array[0] / new_length_array[1] ) - parseFloat( $(obj).attr("data-length").split('/')[0] / $(obj).attr("data-length").split('/')[1] )
        if (difference != 0){
            if ($(obj).parent().children().length == 1){
                flag = false
                if (difference > 0){
                    to_next = true
                } else {
                    to_next = false
                }
                new_val_0 = (""+difference).split('.')[1]
                m = Number(new_val_0)
                n = 10**new_val_0.length
                M = m
                N = n
                for (let i = 2; i <= m; i++) {
                    if (m % i === 0 &&  n % i === 0)
                        M = m / i, N = n / i;
                }
                $(obj).attr("data-length", new_length)
                $(obj).parent().attr("data-length", new_length)
                $(obj).html(notes_svg[new_length])
                relocate($(obj), [M, N], to_next)
            } else {
                new_val_0 = (""+difference).split('.')[1]
                m = Number(new_val_0)
                n = 10**new_val_0.length
                M = m
                N = n
                for (let i = 2; i <= m; i++) {
                    if (m % i === 0 &&  n % i === 0)
                        M = m / i, N = n / i;
                }
                if (difference > 0){
                    add_note($(obj), [M, N], true, true, true)
                } else {
                    all_pos_y = $(obj).parent().attr("all_pos_y").split(',')
                    all_pos_y.splice(all_pos_y.indexOf($(obj).attr("data-row")), 1)
                    $('<div class="column-in-tact" data-length="'+M+'/'+N+'" all_pos_y="'+all_pos_y.join(',')+'"></div>').insertAfter($(obj).parent())
                    for (i = 0; i < $(some_clicked).parent().children().length; i++){
                        if( !some_clicked.is($(some_clicked).parent().children()[i]) ){
                            row = $($(some_clicked).parent().children()[i]).attr("data-row")
                            $($(".column-in-tact")[$(".column-in-tact").index($(obj).parent()) + 1 ]).append('<div class="note on-'+row+'-row" data-row="'+row+'" data-length="'+M+'/'+N+'">'+notes_svg[M+'/'+N]+'</div>')
                        }
                    }
                }
                if ($(obj).parent().attr("league") && $(obj).parent().attr("league") != "end"){
                    $($(".column-in-tact")[$(".column-in-tact").index($(obj).parent()) + 1]).attr("league", "middle")
                } else if ($(obj).parent().attr("league") == "end"){
                    $($(".column-in-tact")[$(".column-in-tact").index($(obj).parent()) + 1]).attr("league", "end")
                    $(obj).parent().attr("league", "middle")
                } else {
                    $($(".column-in-tact")[$(".column-in-tact").index($(obj).parent()) + 1]).attr("league", "end")
                    $(obj).parent().attr("league", "start")
                }
            }
        }
    }
    draw_league()
    were_changes = true
    close_now_menu()
}

function delete_note(obj){
    if ($($(obj).parent()).children().length != 1){
        all_pos_y = (""+$($(obj).parent()).attr("all_pos_y")).split(',')
        all_pos_y.splice(all_pos_y.indexOf($(obj).attr("data-row")), 1)
        $($(obj).parent()).attr("all_pos_y", all_pos_y)
        $(obj).remove()
    } else {
        relocate($(obj), $(obj).attr("data-length").split('/'), false)
        league = $(obj).parent().attr("league")
        if (league == "start"){
            if ($($(".column-in-tact")[$(".column-in-tact").index($(obj).parent()) + 1]).attr("league") != "end"){
                $($(".column-in-tact")[$(".column-in-tact").index($(obj).parent()) + 1]).attr("league", league)
            } else {
                $($(".column-in-tact")[$(".column-in-tact").index($(obj).parent()) + 1]).removeAttr("league")
            }
        } else if(league == "end"){
            if ($($(".column-in-tact")[$(".column-in-tact").index($(obj).parent()) - 1]).attr("league") != "start"){
                $($(".column-in-tact")[$(".column-in-tact").index($(obj).parent()) - 1]).attr("league", league)
            } else {
                $($(".column-in-tact")[$(".column-in-tact").index($(obj).parent()) - 1]).removeAttr("league")
            }
        }
        $($(obj).parent()).remove()
    }
    draw_league()
    were_changes = true
    close_now_menu()
}