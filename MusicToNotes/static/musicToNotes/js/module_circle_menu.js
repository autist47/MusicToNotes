array_of_functions = {}
id_menu_now = '';
some_code = '';
circle = false;
global_flag = true
size = 75;
k_size_height = 1;

$(document).ready(function(){
    $("#body").on("mousemove", function(e){ eval(some_code); })
})

function DefaultFuncForMenu(){
    console.log("Oh my God!!! Click!!!")
}

function search_key_words(arr, value) {
    if(!(arr instanceof Array)) return value == arr
    return arr.some(item => search_key_words(item, value))
}

function using_key_word_in_input_data(array){
    for (var i=0; i<array.length; i++){
        if (Object.prototype.toString.call(array[i]) == "[object Array]"){
            while (array[i].indexOf("*") != -1){
                var ind = array[i].indexOf("*")
                var count = array[i][ind+1]
                array[i].splice(ind, 2)
                for (var j=0; j<count-1; j++){
                    array[i].splice(ind, 0, array[i][ind-1])
                }
            }
            while (array[i].indexOf("in") != -1){
                var ind = array[i].indexOf("in")
                var position = array[i][ind+1]
                var value = array[i][ind-1]
                array[i].splice(ind, 3)
                array[i][position] = value
            }
        }
    }
    while (array.indexOf("*") != -1){
        var ind = array.indexOf("*")
        var count = array[ind+1]
        array.splice(ind, 2)
        for (var j=1; j<count; j++){
            array.splice(ind, 0, array[ind-1])
        }
    }
    while (array.indexOf("in") != -1){
        var ind = array.indexOf("in")
        var position = array[ind+1]
        var value = array[ind-1]
        array.splice(ind-1, 3)
        array[position] = value
    }
    return array
}

function change_input_data(inp_data, type_of_object, type_of_object2=type_of_object, groups){
    var array = []
    if (Object.prototype.toString.call(inp_data) == "[object "+type_of_object+"]" || Object.prototype.toString.call(inp_data) == "[object "+type_of_object2+"]"){
        for (var i=0; i<num_segments; i++){
            array.push(inp_data)
        }
    } else if (Object.prototype.toString.call(inp_data) == "[object Array]" && Object.prototype.toString.call(inp_data[0]) == "[object Array]") {
        count_group = groups.length
        for (var i=0; i<count_group; i++){
            in_one_group = groups[i].length
            for (var j=0; j<in_one_group; j++){
                array.push(inp_data[i-(parseInt((i)/inp_data.length)*inp_data.length)][j-(parseInt((j)/inp_data[i-(parseInt((i)/inp_data.length)*inp_data.length)].length)*inp_data[i-(parseInt((i)/inp_data.length)*inp_data.length)].length)])
            }
        }
    } else {
        for (var i=0; i<num_segments; i++){
            array.push(inp_data[i-(parseInt((i)/inp_data.length)*inp_data.length)])
        }
    }
    return array;
}

function count_segments(array){
    res = 0
    for (var i=0; i<array.length; i++){
        res += array[i].length
    }
    return res
}

