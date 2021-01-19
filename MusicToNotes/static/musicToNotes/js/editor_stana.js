function random_json(start_key=null, start_dimension=null, count_key=2, count_dimension=2, count_tact=16, max_in_column=null, league=false){
    let new_json = []
    if (start_key === null){
        start_key = all_key[Math.floor(Math.random()*all_key.length)]
    }
    if (start_dimension === null){
        start_dimension = all_dimension[Math.floor(Math.random()*all_dimension.length)]
    }
    if (count_key === null){
        count_key = 1
    }
    if (count_dimension === null){
        count_dimension = 1
    }
    if (count_tact === null){
        change_every = 2
        count_tact = change_every*(count_key+count_dimension-1)
    } else {
        change_every = Math.floor(count_tact/(count_key+count_dimension-1))
    }
    if (max_in_column === null){
        max_in_column = 2
    }
    keys_were = 0
    dimensions_were = 0
    for (var i = 0; i < count_tact; i++) {
        if (i == 0){
            key_now = start_key
            dimension_now = start_dimension
            last_key = start_key
            last_dimension = start_dimension
            keys_were++
            dimensions_were++
            new_json.push({
                        "key": key_now,
                        "dimension": dimension_now,
                        "content": []
                    })
        } else if (i % change_every == 0){
            if(Math.random()*2 >= 1 && keys_were<count_key || dimensions_were==count_dimension){
                do {
                    key_now = all_key[Math.floor(Math.random()*all_key.length)]
                } while (key_now == last_key)
                last_key = key_now
                dimension_now = []
                keys_were++
            } else{
                do {
                    dimension_now = all_dimension[Math.floor(Math.random()*all_dimension.length)]
                } while (dimension_now == last_dimension)
                last_dimension = dimension_now
                key_now = ''
                dimensions_were++
            }
            new_json.push({
                        "key": key_now,
                        "dimension": dimension_now,
                        "content": []
                    })
        }
        new_json[new_json.length-1]["content"].push([])
        for (var j = 0; j < last_dimension[0]; j++) {
            new_json[new_json.length-1]["content"][new_json[new_json.length-1]["content"].length-1].push([''])
            max = Math.floor(Math.random()*(max_in_column))
            for (var z = 0; z <= max; z++) {
                svg_key = "1/"+last_dimension[1]
                y_pos = 1+Math.floor(Math.random()*(10-1))/2
                if (y_pos % 1 != 0){
                    y_pos = Math.floor(y_pos)+'-between-'+Math.ceil(y_pos)
                }
                new_json[new_json.length-1]["content"][new_json[new_json.length-1]["content"].length-1][new_json[new_json.length-1]["content"][new_json[new_json.length-1]["content"].length-1].length-1].push({
                            "svg_key": svg_key,
                            "y_pos" : y_pos
                        })
            }
        }
    }
    return new_json
}

// json_arr = my_array
json_arr_before_save = json_arr

function random_html(){
    all_from_zero(random_json())
}

function new_width_tacts(array=null, only=null, add_new=0) {
    if (array !== null){
        ind_dimension = 0
        for (var i=0; i<array.length; i++){
            if (Number(array[i]["dimension"]) != 0){
                ind_dimension++
                new_val = array[i]["dimension"]
                count_in_tact = parseInt(new_val[0]*4/new_val[1])+1
                length_tact = size*(count_in_tact)*width_present
                // $($(".dimension")[i-1]).attr("data-count-in", count_in_tact+"")
                $("#style-tact-after").html( $("#style-tact-after").html() + '<style id="style-tact-after-'+ind_dimension+'" type="text/css">.tact-after-'+ind_dimension+'{width: '+length_tact+'px;}</style>' )
            }
        }
    } else if (add_new != 0) {
        style = $("#style-tact-after").html().split('tact-after-')
        copy_add_new = add_new
        for (var i = 1+(add_new-1)*2; i < style.length; i++) {
            style[i] = style[i].replace(copy_add_new+'', copy_add_new+1)
            if (i % 2 == 0){
                copy_add_new++
            }
        }
        style = style.join('tact-after-')
        style = style.split('<style')
        style.splice(add_new-1, 0, style[add_new-1])
        style[add_new] = style[add_new].replace('tact-after-'+(add_new-1), 'tact-after-'+add_new)
        style[add_new] = style[add_new].replace('tact-after-'+(add_new-1), 'tact-after-'+add_new)
        style = style.join('<style')
        $("#style-tact-after").html(style)
    } else if (only !== null){
        style = $("#style-tact-after").html().split('<style')
        new_val = $($(".dimension")[only]).attr("data-value").split('/')
        count_in_tact = parseInt(new_val[0]*4/new_val[1])+1
        length_tact = size*(count_in_tact)*width_present
        only++
        $("#style-tact-after-"+only).html('.tact-after-'+only+'{width: '+length_tact+'px;}')
    }
}

