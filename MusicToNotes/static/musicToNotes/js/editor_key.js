function add_key(obj, key, change_y=false){
    if ($(obj).attr("data-type") == "dimension" && $($(".column-in-row")[$(".column-in-row").index($(obj)) - 1]).attr("data-type") != "key" ){
        $('<div class="column-in-row key key-'+key+'" data-value="'+key+'" data-type="key">'+keys_svg[key]+'</div>').insertBefore($(obj))
        if (change_y){
            ind_this = $(".key").index( $(".column-in-row")[$(".column-in-row").index($(obj))-1] )
            ind_prev = ind_this-1
            prev_value = $($(".key")[ind_prev]).attr("data-value")
            new_val = $($(".key")[ind_this]).attr("data-value")
            obj = $($(".key")[ind_this])

            offset = offset_by_key[prev_value] - offset_by_key[new_val]
            change_pos_y_after_key(ind_this, offset)
        }
    } else if ($(obj).attr("data-type") == "tact" && ($(".column-in-row").index($(obj)) + 1 == $(".column-in-row").length || $($(".column-in-row")[$(".column-in-row").index($(obj)) + 1]).attr("data-type") != "key")){
        $('<div class="column-in-row key key-'+key+'" data-value="'+key+'" data-type="key">'+keys_svg[key]+'</div>').insertAfter($(obj))
        if (change_y){
            ind_this = $(".key").index( $(".column-in-row")[$(".column-in-row").index($(obj))+1] )
            ind_prev = ind_this-1
            prev_value = $($(".key")[ind_prev]).attr("data-value")
            new_val = $($(".key")[ind_this]).attr("data-value")
            obj = $($(".key")[ind_this])

            offset = offset_by_key[prev_value] - offset_by_key[new_val]
            change_pos_y_after_key(ind_this, offset)
        }
    } else if ($(obj).attr("data-type") == "note"){
        add_key($(obj).parent().parent(), key, change_y)
    }
    were_changes = true
    close_now_menu()
}

function change_key(obj=some_clicked, new_val="scripka", change_y=false, only_this=true){
    prev_value = obj.attr("data-value")
    obj.removeClass("key-" + obj.attr("data-value"))
    obj.addClass("key-"+new_val)
    obj.attr("data-value", new_val)
    obj.html(keys_svg[new_val])

    if(change_y){
        offset = offset_by_key[prev_value] - offset_by_key[new_val]
        if (offset != 0){
            start_note_index = $(".column-in-row").index(obj)+1
            if ($($(".column-in-row")[start_note_index]).attr("data-type") == "dimension"){
                start_note_index++
            }
            start_note_index = $(".note").index( $($($(".column-in-row")[start_note_index]).children()[0]).children()[0] )
            next_key_index = $(".key").index(obj)+1
            if (next_key_index == $(".key").length){
                end_note_index = $(".note").length-1
            } else{
                array = $($(".column-in-row")[ $(".column-in-row").index($(".key")[next_key_index])-1 ]).children()
                end_note_index = $(".note").index($(array[array.length-1]).children()[$(array[array.length-1]).children().length -1])
            }
            if (offset < 0){
                for (let i = start_note_index; i <= end_note_index; i++) {
                    change_pos_y($($(".note")[i]), offset)
                }
            } else {
                for (let i = end_note_index; i >= start_note_index; i--) {
                    change_pos_y($($(".note")[i]), offset)
                }
            }
        }
    }

    if (!only_this) {
        index = $(".key").index(obj)
        while (index++ <= $(".key").length && $($(".key")[index]).attr("data-value") == prev_value) {
            change_key($(".key")[index], new_val, change_y)
        }
    }
    were_changes = true
    close_now_menu()
}

function delete_key(obj, change_y=false){
    if (obj.is($(".key")[0])){
        alert("руки на стол")
    } else {
        if (obj.is($(obj).parent().children()[0])){
            change_key(obj, $($(".key")[$(".key").index($(obj))-1]).attr("data-value"), change_y)
        } else {
            if (change_y){
                ind_this = $(".key").index( $(obj) )
                ind_prev = ind_this-1
                prev_value = $($(".key")[ind_prev]).attr("data-value")
                new_val = $($(".key")[ind_this]).attr("data-value")
                obj = $($(".key")[ind_this])

                offset = offset_by_key[new_val] - offset_by_key[prev_value]
                change_pos_y_after_key(ind_this, offset)
                $(obj).remove()
            } else {
                $(obj).remove()
            }
        }
    }
    were_changes = true
    close_now_menu()
}
