function add_dimension(obj, dimension){
    if ($(obj).attr("data-type") == "key" && $($(".column-in-row")[$(".column-in-row").index($(obj)) + 1]).attr("data-type") != "dimension"){

        $('<div class="column-in-row dimension" data-value="'+dimension[0]+'/'+dimension[1]+'" data-type="dimension"><div>'+dimension[0]+'</div><div>'+dimension[1]+'</div></div>').insertAfter($(obj))
        new_tact_ind = $($(".column-in-row")[$(".column-in-row").index($(obj)) - 1]).attr("data-after-tact")
        $($(".dimension")[new_tact_ind]).attr("data-value", $($(".dimension")[new_tact_ind-1]).attr("data-value"))
        change_dimension(($(".dimension")[new_tact_ind]), dimension)
        new_width_tacts(null, new_tact_ind)

    } else if( $(obj).attr("data-type") == "tact" && ($(".column-in-row").index($(obj)) + 1 == $(".column-in-row").length || $($(".column-in-row")[$(".column-in-row").index($(obj)) + 1]).attr("data-type") == "tact") ){

        $('<div class="column-in-row dimension" data-value="0" data-type="dimension"><div>0</div><div>0</div></div>').insertAfter($(obj))
        new_tact_ind = $(obj).attr("data-after-tact")
        $($(".dimension")[new_tact_ind]).attr("data-value", $($(".dimension")[new_tact_ind-1]).attr("data-value"))
        change_dimension(($(".dimension")[new_tact_ind]), dimension)
        new_width_tacts(null, new_tact_ind)

    } else if( $(obj).attr("data-type") == "tact" && ($($(".column-in-row")[$(".column-in-row").index($(obj)) + 1]).attr("data-type") == "key" && $($(".column-in-row")[$(".column-in-row").index($(obj)) + 2]).attr("data-type") != "dimension")){

        $('<div class="column-in-row dimension" data-value="'+dimension[0]+'/'+dimension[1]+'" data-type="dimension"><div>'+dimension[0]+'</div><div>'+dimension[1]+'</div></div>').insertAfter($($(".column-in-row")[$(".column-in-row").index($(obj)) + 1]))
        new_tact_ind = $(obj).attr("data-after-tact")
        $($(".dimension")[new_tact_ind]).attr("data-value", $($(".dimension")[new_tact_ind-1]).attr("data-value"))
        change_dimension(($(".dimension")[new_tact_ind]), dimension)
        new_width_tacts(null, new_tact_ind)

    } else if($(obj).attr("data-type") == "note"){
        add_dimension($(obj).parent().parent(), dimension)
    }
    if ($(obj).attr("data-type") != "note"){
        html_to_json()
        were_changes = false
        all_from_zero(json_arr)
        close_now_menu()
    }
}