function all_from_zero(array_json=json_arr){
    $("#main2").html('')
    free = $("#main2").width()

    for (let ind_key = 0; ind_key < array_json.length; ind_key++) {
        dimension_now = array_json[ind_key]["dimension"]
        if (ind_key == 0){
            key_now = array_json[ind_key]["key"]
            add_row()
            free -= $($(".column-in-row")[$(".column-in-row").length - 1]).width()
            $($(".column-in-row")[$(".column-in-row").length - 1]).addClass('first')
            $('<div class="column-in-row dimension first" data-value="'+array_json[ind_key]["dimension"][0]+'/'+array_json[ind_key]["dimension"][1]+'" data-type="dimension"><div>'+array_json[ind_key]["dimension"][0]+'</div><div>'+array_json[ind_key]["dimension"][1]+'</div></div>').insertAfter($($(".key")[0]))
            free -= $($(".column-in-row")[$(".column-in-row").length - 1]).width()
            $("#style-tact-after").html('')
            new_width_tacts(array_json)
            ind_dimension = 1
        } else {
            if (Number(array_json[ind_key]["key"]) != 0){
                key_now = array_json[ind_key]["key"]
                add_key($(".column-in-row")[$(".column-in-row").length - 1], key_now)
                free -= $($(".column-in-row")[$(".column-in-row").length - 1]).width()
            }
            if (Number(dimension_now) != 0){
                $('<div class="column-in-row dimension" data-value="'+dimension_now[0]+'/'+dimension_now[1]+'" data-type="dimension"><div>'+dimension_now[0]+'</div><div>'+dimension_now[1]+'</div></div>').insertAfter($(".column-in-row")[$(".column-in-row").length - 1])
                free -= $($(".column-in-row")[$(".column-in-row").length - 1]).width()
                ind_dimension++
            }
        }
        if (free < 0){
            add_row()
            $($(".column-in-row")[$(".column-in-row").length - 2]).insertAfter($($(".column-in-row")[$(".column-in-row").length - 1]))
            free = $("#main2").width() - $($(".column-in-row")[$(".column-in-row").length - 1]).width() - $($(".column-in-row")[$(".column-in-row").length - 2]).width()
            if ($($(".column-in-row")[$(".column-in-row").length - 3]).attr("data-type") == "key") {
                $($(".column-in-row")[$(".column-in-row").length - 3]).remove()
            }
            if ($($(".column-in-row")[$(".column-in-row").length - 3]).attr("data-type") == "dimension") {
                $($(".column-in-row")[$(".column-in-row").length - 3]).insertAfter($($(".column-in-row")[$(".column-in-row").length - 2]))
                free -= $($(".column-in-row")[$(".column-in-row").length - 2]).width()
            }
            if ($($(".column-in-row")[$(".column-in-row").length - 1]).attr("data-type") == "key") {
                free += $($(".column-in-row")[$(".column-in-row").length - 1]).width()
                $($(".column-in-row")[$(".column-in-row").length - 1]).remove()
            }
        }

        for (let ind_tact = 0; ind_tact < array_json[ind_key]["content"].length; ind_tact++) {
            $($(".row-stan")[$(".row-stan").length - 1]).append('<div class="column-in-row tact tact-after-'+ind_dimension+' off-flex-width" data-type="tact" data-after-tact="'+ind_dimension+'"></div>')
            free -= $($(".column-in-row")[$(".column-in-row").length - 1]).width()
            if (free < 0){
                add_row()
                $($(".column-in-row")[$(".column-in-row").length - 2]).insertAfter($($(".column-in-row")[$(".column-in-row").length - 1]))
                free = $("#main2").width() - $($(".column-in-row")[$(".column-in-row").length - 1]).width() - $($(".column-in-row")[$(".column-in-row").length - 2]).width()
                if ($($(".column-in-row")[$(".column-in-row").length - 3]).attr("data-type") == "key") {
                    $($(".column-in-row")[$(".column-in-row").length - 3]).remove()
                }
                if ($($(".column-in-row")[$(".column-in-row").length - 3]).attr("data-type") == "dimension") {
                    $($(".column-in-row")[$(".column-in-row").length - 3]).insertAfter($($(".column-in-row")[$(".column-in-row").length - 2]))
                    free -= $($(".column-in-row")[$(".column-in-row").length - 2]).width()
                }
            }


            for (let ind_col = 0; ind_col < array_json[ind_key]["content"][ind_tact].length; ind_col++) {
                $($(".tact")[$(".tact").length - 1]).append('<div class="column-in-tact" data-length="'+array_json[ind_key]["content"][ind_tact][ind_col][1]["svg_key"]+'" data-type="column-tact" league='+array_json[ind_key]["content"][ind_tact][ind_col][0]+'></div>')
                all_pos_y = ""
                reverse = ''
                for (let ind_elem = 0; ind_elem < array_json[ind_key]["content"][ind_tact][ind_col].length-1; ind_elem++) {
                    row = array_json[ind_key]["content"][ind_tact][ind_col][ind_elem+1]["y_pos"]
                    length = array_json[ind_key]["content"][ind_tact][ind_col][ind_elem+1]["svg_key"]
                    last_int_ind = parseInt(array_json[ind_key]["content"][ind_tact][ind_col].length/2)
                    mod = parseInt(array_json[ind_key]["content"][ind_tact][ind_col].length/2) % 2
                    if(reverse == '' && row > "3" && (ind_elem < last_int_ind && mod == 1 || ind_elem <= last_int_ind && mod == 0) ) {
                        reverse = "reverse"
                    }
                    betw = ''
                    if ((row+'').includes('between')){
                        betw = ' between'
                    }
                    $($(".column-in-tact")[$(".column-in-tact").length - 1]).append('<div class="note on-'+row+'-row'+betw+'" data-row="'+row+'" data-length="'+length+'" data-type="note">'+notes_svg[array_json[ind_key]["content"][ind_tact][ind_col][ind_elem+1]["svg_key"]]+'</div>')
                    all_pos_y += row + ','
                }
                $($(".column-in-tact")[$(".column-in-tact").length - 1]).attr("all_pos_y", all_pos_y.slice(0, -1))
                $($(".column-in-tact")[$(".column-in-tact").length - 1]).addClass(reverse)
            }
        }
    }
    while (free >= 0){
        $($(".row-stan")[$(".row-stan").length - 1]).append('<div class="column-in-row tact tact-after-'+ind_dimension+' off-flex-width zero"><div class="column-in-tact zero" data-length="'+dimension_now[0]+'/'+dimension_now[1]+'"><div class="note zero on-3-row">пауза</div></div></div>')
        free -= $($(".column-in-row")[$(".column-in-row").length - 1]).width()
    }
    $($(".column-in-row")[$(".column-in-row").length - 1]).remove()
    $($(".column-in-row")[$(".column-in-row").length - 1]).css("border-right", "solid black 6px")
    $($(".row-stan")[$(".row-stan").length - 1]).css("border-right", "solid black 6px")
    $($(".row-stan")[$(".row-stan").length - 1]).css("padding-right", "4px")
    $(".tact").toggleClass("off-flex-width")
    draw_league()
}

