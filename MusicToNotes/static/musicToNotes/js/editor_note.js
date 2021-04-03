function relocate_note(from_obj=some_clicked, note_length=[1, 8], to_next=true, to_obj=null){
    if (to_next){
        for (let i=$(".tact").index($($(from_obj).parent()).parent()); to_obj===null && i < $(".tact:not('.zero')").length-1 || to_obj!==null && i <= $(".tact").index($(to_obj)); i++){
            flag = false
            j = $($(".tact")[i]).children().length - 1
            len_for_del = parseFloat(note_length[0]/note_length[1])

            while(j >= 0 && !flag) {
                this_len = $($($(".tact")[i]).children()[j]).attr("data-length").split('/')
                this_len_num = parseFloat(this_len[0]/this_len[1])

                last_len = $($($(".tact")[i+1]).children()[0]).attr("data-length").split('/')
                last_len_num = parseFloat(last_len[0]/last_len[1])
                new_val_0 = (""+(this_len_num + last_len_num)).split('.')
                if (new_val_0[0] == '1') {
                    M = 1;
                    N = 1
                } else {
                    new_val_0 = new_val_0[1]
                    m = Number(new_val_0)
                    n = 10**new_val_0.length
                    M = m
                    N = n
                    for (let ii = 2; ii <= m; ii++) {
                        if (m % ii === 0 &&  n % ii === 0)
                            M = m / ii, N = n / ii;
                    }
                }
                if (this_len_num - len_for_del < 0){
                    if ($($($(".tact")[i]).children()[j]).attr("all_pos_y") == $($($(".tact")[i+1]).children()[0]).attr("all_pos_y") && $($($(".tact")[i]).children()[j]).attr("league") && $($($(".tact")[i]).children()[j]).attr("league") != "end"){
                        for (let ind_note = 0; ind_note < $($($(".tact")[i+1]).children()[0]).length; ind_note++) {
                            change_note($($($($(".tact")[i+1]).children()[0]).children()[ind_note]), M+'/'+N)
                        }
                        if ($($($(".tact")[i]).children()[j]).attr("league") == "start" && $($($(".tact")[i+1]).children()[0]).attr("league") == "end"){
                            $($($(".tact")[i+1]).children()[0]).removeAttr("league")
                        } else if ($($($(".tact")[i]).children()[j]).attr("league") == "start"){
                            $($($(".tact")[i+1]).children()[0]).removeAttr("league", "start")
                        }
                        $($($(".tact")[i]).children()[j]).remove()
                    } else{
                        $($(".tact")[i+1]).prepend($($($(".tact")[i]).children()[j]))
                    }
                    len_for_del -= this_len_num
                } else if(this_len_num - len_for_del == 0){
                    if ($($($(".tact")[i]).children()[j]).attr("all_pos_y") == $($($(".tact")[i+1]).children()[0]).attr("all_pos_y") && $($($(".tact")[i]).children()[j]).attr("league") && $($($(".tact")[i]).children()[j]).attr("league") != "end"){
                        for (let ind_note = 0; ind_note < $($($(".tact")[i+1]).children()[0]).length; ind_note++) {
                            change_note($($($($(".tact")[i+1]).children()[0]).children()[ind_note]), M+'/'+N)
                        }
                        if ($($($(".tact")[i]).children()[j]).attr("league") == "start" && $($($(".tact")[i+1]).children()[0]).attr("league") == "end"){
                            $($($(".tact")[i+1]).children()[0]).removeAttr("league")
                        } else if ($($($(".tact")[i]).children()[j]).attr("league") == "start"){
                            $($($(".tact")[i+1]).children()[0]).removeAttr("league", "start")
                        }
                        $($($(".tact")[i]).children()[j]).remove()
                    } else{
                        $($(".tact")[i+1]).prepend($($($(".tact")[i]).children()[j]))
                    }
                    flag = true
                } else {
                    new_val_0 = (""+(this_len_num - len_for_del)).split('.')[1]
                    m = Number(new_val_0)
                    n = 10**new_val_0.length
                    M = m
                    N = n
                    for (let ii = 2; ii <= m; ii++) {
                        if (m % ii === 0 &&  n % ii === 0)
                            M = m / ii, N = n / ii;
                    }
                    for (let ind_note = 0; ind_note < $($($(".tact")[i]).children()[j]).children().length; ind_note++) {
                        change_note($($($($(".tact")[i]).children()[j]).children()[ind_note]), M+'/'+N)
                    }
                    if (!$($($(".tact")[i]).children()[j]).attr("league")){
                        $($($(".tact")[i]).children()[j]).attr("league", "start")
                        next_league = "end"
                    } else if ($($($(".tact")[i]).children()[j]).attr("league") == "start"){
                        next_league = "middle"
                    } else {
                        next_league = $($($(".tact")[i]).children()[j]).attr("league")
                        $($($(".tact")[i]).children()[j]).attr("league", "middle")
                    }
                    // change_note($($($(".tact")[i]).children()[j]), M+'/'+N)

                    new_val_0 = (""+(len_for_del)).split('.')[1]
                    m = Number(new_val_0)
                    n = 10**new_val_0.length
                    M = m
                    N = n
                    for (let i = 2; i <= m; i++) {
                        if (m % i === 0 &&  n % i === 0)
                            M = m / i, N = n / i;
                    }
                    str_length = M+'/'+N

                    zero_has = ''
                    if ( $($($(".tact")[i]).children()[j]).hasClass("zero") ){
                        zero_has = ' zero'
                    }
                    reverse_has = ''
                    if ( $($($(".tact")[i]).children()[j]).hasClass("reverse") ){
                        reverse_has = ' reverse'
                    }
                    $('<div class="column-in-tact'+zero_has+reverse_has+'" data-length="'+str_length+'" all_pos_y="'+$($($(".tact")[i]).children()[j]).attr("all_pos_y")+'" league="'+next_league+'"></div>').insertBefore($($(".tact")[i+1]).children()[0])
                    for (let ind_note = 0; ind_note < $($($(".tact")[i]).children()[j]).children().length; ind_note++) {
                        let row = $($($($(".tact")[i]).children()[j]).children()[ind_note]).attr("data-row")
                        $($($(".tact")[i+1]).children()[0]).append($('<div class="note on-'+row+'-row" data-row="'+row+'" data-length="'+str_length+'">'+notes_svg[str_length]+'</div>'))
                    }
                    flag = true
                }
                j--
            }
        }
    } else {
        innd = to_obj===null && $(".tact:not('.zero')").length-1 || to_obj!==null && $(".tact").index($(to_obj))
        $($(".tact")[innd]).append('<div class="column-in-tact zero" data-length="'+note_length[0]+'/'+note_length[1]+'"><div class="note zero on-3-row" data-row="3" data-length="'+note_length[0]+'/'+note_length[1]+'">пауза</div></div>')
        for (let i=to_obj===null && $(".tact:not('.zero')").length-1 || to_obj!==null && $(".tact").index($(to_obj)); i > $(".tact").index($($(from_obj).parent()).parent()); i--){

            flag = false
            j = 0
            len_for_del = parseFloat(note_length[0]/note_length[1])

            while($($(".tact")[i]).children().length != 0 && !flag) {
                this_len = $($($(".tact")[i]).children()[0]).attr("data-length").split('/')
                this_len_num = parseFloat(this_len[0]/this_len[1])

                last_len = $($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length - 1]).attr("data-length").split('/')
                last_len_num = parseFloat(last_len[0]/last_len[1])
                new_val_0 = (""+(this_len_num + last_len_num)).split('.')
                if (new_val_0[0] == '1') {
                    M = 1;
                    N = 1
                } else {
                    new_val_0 = new_val_0[1]
                    m = Number(new_val_0)
                    n = 10**new_val_0.length
                    M = m
                    N = n
                    for (let i = 2; i <= m; i++) {
                        if (m % i === 0 &&  n % i === 0)
                            M = m / i, N = n / i;
                    }
                }

                if (this_len_num - len_for_del < 0){
                    if ($($($(".tact")[i]).children()[j]).attr("all_pos_y") == $($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length-1]).attr("all_pos_y") && $($($(".tact")[i]).children()[j]).attr("league") && $($($(".tact")[i]).children()[j]).attr("league") != "start"){
                        for (let ind_note = 0; ind_note < $($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length-1]).length; ind_note++) {
                            change_note($($($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length-1]).children()[ind_note]), M+'/'+N)
                        }
                        if ($($($(".tact")[i]).children()[j]).attr("league") == "end" && $($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length-1]).attr("league") == "start"){
                            $($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length-1]).removeAttr("league")
                        } else if ($($($(".tact")[i]).children()[j]).attr("league") == "end"){
                            $($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length-1]).removeAttr("league", "end")
                        }
                        $($($(".tact")[i]).children()[j]).remove()
                    } else{
                        $($(".tact")[i-1]).append($($($(".tact")[i]).children()[j]))
                    }
                    len_for_del -= this_len_num
                } else if(this_len_num - len_for_del == 0){
                    if ($($($(".tact")[i]).children()[j]).attr("all_pos_y") == $($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length-1]).attr("all_pos_y") && $($($(".tact")[i]).children()[j]).attr("league") && $($($(".tact")[i]).children()[j]).attr("league") != "start"){
                        for (let ind_note = 0; ind_note < $($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length-1]).length; ind_note++) {
                            change_note($($($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length-1]).children()[ind_note]), M+'/'+N)
                        }
                        if ($($($(".tact")[i]).children()[j]).attr("league") == "end" && $($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length-1]).attr("league") == "start"){
                            $($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length-1]).removeAttr("league")
                        } else if ($($($(".tact")[i]).children()[j]).attr("league") == "end"){
                            $($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length-1]).removeAttr("league", "end")
                        }
                        $($($(".tact")[i]).children()[j]).remove()
                    } else {
                        $($(".tact")[i-1]).append($($($(".tact")[i]).children()[j]))
                    }
                    flag = true
                } else {
                    new_val_0 = (""+(this_len_num - len_for_del)).split('.')[1]
                    m = Number(new_val_0)
                    n = 10**new_val_0.length
                    M = m
                    N = n
                    for (let i = 2; i <= m; i++) {
                        if (m % i === 0 &&  n % i === 0)
                            M = m / i, N = n / i;
                    }
                    for (let ind_note = 0; ind_note < $($($(".tact")[i]).children()[j]).children().length; ind_note++) {
                        change_note($($($($(".tact")[i]).children()[j]).children()[ind_note]), M+'/'+N)
                    }
                    // $($($(".tact")[i]).children()[j]).attr("league", "end")

                    if (!$($($(".tact")[i]).children()[j]).attr("league")){
                        $($($(".tact")[i]).children()[j]).attr("league", "end")
                        prev_league = "start"
                    } else if($($($(".tact")[i]).children()[j]).attr("league") == "end"){
                        prev_league = "middle"
                    } else {
                        prev_league = $($($(".tact")[i]).children()[j]).attr("league")
                        $($($(".tact")[i]).children()[j]).attr("league", "middle")
                    }
                    // change_note($($($(".tact")[i]).children()[j]), M+'/'+N)

                    new_val_0 = (""+(len_for_del)).split('.')[1]
                    m = Number(new_val_0)
                    n = 10**new_val_0.length
                    M = m
                    N = n
                    for (let i = 2; i <= m; i++) {
                        if (m % i === 0 &&  n % i === 0)
                            M = m / i, N = n / i;
                    }
                    str_length = M+'/'+N

                    reverse_has = ''
                    if ( $($($(".tact")[i]).children()[j]).hasClass("reverse") ){
                        reverse_has = ' reverse'
                    }
                    $('<div class="column-in-tact'+reverse_has+'" data-length="'+str_length+'" all_pos_y="'+$($($(".tact")[i]).children()[j]).attr("all_pos_y")+'" league="'+prev_league+'"></div>').insertAfter($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length - 1])
                    for (let ind_note = 0; ind_note < $($($(".tact")[i]).children()[j]).children().length; ind_note++) {
                        let row = $($($($(".tact")[i]).children()[j]).children()[ind_note]).attr("data-row")
                        $($($(".tact")[i-1]).children()[$($(".tact")[i-1]).children().length - 1]).append($('<div class="note on-'+row+'-row" data-row="'+row+'" data-length="'+str_length+'">'+notes_svg[str_length]+'</div>'))
                    }
                    flag = true
                }
            }
        }
        if ($($($(".tact")[innd]).children()[0]).hasClass("zero")){
            $($(".tact")[innd]).addClass("zero")
        }
    }
}

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
        relocate_note($(from_obj), note_length)
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
                relocate_note($(obj), [M, N], to_next)
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
        relocate_note($(obj), $(obj).attr("data-length").split('/'), false)
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