function change_dimension(obj=some_clicked, new_val=[3, 4]){
    old_value = $(obj).attr("data-value").split('/')

    difference = parseFloat( old_value[0] / old_value[1] ) - parseFloat( new_val[0] / new_val[1] )
    if (difference % 1 == 0 && difference!=0){
        Mm = Math.abs(difference), Nn = 1;
    } else {
        new_val_0 = (""+difference).split('.')[1]
        m = Number(new_val_0)
        n = 10**new_val_0.length
        M = m
        N = n
        for (let i = 2; i <= m; i++) {
            if (m % i === 0 &&  n % i === 0)
                Mm = m / i, Nn = n / i;
        }
        Mm += ((""+Math.abs(difference)).split('.')[0])*Nn
    }

    start__ = $(".tact").index( $(".column-in-row")[$(".column-in-row").index($(obj))+1] )

    if ($(".dimension").index($(obj))+1 != $(".dimension").length){
        end__ = $(".tact").index( $(".column-in-row")[ $(".column-in-row").index( $(".dimension")[ $(".dimension").index($(obj))+1 ] ) + 1 ] ) - 1
    } else {
        end__ = $(".tact").length - 1
    }
    

    if (difference > 0){
        flag_next = true
        len_tacts = end__ - start__ + 1
        count_new_tact = Math.ceil(parseFloat(Mm*len_tacts/Nn)/parseFloat( new_val[0] / new_val[1] ))
        $('<div class="column-in-row tact tact-after-1" data-type="tact"><div class="column-in-tact" data-length="0/4" data-type="column-tact" all_pos_y="-10"><div class="note on-4-row" data-row="4" data-length="1/4" data-type="note"></div></div></div>'.repeat(count_new_tact)).insertAfter($(".tact")[end__])
        for (let i = start__; i <= end__; i++) {
            relocate_note( $($($(".tact")[i]).children()[0]).children()[0], [Mm*(i-start__+1), Nn], flag_next, $(".tact")[i] )
        }
        differen = parseFloat( Mm*(end__-start__+1) / Nn )
        for (let i = end__+1; i < end__+count_new_tact; i++){
            differen = differen - parseFloat( new_val[0] / new_val[1] )
            if (differen % 1 == 0 && differen!=0){
                Mmm = differen, Nnn = 1;
            } else {
                new_val_0 = (""+differen).split('.')[1]
                m = Number(new_val_0)
                n = 10**new_val_0.length
                M = m
                N = n
                for (let i = 2; i <= m; i++) {
                    if (m % i === 0 &&  n % i === 0)
                        Mmm = (m / i), Nnn = n / i;
                }
                Mmm += ((""+differen).split('.')[0])*Nnn
            }
            $($($(".tact")[i]).children()[ $($(".tact")[i]).children().length-1 ]).remove()
            relocate_note( $($($(".tact")[i]).children()[0]).children()[0], [Mmm, Nnn], flag_next, $(".tact")[i] )
        }
        $($($(".tact")[end__+count_new_tact]).children()[ $($(".tact")[end__+count_new_tact]).children().length-1 ]).remove()
        total_len = 0
        for (let i = 0; i < $($(".tact")[end__+count_new_tact]).children().length; i++) {
            some_var = $($($(".tact")[end__+count_new_tact]).children()[i]).attr("data-length").split('/')
            total_len += parseFloat(some_var[0]/some_var[1])
        }
        difference = parseFloat( new_val[0]/new_val[1] )-total_len
        if (difference % 1 == 0 && difference!=0){
            Mmm = difference, Nnn = 1;
        } else if (difference!=0) {
            new_val_0 = (""+difference).split('.')[1]
            m = Number(new_val_0)
            n = 10**new_val_0.length
            M = m
            N = n
            for (let i = 2; i <= m; i++) {
                if (m % i === 0 &&  n % i === 0)
                    Mmm = (m / i), Nnn = n / i;
            }
            for (var i = 1; i <= Mmm; i++) {
                $($(".tact")[end__+count_new_tact]).append($('<div class="column-in-tact zero" data-length="1/'+Nnn+'" data-type="column-tact" all_pos_y="3"><div class="note on-4-row" data-row="4" data-length="1/4" data-type="note">пауза</div></div>'))
            }
        }
        index = 0
        while ( $($($(".tact")[end__+count_new_tact-index]).children()[0]).hasClass("zero") ){
            $($(".tact")[end__+count_new_tact-index]).remove()
            index++;
        }
    } else {
        flag_next = false
        len_tacts = end__ - start__ + 1
        count_new_tact = Math.ceil(parseFloat(old_value[0]*len_tacts/old_value[1])/parseFloat( new_val[0] / new_val[1] ))
        for (var i = end__-1; i >= count_new_tact+start__-1; i--) {
            relocate_note( $($($(".tact")[i]).children()[0]).children()[0], [(old_value[0]*(end__-i+1)), old_value[1]], flag_next, $(".tact")[i+1] )
            $($(".tact")[i+1]).remove()
        }
        for (let i = count_new_tact+start__-2; i >= start__; i--) {
            relocate_note( $($($(".tact")[i]).children()[0]).children()[0], [(Mm*(i-start__+1)), Nn], flag_next, $(".tact")[i+1] )
        }
        // $($(".tact")[count_new_tact+start__]).remove()
        total_len = 0
        for (let i = 0; i < $($(".tact")[count_new_tact+start__-1]).children().length; i++) {
            some_var = $($($(".tact")[count_new_tact+start__-1]).children()[i]).attr("data-length").split('/')
            total_len += parseFloat(some_var[0]/some_var[1])
        }
        difference = parseFloat( new_val[0]/new_val[1] )-total_len
        if (difference != 0){
            if (difference % 1 != 0){
                new_val_0 = (""+difference).split('.')[1]
                m = Number(new_val_0)
                n = 10**new_val_0.length
                M = m
                N = n
                for (let i = 2; i <= m; i++) {
                    if (m % i === 0 &&  n % i === 0)
                        Mmm = (m / i), Nnn = n / i;
                }
                Mmm += ((""+Math.abs(difference)).split('.')[0])*Nnn
            } else {
                Mmm = Math.abs(difference)
                Nnn = 1
            }
            for (var i = 1; i <= Mmm; i++) {
                $($(".tact")[count_new_tact+start__-1]).append($('<div class="column-in-tact zero" data-length="1/'+Nnn+'" data-type="column-tact" all_pos_y="3"><div class="note on-4-row" data-row="4" data-length="1/4" data-type="note">пауза</div></div>'))
            }
        }
        index = 1
        while ( $($($(".tact")[count_new_tact+start__-index]).children()[0]).hasClass("zero") ){
            $($(".tact")[count_new_tact+start__-index]).remove()
            index++;
        }
    }
    $(obj).attr("data-value", new_val[0]+"/"+new_val[1])
    $($(obj).children()[0]).html(new_val[0])
    $($(obj).children()[1]).html(new_val[1])
    draw_league()
    html_to_json()
    were_changes = false
    all_from_zero(json_arr)
    close_now_menu()
}

function delete_dimension(obj){
    if (obj.is($(".dimension")[0])){
        alert("руки на стол")
    } else {
        change_dimension(obj, $($(".dimension")[$(".dimension").index($(obj))-1]).attr("data-value").split('/'))
        $(obj).remove()
    }
    were_changes = true
    close_now_menu()
}