function new_all_from_zero(array_json=json_arr){
    $("#main2").html('')
    free = $("#main2").width()

    for (let ind_key = 0; ind_key < array_json.length; ind_key++) {
        dimension_now = array_json[ind_key]["dimension"]
        if (ind_key == 0){
            key_now = array_json[ind_key]["key"]
            add_row()
            free -= $($(".column-in-row")[$(".column-in-row").length - 1]).width()
            $($(".column-in-row")[$(".column-in-row").length - 1]).addClass('first')
            $('<div class="column-in-row dimension first" data-value="'+array_json[ind_key]["dimension"][0]+'/'+array_json[ind_key]["dimension"][1]+'" data-type="dimension"><div>'+array_json[ind_key]["dimension"][0]+'</div><div>'+array_json[ind_key]["dimension"][1]+'</div></div>').insertAfter($($(".key")[0]))
            free -= $($(".column-in-row")[$(".column-in-row").length - 1]).width()
            $("#style-tact-after").html('')
            new_width_tacts(array_json)
            ind_dimension = 1
        } else {
            if (Number(array_json[ind_key]["key"]) != 0){
                key_now = array_json[ind_key]["key"]
                add_key($(".column-in-row")[$(".column-in-row").length - 1], key_now)
                free -= $($(".column-in-row")[$(".column-in-row").length - 1]).width()
            }
            if (Number(dimension_now) != 0){
                $('<div class="column-in-row dimension" data-value="'+dimension_now[0]+'/'+dimension_now[1]+'" data-type="dimension"><div>'+dimension_now[0]+'</div><div>'+dimension_now[1]+'</div></div>').insertAfter($(".column-in-row")[$(".column-in-row").length - 1])
                free -= $($(".column-in-row")[$(".column-in-row").length - 1]).width()
                ind_dimension++
            }
        }
        if (free < 0){
            add_row()
            $($(".column-in-row")[$(".column-in-row").length - 2]).insertAfter($($(".column-in-row")[$(".column-in-row").length - 1]))
            free = $("#main2").width() - $($(".column-in-row")[$(".column-in-row").length - 1]).width() - $($(".column-in-row")[$(".column-in-row").length - 2]).width()
            if ($($(".column-in-row")[$(".column-in-row").length - 3]).attr("data-type") == "key") {
                $($(".column-in-row")[$(".column-in-row").length - 3]).remove()
            }
            if ($($(".column-in-row")[$(".column-in-row").length - 3]).attr("data-type") == "dimension") {
                $($(".column-in-row")[$(".column-in-row").length - 3]).insertAfter($($(".column-in-row")[$(".column-in-row").length - 2]))
                free -= $($(".column-in-row")[$(".column-in-row").length - 2]).width()
            }
            if ($($(".column-in-row")[$(".column-in-row").length - 1]).attr("data-type") == "key") {
                free += $($(".column-in-row")[$(".column-in-row").length - 1]).width()
                $($(".column-in-row")[$(".column-in-row").length - 1]).remove()
            }
        }

        for (let ind_tact = 0; ind_tact < array_json[ind_key]["content"].length; ind_tact++) {
            $($(".row-stan")[$(".row-stan").length - 1]).append('<div class="column-in-row tact tact-after-'+ind_dimension+' off-flex-width" data-type="tact" data-after-tact="'+ind_dimension+'"></div>')
            free -= $($(".column-in-row")[$(".column-in-row").length - 1]).width()
            if (free < 0){
                add_row()
                $($(".column-in-row")[$(".column-in-row").length - 2]).insertAfter($($(".column-in-row")[$(".column-in-row").length - 1]))
                free = $("#main2").width() - $($(".column-in-row")[$(".column-in-row").length - 1]).width() - $($(".column-in-row")[$(".column-in-row").length - 2]).width()
                if ($($(".column-in-row")[$(".column-in-row").length - 3]).attr("data-type") == "key") {
                    $($(".column-in-row")[$(".column-in-row").length - 3]).remove()
                }
                if ($($(".column-in-row")[$(".column-in-row").length - 3]).attr("data-type") == "dimension") {
                    $($(".column-in-row")[$(".column-in-row").length - 3]).insertAfter($($(".column-in-row")[$(".column-in-row").length - 2]))
                    free -= $($(".column-in-row")[$(".column-in-row").length - 2]).width()
                }
            }


            for (let ind_col = 0; ind_col < array_json[ind_key]["content"][ind_tact].length; ind_col++) {
                $($(".tact")[$(".tact").length - 1]).append('<div class="column-in-tact" data-length="'+array_json[ind_key]["content"][ind_tact][ind_col][1]["svg_key"]+'" data-type="column-tact" league='+array_json[ind_key]["content"][ind_tact][ind_col][0]+'></div>')
                all_pos_y = ""
                reverse = ''
                for (let ind_elem = 0; ind_elem < array_json[ind_key]["content"][ind_tact][ind_col].length-1; ind_elem++) {
                    row = array_json[ind_key]["content"][ind_tact][ind_col][ind_elem+1]["y_pos"]
                    length = array_json[ind_key]["content"][ind_tact][ind_col][ind_elem+1]["svg_key"]
                    last_int_ind = parseInt(array_json[ind_key]["content"][ind_tact][ind_col].length/2)
                    mod = parseInt(array_json[ind_key]["content"][ind_tact][ind_col].length/2) % 2
                    if(reverse == '' && row > "3" && (ind_elem < last_int_ind && mod == 1 || ind_elem <= last_int_ind && mod == 0) ) {
                        reverse = "reverse"
                    }
                    betw = ''
                    if ((row+'').includes('between')){
                        betw = ' between'
                    }
                    new_note = $('<div class="note on-1-row'+betw+'" data-row="1" data-length="'+length+'" data-type="note">'+notes_svg[array_json[ind_key]["content"][ind_tact][ind_col][ind_elem+1]["svg_key"]]+'</div>')
                    $($(".column-in-tact")[$(".column-in-tact").length - 1]).append(new_note)
                    all_pos_y += row + ','
                    $($(".column-in-tact")[$(".column-in-tact").length - 1]).attr("all_pos_y", all_pos_y.slice(0, -2)+"1")
                    new_change_pos_y($(new_note), row)
                }
                
                $($(".column-in-tact")[$(".column-in-tact").length - 1]).addClass(reverse)
            }
        }
    }
    while (free >= 0){
        $($(".row-stan")[$(".row-stan").length - 1]).append('<div class="column-in-row tact tact-after-'+ind_dimension+' off-flex-width zero"><div class="column-in-tact zero" data-length="'+dimension_now[0]+'/'+dimension_now[1]+'"><div class="note zero on-3-row">пауза</div></div></div>')
        free -= $($(".column-in-row")[$(".column-in-row").length - 1]).width()
    }
    $($(".column-in-row")[$(".column-in-row").length - 1]).remove()
    $($(".column-in-row")[$(".column-in-row").length - 1]).css("border-right", "solid black 6px")
    $($(".row-stan")[$(".row-stan").length - 1]).css("border-right", "solid black 6px")
    $($(".row-stan")[$(".row-stan").length - 1]).css("padding-right", "4px")
    $(".tact").toggleClass("off-flex-width")
    draw_league()
}