function GetAllDataOfSegments(array_of_circles){
    parent_matrix_t_f = []
    all_matrix = []
    this_matrix_t_f = []
    this_matrix_1_0 = []
    result = []
    result.push([])
    num_segments = array_of_circles[0][0]
    deg_segment = parseFloat(360/num_segments)
    result = [[[[deg_segment, 0, 0]]]]
    for (var i=1; i<array_of_circles[0][0]; i++){
        result[0].push([[deg_segment, deg_segment*i, i]])
    }

    groups = result[0]
    if (search_key_words(array_of_circles[0][2], "in") || search_key_words(array_of_circles[0][2], "*")){
        array_of_circles[0][2] = using_key_word_in_input_data(array_of_circles[0][2])
    }
    color_this_circle = change_input_data(array_of_circles[0][2], "String", "String", groups)

    if (array_of_circles[0][5]){
        if (search_key_words(array_of_circles[0][5], "in") || search_key_words(array_of_circles[0][5], "*")){
            array_of_circles[0][5] = using_key_word_in_input_data(array_of_circles[0][5])
        }
        this_matrix_1_0 = change_input_data(array_of_circles[0][5], "Number", "Boolean", groups)
    }else {
        for (var i = num_segments - 1; i >= 0; i--) {
            this_matrix_1_0.push(1)
        }
    }

    if (Object.prototype.toString.call(this_matrix_1_0[0])=="[object Number]"){
        it_is_1_0 = true
    } else {
        it_is_1_0 = false
    }
    if (array_of_circles[0][6]){
        if (search_key_words(array_of_circles[0][6], "in") || search_key_words(array_of_circles[0][6], "*")){
            array_of_circles[0][6] = using_key_word_in_input_data(array_of_circles[0][6])
        }
        this_matrix_t_f = change_input_data(array_of_circles[0][6], "Number", "Boolean", groups)
    }else {
        for (var i = num_segments - 1; i >= 0; i--) {
            if (it_is_1_0){
                this_matrix_t_f.push(true)
            }
            else {
                this_matrix_t_f.push(1)
            }
        }
    }
    if (Object.prototype.toString.call(this_matrix_t_f[0])=="[object Boolean]"){
        it_is_t_f = true
    } else {
        it_is_t_f = false
    }

    if (!it_is_1_0) {
        parent_matrix_t_f = this_matrix_1_0
        all_matrix.push(this_matrix_t_f)
    } else {
        parent_matrix_t_f = this_matrix_t_f
        all_matrix.push(this_matrix_1_0)
    }
    if (parent_matrix_t_f.indexOf(false) != -1){
        for (var i=0; i<parent_matrix_t_f.length; i++) {
            if (parent_matrix_t_f[i]){
                parent_matrix_t_f[i] = 1
            } else {
                parent_matrix_t_f[i] = 0
            }
        }
    } else {
        parent_matrix_t_f = []
    }


    this_image = []
    if (array_of_circles[0][3]){
        if (search_key_words(array_of_circles[0][3][0], "in") || search_key_words(array_of_circles[0][3][0], "*")){
            array_of_circles[0][3][0] = using_key_word_in_input_data(array_of_circles[0][3][0])
        }
        this_image = change_input_data(array_of_circles[0][3][0], "String", "String", groups)
    }else {
        for (var i = num_segments - 1; i >= 0; i--) {
            this_image.push("default.png")
        }
    }
    this_image_rotate = []
    if (array_of_circles[0][3][1]){
        if (search_key_words(array_of_circles[0][3][1], "in") || search_key_words(array_of_circles[0][3][1], "*")){
            array_of_circles[0][3][1] = using_key_word_in_input_data(array_of_circles[0][3][1])
        }
        this_image_rotate = change_input_data(array_of_circles[0][3][1], "Number", "Boolean", groups)
    }else {
        for (var i = num_segments - 1; i >= 0; i--) {
            this_image_rotate.push(true)
        }
    }
    this_func = []
    if (array_of_circles[0][4]){
        if (search_key_words(array_of_circles[0][4], "in") || search_key_words(array_of_circles[0][4], "*")){
            array_of_circles[0][4] = using_key_word_in_input_data(array_of_circles[0][4])
        }
        this_func = change_input_data(array_of_circles[0][4], "String", "String", groups)
    }else {
        for (var i = num_segments - 1; i >= 0; i--) {
            this_func.push("DefaultFuncForMenu()")
        }
    }

    for (var i=0; i<result[0].length; i++){
        result[0][i][0].push(color_this_circle[i])
        result[0][i][0].push(all_matrix[0][i])
        result[0][i][0].push(this_image[i])
        result[0][i][0].push(this_image_rotate[i])
        result[0][i][0].push(this_func[i])                
    }

    for (var num_this_circle=1; num_this_circle<array_of_circles.length; num_this_circle++){
        this_matrix_1_0 = []
        this_matrix_t_f = []
        rotate = 0
        result.push([])
        num_segments = count_segments(result[num_this_circle-1])
        groups = result[num_this_circle-1]
        if (search_key_words(array_of_circles[num_this_circle][0], "in") || search_key_words(array_of_circles[num_this_circle][0], "*")){
            array_of_circles[num_this_circle][0] = using_key_word_in_input_data(array_of_circles[num_this_circle][0])
        }
        array = change_input_data(array_of_circles[num_this_circle][0], "Number", "Number", groups)
        z = 0
        for (var i=0; i<array.length; i++){
            result[num_this_circle].push([])

            k = 0
            for (var asd=0; asd<result[num_this_circle-1].length; asd++){
                for (var zxc=0; zxc<result[num_this_circle-1][asd].length; zxc++){
                    if (k == z){
                        gr = asd
                        el = zxc
                    }
                    k++
                }
            }
            z += 1
            deg_segment = parseFloat(result[num_this_circle-1][gr][el][0]/array[i])
            for (var j=0; j<array[i]; j++){
                // for (var k=0; k<array.length; k++){

                // }
                result[num_this_circle][i].push([deg_segment, rotate, i])
                rotate += deg_segment
            }
        }
        groups = result[num_this_circle]
        if (search_key_words(array_of_circles[num_this_circle][2], "in") || search_key_words(array_of_circles[num_this_circle][2], "*")){
            array_of_circles[num_this_circle][2] = using_key_word_in_input_data(array_of_circles[num_this_circle][2])
        }
        num_segments = count_segments(result[num_this_circle])
        color_this_circle = change_input_data(array_of_circles[num_this_circle][2], "String", "String", groups)
        console.log(color_this_circle)
        num = 0
        for (var i=0; i<result[num_this_circle].length; i++){
            for (var j=0; j<result[num_this_circle][i].length; j++){
                if (color_this_circle[num] == "from_parent"){

                    k = 0
                    for (var asd=0; asd<result[num_this_circle].length; asd++){
                        for (var zxc=0; zxc<result[num_this_circle][asd].length; zxc++){
                            if (k == num){
                                gr = asd
                                el = zxc
                            }
                            k++
                        }
                    }
                    grr = gr
                    k = 0

                    for (var asd=0; asd<result[num_this_circle-1].length; asd++){
                        for (var zxc=0; zxc<result[num_this_circle-1][asd].length; zxc++){
                            if (k == grr){
                                gr = asd
                                el = zxc
                            }
                            k++
                        }
                    }


                    color_this_circle[num] = result[num_this_circle-1][gr][el][3]
                }
                result[num_this_circle][i][j].push(color_this_circle[num])
                num += 1
            }
        }
        num_segments = count_segments(result[num_this_circle])
        if (array_of_circles[num_this_circle][5]){
            if (search_key_words(array_of_circles[num_this_circle][5], "in") || search_key_words(array_of_circles[num_this_circle][5], "*")){
                array_of_circles[num_this_circle][5] = using_key_word_in_input_data(array_of_circles[num_this_circle][5])
            }
            console.log("agaga = ", array_of_circles[num_this_circle][5])
            groups = result[num_this_circle]
            this_matrix_1_0 = change_input_data(array_of_circles[num_this_circle][5], "Number", "Boolean", groups)
        } else {
            for (var i = num_segments - 1; i >= 0; i--) {
                this_matrix_1_0.push(1)
            }
        }
        if (Object.prototype.toString.call(this_matrix_1_0[0])=="[object Number]"){
            it_is_1_0 = true
        } else {
            it_is_1_0 = false
        }
        if (array_of_circles[num_this_circle][6]){
            if (search_key_words(array_of_circles[num_this_circle][6], "in") || search_key_words(array_of_circles[num_this_circle][6], "*")){
                array_of_circles[num_this_circle][6] = using_key_word_in_input_data(array_of_circles[num_this_circle][6])
            }
            num_segments = count_segments(result[num_this_circle])
            groups = result[num_this_circle]
            this_matrix_t_f = change_input_data(array_of_circles[num_this_circle][6], "Number", "Boolean", groups)
        } else {
            for (var i = num_segments - 1; i >= 0; i--) {
                if (it_is_1_0){
                    this_matrix_t_f.push(true)
                }
                else {
                    this_matrix_t_f.push(1)
                }
            }
        }
        if (Object.prototype.toString.call(this_matrix_t_f[0])=="[object Boolean]"){
            it_is_t_f = true
        } else {
            it_is_t_f = false
        }
        if (all_matrix.length > 0 && all_matrix[num_this_circle-1].indexOf(0) != -1){
            el = 0
            for (var i=0; i<result[num_this_circle-1].length; i++){
                for (var j=0; j<result[num_this_circle-1][i].length; j++){
                    if (all_matrix[num_this_circle-1][el] == 0){
                        k = 0
                        for (var asd=0; asd<result[num_this_circle].length; asd++){
                            for (var zxc=0; zxc<result[num_this_circle][asd].length; zxc++){
                                if (asd == el){
                                    if (it_is_1_0){
                                        this_matrix_1_0[k] = 0
                                    } else {
                                        this_matrix_t_f[k] = 0
                                    }
                                }
                                k++
                            }
                        }
                    }
                    el += 1
                }
            }
        }
        if (parent_matrix_t_f.length > 0 && parent_matrix_t_f.indexOf(0) != -1){
            el=0
            for (var i=0; i<result[num_this_circle-1].length; i++){
                for (var j=0; j<result[num_this_circle-1][i].length; j++){
                    if (parent_matrix_t_f[el] == 0){
                        k = 0
                        for (var asd=0; asd<result[num_this_circle].length; asd++){
                            for (var zxc=0; zxc<result[num_this_circle][asd].length; zxc++){
                                if (asd == el){
                                    if (it_is_1_0){
                                        this_matrix_1_0[k] = 0
                                    } else {
                                        this_matrix_t_f[k] = 0
                                    }
                                }
                                k++
                            }
                        }
                    }
                    el += 1
                }
            }
        }
        if (!it_is_1_0) {
            parent_matrix_t_f = this_matrix_1_0
            all_matrix.push(this_matrix_t_f)
        } else {
            parent_matrix_t_f = this_matrix_t_f
            all_matrix.push(this_matrix_1_0)
        }
        if (parent_matrix_t_f.indexOf(false) != -1){
            for (var i=0; i<parent_matrix_t_f.length; i++) {
                if (parent_matrix_t_f[i]){
                    parent_matrix_t_f[i] = 1
                } else {
                    parent_matrix_t_f[i] = 0
                }
            }
        } else {
            parent_matrix_t_f = []
        }

        this_image = []
        if (array_of_circles[num_this_circle][3][0]){
            if (search_key_words(array_of_circles[num_this_circle][3][0], "in") || search_key_words(array_of_circles[num_this_circle][3][0], "*")){
                array_of_circles[num_this_circle][3][0] = using_key_word_in_input_data(array_of_circles[num_this_circle][3][0])
            }
            groups = result[num_this_circle]
            this_image = change_input_data(array_of_circles[num_this_circle][3][0], "String", "String", groups)
        } else {
            for (var i = num_segments - 1; i >= 0; i--) {
                this_image.push("default.png")
            }
        }
        num = 0
        for (var i=0; i<result[num_this_circle].length; i++){
            for (var j=0; j<result[num_this_circle][i].length; j++){
                if (this_image[num] == "from_parent"){

                    k = 0
                    for (var asd=0; asd<result[num_this_circle].length; asd++){
                        for (var zxc=0; zxc<result[num_this_circle][asd].length; zxc++){
                            if (k == num){
                                gr = asd
                                el = zxc
                            }
                            k++
                        }
                    }
                    grr = gr
                    k = 0

                    for (var asd=0; asd<result[num_this_circle-1].length; asd++){
                        for (var zxc=0; zxc<result[num_this_circle-1][asd].length; zxc++){
                            if (k == grr){
                                gr = asd
                                el = zxc
                            }
                            k++
                        }
                    }


                    this_image[num] = result[num_this_circle-1][gr][el][5]
                }
                num += 1
            }
        }
        console.log("img=", this_image)

        this_image_rotate = []
        if (array_of_circles[num_this_circle][3][1]){
            if (search_key_words(array_of_circles[num_this_circle][3][1], "in") || search_key_words(array_of_circles[num_this_circle][3][1], "*")){
                array_of_circles[num_this_circle][3][1] = using_key_word_in_input_data(array_of_circles[num_this_circle][3][1])
            }
            groups = result[num_this_circle]
            this_image_rotate = change_input_data(array_of_circles[num_this_circle][3][1], "String", "String", groups)
        } else {
            for (var i = num_segments - 1; i >= 0; i--) {
                this_image_rotate.push(true)
            }
        }

        this_func = []
        if (array_of_circles[num_this_circle][4]){
            if (search_key_words(array_of_circles[num_this_circle][4], "in") || search_key_words(array_of_circles[num_this_circle][4], "*")){
                array_of_circles[num_this_circle][4] = using_key_word_in_input_data(array_of_circles[num_this_circle][4])
            }
            groups = result[num_this_circle]
            this_func = change_input_data(array_of_circles[num_this_circle][4], "String", "String", groups)
        } else {
            for (var i = num_segments - 1; i >= 0; i--) {
                this_func.push("DefaultFuncForMenu()")
            }
        }
        zzz = 0
        for (var i=0; i<result[num_this_circle].length; i++){
            for (var j=0; j<result[num_this_circle][i].length; j++){
                result[num_this_circle][i][j].push(all_matrix[num_this_circle][zzz])
                result[num_this_circle][i][j].push(this_image[zzz])
                result[num_this_circle][i][j].push(this_image_rotate[zzz])
                result[num_this_circle][i][j].push(this_func[zzz])
                zzz += 1
            }
        }
    }
    console.log("all_matrix = ", all_matrix)
    console.log("result = ", result)
    return result
}

function CreateCircleMenu(center=[1, 80, 'transparent'], array_of_circles=[[3, 250, '#70716B'], [6, 325, '#70716B']], id_for_this, parent_id="body") {
    var timewer = performance.now();
    all_data_segments = GetAllDataOfSegments(array_of_circles)

    timewer = performance.now() - timewer;
    console.log('Время выполнения данных = ', timewer);
    css_code = ''
    html_code = ''
    center_radius = center[1]
    center_color = center[2]
    for (num_this_circle = all_data_segments.length; num_this_circle > 0; num_this_circle--){
        count_group = all_data_segments[num_this_circle-1].length
        radius_this_circle = array_of_circles[num_this_circle-1][1]
        if (num_this_circle < array_of_circles.length) {
            top_pos = parseInt((array_of_circles[num_this_circle][1] - radius_this_circle))
            left_pos = top_pos
        } else {
            top_pos = 0
            left_pos = 0
        }

        if (num_this_circle - 1 > 0) {
            radius_gradient = parseInt(array_of_circles[num_this_circle - 1 - 1][1])
        } else {
            radius_gradient = center_radius
        }
        if (num_this_circle == array_of_circles.length){
            html_code += '<div id="'+id_for_this+'">\n\t'
            css_code += '#'+id_for_this+'{display: none;}\n'
            css_code += '#'+id_for_this + ' {\nwidth: ' + (radius_this_circle * 2) + 'px;\nheight: ' + (radius_this_circle * 2) + 'px;\nposition: absolute;\ntop: ' + top_pos + 'px;\nleft: ' + left_pos + 'px;\nmargin: 0;\npadding: 0;\noverflow: hidden;\nborder-radius: 50%;\nz-index: 999;\nlist-style: none;\n/*box-shadow: 0px 0px 15px #333;*/\n}\n'
        } else {
            html_code += '<div id="circular-menu-'+num_this_circle+'">\n\t'
            css_code += '#'+id_for_this+' #circular-menu-' + num_this_circle + ' {\nwidth: ' + (radius_this_circle * 2) + 'px;\nheight: ' + (radius_this_circle * 2) + 'px;\nposition: absolute;\ntop: ' + top_pos + 'px;\nleft: ' + left_pos + 'px;\nmargin: 0;\npadding: 0;\noverflow: hidden;\nborder-radius: 50%;\nz-index: ' + (array_of_circles.length - num_this_circle)+';\nlist-style: none;\n/*box-shadow: 0px 0px 15px #333;*/\n}\n'
        }
        
        disp = ''
        if(num_this_circle>1){disp = "\ndisplay: none;"}
        k = 0
        if (all_data_segments[num_this_circle-1].length != 2 || num_this_circle != 1){
            css_code += '#'+id_for_this + ' .circle-' + num_this_circle + '-segments {'+(disp)+'\nwidth: ' + (radius_this_circle * 2) + 'px;\nheight: ' + (radius_this_circle * 2) + 'px;\nposition: absolute;\noverflow: hidden;\ntransform-origin: 0px 0px;\ntransition: all 150ms ease-out;\nbackground-color: transparent;\nz-index: 0;\nopacity: 0.6;\nleft: 50%;\ntop: 50%;\n}\n'
            css_code += '#'+id_for_this + ' .circle-' + num_this_circle + '-segments-bg{\nwidth: ' + (radius_this_circle * 2) + 'px;\nheight: ' + radius_this_circle * 2 + 'px;\nposition: absolute;\ntransform-origin: 0 0px;\n}\n'
            for (var group=0; group<all_data_segments[num_this_circle-1].length; group++){
                for (var segment=0; segment<all_data_segments[num_this_circle-1][group].length; segment++){
                    html_code += '<div id="circle-'+num_this_circle+'-segment-'+(k+1)+'" onclick="'+all_data_segments[num_this_circle-1][group][segment][7]+'" class="circle-'+num_this_circle+'-segments circle-'+num_this_circle+'-segments-group-'+(group+1)+'">\n<div id="circle-'+num_this_circle+'-segment-bg-'+(k+1)+'" class="circle-'+num_this_circle+'-segments-bg"></div>\n</div>\n'
                    css_code += '#'+id_for_this+ ' #circle-'+num_this_circle+'-segment-'+(k+1)+' {\ntransform: rotate('+(-90 +all_data_segments[num_this_circle-1][group][segment][1])+'deg) skew('+(90-all_data_segments[num_this_circle-1][group][segment][0])+'deg);\n}\n#'+id_for_this+' #circle-'+num_this_circle+'-segment-bg-'+(k+1)+' {\nbackground:radial-gradient(circle at center, transparent '+(radius_gradient-2)+'px, '+all_data_segments[num_this_circle-1][group][segment][3]+' '+(radius_gradient+2)+'px);\ntransform: skew(' + (all_data_segments[num_this_circle-1][group][segment][0] - 90) + 'deg) translate(-' + radius_this_circle + 'px,-' + radius_this_circle + 'px);\n}\n'
                    k += 1
                }
            }
        } else {
            css_code += '#'+id_for_this + ' .circle-' + num_this_circle + '-segments {'+(disp)+'\nwidth: ' + (radius_this_circle) + 'px;\nheight: ' + (radius_this_circle * 2) + 'px;\nposition: absolute;\noverflow: hidden;\ntransform-origin: left center;\ntransition: all 150ms ease-out;\nbackground-color: transparent;\nz-index: 0;\nopacity: 0.6;\nleft: 50%;\n}\n'
            css_code += '#'+id_for_this + ' .circle-' + num_this_circle + '-segments-bg{\nwidth: ' + (radius_this_circle * 2) + 'px;\nheight: ' + radius_this_circle * 2 + 'px;\ntransform: translateX(-' + radius_this_circle + 'px);\nposition: absolute;\ntransform-origin: 0 0px;\n}\n'
            for (var group=0; group<all_data_segments[num_this_circle-1].length; group++){
                    html_code += '<div id="circle-'+num_this_circle+'-segment-'+(k+1)+'" onclick="'+all_data_segments[num_this_circle-1][group][0][7]+'" class="circle-'+num_this_circle+'-segments circle-'+num_this_circle+'-segments-group-'+(group+1)+'">\n<div id="circle-'+num_this_circle+'-segment-bg-'+(k+1)+'" class="circle-'+num_this_circle+'-segments-bg"></div>\n</div>\n'
                    css_code += '#'+id_for_this+ ' #circle-'+num_this_circle+'-segment-'+(k+1)+' {\ntransform: rotate('+(all_data_segments[num_this_circle-1][group][0][1])+'deg);\n}\n#'+id_for_this+' #circle-'+num_this_circle+'-segment-bg-'+(k+1)+' {\nbackground:radial-gradient(circle at center, transparent '+(radius_gradient-2)+'px, '+all_data_segments[num_this_circle-1][group][0][3]+' '+(radius_gradient+2)+'px);\n}\n'
                    k += 1
            }
        }

        css_code += '#'+id_for_this+' .circle-'+num_this_circle+'-between {'+disp+'\nwidth: 4px;\nheight: '+(radius_this_circle-radius_gradient)+'px;\nposition: absolute;\nleft: 50%;\ntop: 50%;\ntransform-origin: 2px 0px;\nz-index: 20;\nbackground: radial-gradient(circle at -2px '+(-radius_gradient)+'px, transparent '+radius_gradient+'px, white '+(radius_gradient+1)+'px);\n}\n'
        css_code += '#'+id_for_this + ' .circle-'+num_this_circle+'-img {'+disp+'\nposition: absolute;\nz-index: 20;\ntransform-origin: center;\n}\n'
        num_between = 1
        for (var group=0; group<all_data_segments[num_this_circle-1].length; group++){
            if (all_data_segments[num_this_circle-1][group].length != 1){
                // for (i = 1; i < in_one_group; i++){
                for (var segment=0; segment<all_data_segments[num_this_circle-1][group].length; segment++){
                    html_code += '<div id="circle-'+num_this_circle+'-between-'+num_between+'" class="circle-'+num_this_circle+'-between circle-'+num_this_circle+'-between-group-'+(group+1)+'"></div>\n'
                    css_code += '#'+id_for_this + ' #circle-'+num_this_circle+'-between-'+num_between+' {\ntransform: translateX(-2px) rotate('+(-180 +(all_data_segments[num_this_circle-1][group][segment][0]+all_data_segments[num_this_circle-1][group][segment][1]))+'deg) translateY('+radius_gradient+'px);\n}\n'
                    html_code += '<img onclick="'+all_data_segments[num_this_circle-1][group][segment][7]+'" src="'+all_data_segments[num_this_circle-1][group][segment][5]+'" id="circle-'+num_this_circle+'-img-'+num_between+'" class="circle-'+num_this_circle+'-img circle-'+num_this_circle+'-img-group-'+(group+1)+'"></img>\n'
                    fi = (all_data_segments[num_this_circle-1][group][segment][0]+all_data_segments[num_this_circle-1][group][segment][1]*2)/2
                    len = (array_of_circles[num_this_circle-1][1] + array_of_circles[num_this_circle-2][1])/2
                    y = -parseInt(Math.cos(fi*(Math.PI/180))*len)+array_of_circles[num_this_circle-1][1]-25
                    x = parseInt(Math.sin(fi*(Math.PI/180))*len)+array_of_circles[num_this_circle-1][1]-25
                    if(all_data_segments[num_this_circle-1][group][segment][6]){
                        rotate = fi
                    } else {
                        rotate = 0
                    }
                    css_code += '#'+id_for_this+' #circle-'+num_this_circle+'-img-'+num_between+' {\nleft: '+x+'px;\ntop: '+y+'px;\ntransform: rotate('+rotate+'deg);\n}\n'
                    num_between += 1
                }
            } else if (num_this_circle == 1){
                html_code += '<div id="circle-'+num_this_circle+'-between-'+num_between+'" class="circle-'+num_this_circle+'-between"></div>\n'
                html_code += '<img onclick="'+all_data_segments[num_this_circle-1][group][0][7]+'" src="'+all_data_segments[num_this_circle-1][group][0][5]+'" id="circle-'+num_this_circle+'-img-'+num_between+'" class="circle-'+num_this_circle+'-img"></img>\n'
                css_code += '#'+id_for_this+' #circle-'+num_this_circle+'-between-'+num_between+' {\ntransform: translateX(-2px) rotate('+(-180 +(all_data_segments[num_this_circle-1][group][0][0]+all_data_segments[num_this_circle-1][group][0][1]))+'deg) translateY('+radius_gradient+'px);\n}\n'
                fi = (all_data_segments[num_this_circle-1][group][0][0]+all_data_segments[num_this_circle-1][group][0][1]*2)/2
                len = (array_of_circles[num_this_circle-1][1] + center[1])/2
                y = -parseInt(Math.cos(fi*(Math.PI/180))*len)+array_of_circles[num_this_circle-1][1]-25
                x = parseInt(Math.sin(fi*(Math.PI/180))*len)+array_of_circles[num_this_circle-1][1]-25
                if(all_data_segments[num_this_circle-1][group][0][6]){
                    rotate = fi
                } else {
                    rotate = 0
                }
                css_code += '#'+id_for_this + ' #circle-'+num_this_circle+'-img-'+num_between+' {\nleft: '+(x)+'px;\ntop: '+(y)+'px;\ntransform: rotate('+rotate+'deg);\n}\n'
                num_between += 1
            }
        }
    }
    html_code += '<div class="center"></div>\n'
    top_pos = parseInt((array_of_circles[0][1] - center_radius))
    left_pos = top_pos
    css_code += '#'+id_for_this + ' .center{\nposition: absolute;\ntop: '+top_pos+'px;\nleft: '+left_pos+'px;\nbackground-color: '+center_color+';\nwidth: '+(center_radius*2)+'px;\nheight: '+(center_radius*2)+'px;\nz-index: 20;\nborder-radius: 50%;\n}\n'
    plus_block_for_css = ''
    for (num_this_circle = array_of_circles.length; num_this_circle > 0; num_this_circle--){
        html_code += '</div>\n'
        plus_block_for_css +=  '<style type="text/css" id="'+id_for_this+'-circle-'+num_this_circle+'-style" class="circles-style"></style>'
        for (var i=0; i<all_matrix[num_this_circle-1].length; i++){
            if (all_matrix[num_this_circle-1][i] == 0){
                css_code += '#'+id_for_this + ' #circle-'+num_this_circle+'-segment-'+(i+1)+' {\ndisplay: none!important;\n}\n'
                css_code += '#'+id_for_this + ' #circle-'+num_this_circle+'-between-'+(i+1)+' {\ndisplay: none!important;\n}\n'
                css_code += '#'+id_for_this + ' #circle-'+num_this_circle+'-img-'+(i+1)+' {\ndisplay: none!important;\n}\n'
            }
        }
    }
    js_code = ''
    new_array = [center]
    for (var i = 0; i < array_of_circles.length; i++){
        new_array.push(array_of_circles[i])
    }
    for (var i = 0; i < new_array.length; i++){
        js_code += 'R'+i+' = '+(new_array[i][1]*new_array[i][1])+'\n'
        if (i!=0 && i!=new_array.length) {
            eval("deg_array"+i+"=[0]")
            seg = 1
            degg = 0
            for (var x = 0; x<all_data_segments[i-1].length; x++){
                for (var qwe = 0; qwe<all_data_segments[i-1][x].length; qwe++){
                    degg += all_data_segments[i-1][x][qwe][0]
                    eval("deg_array"+i+".push("+degg+")")
                    seg += 1
                }
            }
            eval("js_code += 'deg_array"+i+" = ['+deg_array"+i+"+']'")
            js_code+="\n"
        }
    }
    js_code += 'Rand = '+Math.max(center[3]*center[3], ((new_array[new_array.length-1][1]+50)*(new_array[new_array.length-1][1]+50)))+'\n'
    js_code += 'if(circle){\ntoCenter = (e.clientX-center[0])*(e.clientX-center[0]) + (e.clientY+$(window).scrollTop()-center[1])*(e.clientY+$(window).scrollTop()-center[1])\n'
    js_code += 'x = e.clientX-center[0]\ny = e.clientY+$(window).scrollTop()-center[1]\nalfa = (Math.atan2(y,x)*180/Math.PI)+90\nif (alfa<0){\nalfa = 360+alfa\n}\nnew_css_code = ""\nvar time = performance.now()\n'

    for (var i = 0; i<new_array.length; i++) {
        z = i
        if (i != 0 ){
            count_segment = count_segments(all_data_segments[i-1])
            js_code += '} else if (R'+(i-1)+'<toCenter && toCenter<=R'+i+'){\n'
        } else {
            z++
            js_code += 'if (toCenter<=R'+i+'){\n'
        }
        js_code+= ''
        js_code+= '$("#'+id_for_this+'-circle-'+(i+1)+'-style").html("")\n'
        if (i!=0 && i!=new_array.length) {
        }
        if (i == 1){
            seg = 1
            degg = 0
            for (var x = 0; x<all_data_segments[i-1].length; x++){
                for (var qwe = 0; qwe<all_data_segments[i-1][x].length; qwe++){
                    degg += all_data_segments[i-1][x][qwe][0]
                    if (seg!=1) {
                        js_code += 'else '
                    }
                    if (i != new_array.length-1 || new_array.length == 2){
                        js_code += 'if(alfa<='+degg+') {\nnew_css_code = \'#'+id_for_this+' #circle-'+(i)+'-segment-'+seg+'{opacity: 1;} #'+id_for_this+' .circle-'+(i+1)+'-between-group-'+seg+'{display: block;} #'+id_for_this + ' .circle-'+(i+1)+'-segments-group-'+seg+'{display: block;} #'+id_for_this + ' .circle-'+(i+1)+'-img-group-'+seg+'{display: block;}\'\n$("#'+id_for_this+'-circle-'+(i)+'-style").html(new_css_code)\n'
                        js_code += 'betta1_'+i+' = '+(degg - all_data_segments[i-1][x][qwe][0])+'\nbetta2_'+i+' = '+degg+'\n'
                        js_code += '}\n'
                    } else {
                        js_code += 'if(alfa<='+degg+'){\n$("#'+id_for_this+' #circle-'+(i)+'-segment-'+seg+'").css("opacity", "1")\n}\n'
                    }
                    seg += 1
                }
            }
        } else if (i>1 && i!=new_array.length) {
            js_code += 'ind1 = deg_array'+i+'.indexOf(betta1_'+(i-1)+')\nind2 = deg_array'+i+'.indexOf(betta2_'+(i-1)+')\nif (alfa>deg_array'+i+'[ind1] && alfa<deg_array'+i+'[ind2]) {\nflag=false\nasd=ind1+1\nwhile(asd<=ind2 && !flag) {\nif (alfa<deg_array'+i+'[asd]){\nnew_css_code = \'#'+id_for_this+' #circle-'+(i)+'-segment-\'+asd+\'{opacity: 1;} #'+id_for_this+' .circle-'+(i+1)+'-between-group-\'+asd+\' {display: block;} #'+id_for_this+' .circle-'+(i+1)+'-img-group-\'+asd+\' {display: block;} #'+id_for_this+' .circle-'+(i+1)+'-segments-group-\'+asd+\' {display: block;}\'\nbetta1_'+i+' = deg_array'+i+'[asd-1]\nbetta2_'+i+' = deg_array'+i+'[asd]\n flag=true\n}\nasd++\n}} \n$("#'+id_for_this+'-circle-'+(i)+'-style").html(new_css_code)\n'
        }
    }
    js_code += '} else if (Rand < toCenter){\nclose_now_menu();\n$(".circles-style").html("")\n}\n}\ntime = performance.now() - time;//console.log("Время условия = ", time);\n\n'

    html_code_return = html_code
    html_css_code_return = '<style type="text/css" id="circle-style">'+css_code+'</style>'+plus_block_for_css

    console.log(js_code)
    array_of_functions[id_for_this] = js_code
    return [html_code_return, html_css_code_return]
}

function click_for_menu(id_, x_=event.clientX, y_=event.clientY+$(window).scrollTop()){
    if(!circle){
        id_menu_now = "#"+id_;
        some_code = array_of_functions[id_];
        $(".circles-style").html("");
        center = [x_, y_];
        $(id_menu_now).css("display", "block");
        $(id_menu_now).css("top", center[1]-$(id_menu_now).height()/2);
        $(id_menu_now).css("left", center[0]-$(id_menu_now).width()/2);
        circle = true;
    }
}

function close_now_menu(){
    if (circle){
        $(id_menu_now).css("display", "none");
        circle = false;
        $(".choice-menu").removeClass("choice-menu")
    }
}