function delete_empty_rows(){
    var i = 0
    while (i < $(".row-stan").length) {
        if ($($(".row-stan")[i]).children().length <= 1) {
            $(".row-stan")[i].remove()
        } else {
            i++
        }
    }
}

function change_pos_y_after_key(index_key, offset){
    if (offset != 0){
        start_note_index = $(".column-in-row").index($(".key")[index_key])+1
        if ($($(".column-in-row")[start_note_index]).attr("data-type") == "dimension"){
            start_note_index++
        }
        start_note_index = $(".note").index( $($($(".column-in-row")[start_note_index]).children()[0]).children()[0] )
        next_key_index = index_key+1
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
    were_changes = true
}

function add_row(){
    count_row++
    let base_div_row = document.createElement('div')
    base_div_row.id = "row-"+($("#main2").children().length+1)
    base_div_row.className = "row-stan";
    base_div_row.innerHTML = '<div class="column-in-row key key-'+key_now+'" data-value="'+key_now+'" data-type="key">'+keys_svg[key_now]+'</div>'
    $("#main2").append(base_div_row)
}

function sort_column_in_tact(obj){
    $($(obj).children().sort(function (a, b) {
        a = ""+$(a).attr("data-row");
        b = ""+$(b).attr("data-row");
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    })).appendTo($(obj))
}

function change_pos_y(obj, offset=1){
    old_row = $(obj).attr("data-row")
    if ((old_row+'').includes('between')){
        $(obj).removeClass('between')
    }
    $(obj).removeClass("on-"+old_row+"-row")
    if ( old_row.indexOf('-between-') != -1) {
        if (offset % 2 == 1 || offset % 2 == -1){
            new_class = Number(old_row.split('-between-')[Number(offset>0)])
            new_class += (offset-1*((-1)**Number(!(offset>0))))/2
        } else {
            first_new_class = Number(old_row.split('-between-')[0]) + offset/2
            second_new_class = Number(old_row.split('-between-')[1]) + offset/2
            new_class = first_new_class + "-between-" + second_new_class
        }
    } else {
        if (offset % 2 == 1 || offset % 2 == -1){
            first_new_class = Number(old_row)-1*Number(!(offset>0)) + (offset-1*((-1)**Number(!(offset>0))))/2
            second_new_class = Number(old_row)+1*Number(offset>0) + (offset-1*((-1)**Number(!(offset>0))))/2
            new_class = first_new_class+"-between-"+second_new_class
        } else {
            new_class = Number(old_row) + offset/2
        }
    }
    $(obj).addClass("on-"+new_class+"-row")
    if ((new_class+'').includes('between')){
        $(obj).addClass('between')
    }
    let all_pos_y = $($(obj).parent()).attr("all_pos_y").split(',')
    all_pos_y.splice(all_pos_y.indexOf(old_row), 1)
    let new_all_pos_y = all_pos_y
    $(obj).attr("data-row", new_class)
    new_all_pos_y.push(new_class)
    new_all_pos_y.sort()

    j = 0
    flag = false
    mod = parseInt(new_all_pos_y.length/2) % 2
    while ((mod == 1 && j < parseInt(new_all_pos_y.length/2) || mod == 0 && j <= parseInt(new_all_pos_y.length/2)) && !flag) {
        if (new_all_pos_y[j] > "3"){
            flag = true
        }
        j++
    }
    if (flag) {
        $($(obj).parent()).addClass("reverse")
    } else {
        $($(obj).parent()).removeClass("reverse")
    }

    sort_column_in_tact($(obj).parent())
    $($(obj).parent()).attr("all_pos_y",  new_all_pos_y.join())
    if ($(obj).parent().attr("league")){
        draw_league()
    }
    were_changes = true
    close_now_menu()
}

function new_change_pos_y(obj, offset=1){
    diez = [0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1]
    count_no_diez = 0
    ind_diez = 1
    while (ind_diez <= offset){
        if (diez[ind_diez % diez.length] == 0){
            count_no_diez++
        }
        ind_diez++
    }
    offset = count_no_diez
    old_row = $(obj).attr("data-row")
    if ((old_row+'').includes('between')){
        $(obj).removeClass('between')
    }
    $(obj).removeClass("on-"+old_row+"-row")
    if ( old_row.indexOf('-between-') != -1) {
        if (offset % 2 == 1 || offset % 2 == -1){
            new_class = Number(old_row.split('-between-')[Number(offset>0)])
            new_class += (offset-1*((-1)**Number(!(offset>0))))/2
        } else {
            first_new_class = Number(old_row.split('-between-')[0]) + offset/2
            second_new_class = Number(old_row.split('-between-')[1]) + offset/2
            new_class = first_new_class + "-between-" + second_new_class
        }
    } else {
        if (offset % 2 == 1 || offset % 2 == -1){
            first_new_class = Number(old_row)-1*Number(!(offset>0)) + (offset-1*((-1)**Number(!(offset>0))))/2
            second_new_class = Number(old_row)+1*Number(offset>0) + (offset-1*((-1)**Number(!(offset>0))))/2
            new_class = first_new_class+"-between-"+second_new_class
        } else {
            new_class = Number(old_row) + offset/2
        }
    }
    $(obj).addClass("on-"+new_class+"-row")
    if ((new_class+'').includes('between')){
        $(obj).addClass('between')
    }
    let all_pos_y = $($(obj).parent()).attr("all_pos_y").split(',')
    all_pos_y.splice(all_pos_y.indexOf(old_row), 1)
    let new_all_pos_y = all_pos_y
    $(obj).attr("data-row", new_class)
    new_all_pos_y.push(new_class)
    new_all_pos_y.sort()

    j = 0
    flag = false
    mod = parseInt(new_all_pos_y.length/2) % 2
    while ((mod == 1 && j < parseInt(new_all_pos_y.length/2) || mod == 0 && j <= parseInt(new_all_pos_y.length/2)) && !flag) {
        if (new_all_pos_y[j] > "3"){
            flag = true
        }
        j++
    }
    if (flag) {
        $($(obj).parent()).addClass("reverse")
    } else {
        $($(obj).parent()).removeClass("reverse")
    }

    sort_column_in_tact($(obj).parent())
    $($(obj).parent()).attr("all_pos_y",  new_all_pos_y.join())
    if ($(obj).parent().attr("league")){
        draw_league()
    }
    were_changes = true
    close_now_menu()
}

function correct_change_pos_x(obj, on_right=true){
    add_note(obj, $(obj).attr("data-length").split('/'), on_right, true, true)
    delete_note(obj)
}

function change_pos_x(obj, on_right=true){
    let pos_y = $(obj).attr("data-row")
    let all_pos_y = $($(obj).parent()).attr("all_pos_y").split(',')
    all_pos_y.splice(all_pos_y.indexOf($(obj).attr("data-row")), 1)
    $($(obj).parent()).attr("all_pos_y", all_pos_y)
    if ($($(obj).parent()).children().length == 1) {

        // if ( $($(".column-in-tact")[$(".column-in-tact").index($($(obj).parent()))+Number(on_right)*2-1]).attr("all_pos_y").split(',').indexOf(pos_y) == -1 ) {
        next_obj = $($(".column-in-tact")[$(".column-in-tact").index($($(obj).parent()))+Number(on_right)*2-1])
        parent_now = $(obj).parent()
        $(next_obj).append($(obj))
        $(parent_now).remove()
        let new_all_pos_y = $(next_obj).attr("all_pos_y")
        new_all_pos_y = new_all_pos_y && new_all_pos_y.split(',') || []
        new_all_pos_y.push(pos_y)
        new_all_pos_y.sort()
        $(next_obj).attr("all_pos_y",  new_all_pos_y.join())
    } else {
        if (on_right) {
            $('<div class="column-in-tact" data-length="'+$(obj).attr("data-length")+'" all_pos_y="'+$(obj).attr("data-row")+'"></div>').insertAfter($($(obj).parent()))
            $($(".column-in-tact")[$(".column-in-tact").index($(obj).parent())+1]).append($(obj))
        } else {
            $('<div class="column-in-tact" data-length="'+$(obj).attr("data-length")+'" all_pos_y="'+$(obj).attr("data-row")+'"></div>').insertBefore($($(obj).parent()))
            $($(".column-in-tact")[$(".column-in-tact").index($(obj).parent())-1]).append($(obj))
        }
    }
}

function draw_league(){
    $("#place-for-leagues").html("")
    for (var i = 0; i < $(".column-in-tact[league = 'start']").length; i++) {
        start = $(".column-in-tact[league = 'start']")[i]
        offset_start = $(start).offset()
        width_start = $(start).width()
        lower_start = $($(start).children()[0]).offset()["top"] + $($(start).children()[0]).height() + 5
        top_start = $($(start).children()[ $(start).children().length-1 ]).offset()["top"]
        reverse_start = $(start).hasClass("reverse")

        end = $(".column-in-tact[league = 'end']")[i]
        offset_end = $(end).offset()
        width_end = $(end).width()
        lower_end = $($(end).children()[0]).offset()["top"] + $($(end).children()[0]).height() + 5
        top_end = $($(end).children()[ $(end).children().length-1 ]).offset()["top"]
        reverse_end = $(end).hasClass("reverse")

        reverse = " reverse"
        origin = "bottom left"

        if ($(start).parent().parent().is($(end).parent().parent())){
            if (reverse_start == reverse_end){
                if (reverse_start == true){
                    width_league = Math.sqrt( (top_start-top_end)**2 + (offset_end["left"]-offset_start["left"])**2 )
                    top_league = top_start - 25
                    alfa = Math.asin( Math.abs(top_start-top_end)/width_league )*180/Math.PI
                    if (top_start-top_end > 0){
                        alfa = -alfa
                    }
                } else {
                    width_league = Math.sqrt( (lower_start-lower_end)**2 + (offset_end["left"]-offset_start["left"])**2 )
                    top_league = lower_start
                    reverse = ""
                    origin = "top left"
                    alfa = Math.asin( Math.abs(lower_start-lower_end)/width_league )*180/Math.PI
                    if (lower_start-lower_end > 0){
                        alfa = -alfa
                    }
                }
            } else {
                width_league = Math.sqrt( (top_start-top_end)**2 + (offset_end["left"]-offset_start["left"])**2 )
                top_league = top_start - 25
                alfa = Math.asin( Math.abs(top_start-top_end)/width_league )*180/Math.PI
                if (top_start-top_end > 0){
                    alfa = -alfa
                }
            }

            // width_league = (offset_end["left"] + parseInt(width_end/2)) - (offset_start["left"] + parseInt(width_start/2))
            // top_league = Math.max(lower_start, lower_end)
            left_league = offset_start["left"] + parseInt(width_start/2)

            $("#place-for-leagues").append('<div class="league'+reverse+'" style="transform-origin: '+origin+'; transform: rotate('+alfa+'deg); width: '+width_league+'px;top: '+top_league+'px;left: '+left_league+'px"><img src="../../static/musicToNotes/img/liga.png"></div>')
        } else {
            width_league1 = ($(start).parent().parent().offset()["left"] + $(start).parent().parent().width()) - (offset_start["left"] + parseInt(width_start/2))
            top_league1 = lower_start
            left_league1 = offset_start["left"] + parseInt(width_start/2)


            left_league2 = $(end).parent().parent().offset()["left"] + $($(end).parent().parent().children()[0]).width()
            if ($($(end).parent().parent().children()[1]).attr("data-type") == "dimension"){
                left_league2 += $($(end).parent().parent().children()[1]).width()
            }
            width_league2 = (offset_end["left"] + parseInt(width_start/2)) - left_league2
            top_league2 = lower_end

            $("#place-for-leagues").append('<div class="league" style="width: '+width_league1+'px;top: '+top_league1+'px;left: '+left_league1+'px"><img src="../../static/musicToNotes/img/liga.png"></div>')
            $("#place-for-leagues").append('<div class="league" style="width: '+width_league2+'px;top: '+top_league2+'px;left: '+left_league2+'px"><img src="../../static/musicToNotes/img/liga.png"></div>')
        }
    }
}

function relocate(from_obj=some_clicked, note_length=[1, 8], to_next=true, to_obj=null){
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

function sizePic() {
    size = $("#settings_size_of_notes input").val();
    img = $("#settings_size_of_notes p span");
    img.html(''+size);
    $("#settings_size_of_notes svg").width(size+'px');
    $("#settings_size_of_notes svg").height(size+'px');

    height = k_size_height*size*width_present

    style_columns_notes = '.column-in-row{\nheight: '+(height)+'px;\n}\n.column-in-tact{\n\tmin-width: '+(size*width_present)+'px;\n}\n.note > svg{\ntop: '+(-size*width_present+0.125*height+8*size*width_present/74)+'px;\n}\n'
    if(size*width_present < 40){
        style_columns_notes += '.row-stan{\nbackground: repeating-linear-gradient(to bottom,rgb(0,0,0),rgb(0,0,0) 1px,rgb(255,255,255) 1px,rgb(255,255,255) calc(25% - 1px),rgb(0,0,0) calc(25% - 1px))\n}\n'
        
    }
    $("#style-size").html(style_columns_notes)

    width = height/2*0.6875

    x = size*width_present
    font_size = 0.00000877893884756*x**3+(-0.00194963366125123)*x**2+0.74720753726819567*x-1.88786664507642854
    margin_top = 0.00071429*x**2+0.07142857*x+3.71428571

    style_margin = '.dimension{\nwidth: '+width+'px;\n}\n.dimension div{\nfont-size: '+font_size+'px;\n}\n.dimension div:nth-child(1){\nmargin-top: -'+margin_top+'px\n}\n.key{\nwidth: '+(50*width_present)+'px\n}\n'

    // for (var i = -10; i < 10; i+=0.5) {
    //     if (i % 1 == 0){
    //         style_margin += '.on-'+i+'-row{'
    //     } else {
    //         style_margin += '.on-'+(i-0.5)+'-between-'+(i+0.5)+'-row{'
    //     }
    //     style_margin += 'margin-top: '+(height - 0.0625*height - (i-1)*0.250*height)+'px;}\n'
    // }
    // style_margin = ""
    // for (var i = -10; i < 10; i+=0.5) {
    //     if (i % 1 == 0){
    //         style_margin += '.on-'+i+'-row{'
    //     } else {
    //         style_margin += '.on-'+(i-0.5)+'-between-'+(i+0.5)+'-row{'
    //     }
    //     style_margin += 'margin-top: '+ (100 - 0.0625*100 - (i-1)*0.250*100) +'%;}\n'
    // }

    $("#style-for-pos_y-of-notes").html(style_margin)
    all_from_zero(json_arr)
}

function html_to_json() {
    new_json = []
    for (var i = 0; i < $(".column-in-row:not('.zero')").length; i++) {
        type = $($(".column-in-row")[i]).attr("data-type")
        if ( type == "key" ){
            if ( i!=0 && $($(".column-in-row")[i]).attr("data-value") == $($(".key")[ $(".key").index($(".column-in-row")[i]) - 1]).attr("data-value") ){
                key = ''
            } else {
                key = $($(".column-in-row")[i]).attr("data-value")
            }
            if ( $($(".column-in-row")[i+1]).attr("data-type") == "dimension" ){
                new_json.push(
                    {
                        "key": key,
                        "dimension": $($(".column-in-row")[i+1]).attr("data-value").split('/'),
                        "content": []
                    })
            } else if (key != ''){
                new_json.push(
                    {
                        "key": key,
                        "dimension": [],
                        "content": []
                    })
            }
        } else if ( type == "dimension" ){
            if ( $($(".column-in-row")[i-1]).attr("data-type") != "key" ){
                new_json.push(
                    {
                        "key": "",
                        "dimension": $($(".column-in-row")[i]).attr("data-value").split("/"),
                        "content": []
                    })
            }
        } else {
            new_json[new_json.length-1]["content"].push([])
            for (var j = 0; j < $($(".column-in-row")[i]).children().length; j++) {
                new_json[new_json.length-1]["content"][new_json[new_json.length-1]["content"].length-1].push([$($($(".column-in-row")[i]).children()[j]).attr("league") || "" ])
                for (var z = 0; z < $($($(".column-in-row")[i]).children()[j]).children().length; z++) {

                    new_json[new_json.length-1]["content"][new_json[new_json.length-1]["content"].length-1][new_json[new_json.length-1]["content"][new_json[new_json.length-1]["content"].length-1].length-1].push( {"svg_key": $($($($(".column-in-row")[i]).children()[j]).children()[z]).attr("data-length"), "y_pos": $($($($(".column-in-row")[i]).children()[j]).children()[z]).attr("data-row")} )
                }
            }
        }
    }
    json_arr = new_json
}

function mines() {
    if (width_present>0.6){
        width_present -= 0.05
        $("#main2").css("width", width_present*100+"%")
        sizePic()
    }
    close_now_menu()
}

function plus() {
    if (width_present<1){
        width_present += 0.05
        $("#main2").css("width", width_present*100+"%")
        sizePic()
    }
    close_now_menu()
}