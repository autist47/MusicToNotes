def from_the_end_for_parts(same_data, left_notes=[], offset_k_pos=0):
    # массив хранит минимизированные коридоры на предыдущем шаге
    arr = []

    # крайние правые коридоры (не минимизированные)
    right_notes = []
    
    data = copy.deepcopy(same_data)
    
    # все найденные ноты (с их доп параметрами)
    all_notes = []
    
    global min_decibel_for_save
    
    min_decibel_for_save = data[:, :][data[:, :]>0].mean()
    min_decibel_for_save = data[:, :][data[:, :]>0].max() * (1-len(data[:, :][data[:, :]>min_decibel_for_save])/len(data[:, :][data[:, :]>0]))
    min_decibel_for_save = 27.921892
    # print(f"{min_decibel_for_save=}")
    
    insert_code = 'all_notes.insert(0, {"start_pos": k_pos_start,"pos_y": pos_y,"real_hz": real_hz,"hz": hz,"real_length": length,"length": get_length_exactly( length/ (quarter_in_frames*4) ),"all_height": all_height,"all_decibel": all_decibel,"offset": get_offset(hz),"league": "", "data_val": data[pos_y, k_pos_for_data:k_pos_for_data+length]})'
    # print(insert_code.replace(',', ',\n\t'))

    # k_pos = offset_k_pos
    # обход колонок начнем с конца (справа)
    for k_pos_for_data in range(data.shape[1])[::-1]:
        k_pos = offset_k_pos + k_pos_for_data
        # k_pos - поиция колонки

        # flag_in_coridor определяет мы сейчас внутри коридора или нет
        flag_in_coridor = False
        # массив хранит текущие минимизированные коридоры
        arr2 = []

        b = np.where(data[:, k_pos_for_data] == 0)[0]
        c = np.where(data[:, k_pos_for_data] > 0)[0]
        start = 0
        while start < data.shape[0]:
            start = np.where(c > start)[0]
            if start.size > 0:
                start = c[start[0]]
            else:
                break
            end = np.where(b > start)[0]
            if end.size > 0:
                end = b[end[0]]-1
            else:
                end = len(a)-1

            # mean - середина (индекс середины) коридора 
            mean = int( (end + start) / 2)
            # height_of_note - высота (ширина) коридора
            height_of_note = end - start + 1

            # max_decibel - максимальное значение коридора коридора
            # mean_decibel - максимальное значение коридора коридора
            # min_decibel - максимальное значение коридора коридора
            if height_of_note > 1:
                max_decibel = data[start:end, k_pos_for_data].max()
                mean_decibel = data[start:end, k_pos_for_data].mean()
                min_decibel = data[start:end, k_pos_for_data].min()
            else:
                min_decibel = mean_decibel = max_decibel = data[start, k_pos_for_data]
            
            
            data_column_copy = copy.deepcopy(data[:, k_pos_for_data])
            # обнуляем весь коридор в этом столбце
            data[start:end+1, k_pos_for_data] = 0
            # flag_new_coridor - флаг определяет это новый коридор или нет
            flag_new_coridor = True

            for pos_y, length, all_height, all_decibel, k_pos_start in arr:
                # берем из предыдущих минимизированных коридоров следующее:
                # pos_y - позиция (индекс) по оси y
                # length - длина коридора
                # all_height - словарь из Максимальной, Средней и Минимальной высоты (ширины) коридора
                # all_decibel - словарь из Максимальной, Средней и Минимальной громкости коридора
                # k_pos_start

                if start-2 <= pos_y <= end+2:
                    # если был минимизирован коридор на честоте, которая лежит в интервале частот текущего коридора

                    if right_notes != []:
                        np_right_notes = np.array(right_notes)
                        index_right_notes = np.where(pos_y == np_right_notes[:, 1])[0]
                        if index_right_notes.size > 0:
                            index_right_notes = index_right_notes[0]
                    
                    
                    # только что заметил, что тут (ниже) не юзается модуль)) мб надо бы

                    if all_decibel["max"] - max_decibel > difference_max_for_split and (
                        all_decibel["mean"] - mean_decibel > difference_mean_for_split):
                        # если следующая громкость гораздо громче текущей (по макимуму и по среднему значению)
                        # то это другая нота и мы их разделяем
                        data[pos_y, k_pos_for_data] = 0
                        if right_notes != [] and index_right_notes.size > 0 and right_notes[index_right_notes][-1]:
                            right_notes[index_right_notes][-1] = False
                            right_notes[index_right_notes][-2] = k_pos
                    else:
                        # иначе это продолжение ноты
                        data[pos_y, k_pos_for_data] = data_column_copy[pos_y-2:pos_y+2].mean()
                        np_arr2 = np.array(arr2)
                        if np_arr2.size != 0 and pos_y in np_arr2[:, 0]:
                            index_repeat = np.where(np_arr2 == pos_y)[0][0]
                            arr2[index_repeat][2]["min"] = min(height_of_note, arr2[index_repeat][2]["min"])
                            arr2[index_repeat][2]["max"] = min(height_of_note, arr2[index_repeat][2]["max"])
                            arr2[index_repeat][3]["min"] = min(min_decibel, arr2[index_repeat][3]["min"])
                            arr2[index_repeat][3]["max"] = min(max_decibel, arr2[index_repeat][3]["max"])
                        else:
                            arr2.append([
                                pos_y,
                                length+1,
                                {
                                    "max": max(height_of_note, all_height["max"]),
                                    "mean": (all_height["mean"] * length + height_of_note) / (length+1),
                                    "min": min(height_of_note, all_height["min"])
                                },
                                {
                                    "max": max(max_decibel, all_decibel["max"]),
                                    "mean": (all_decibel["mean"] * length + mean_decibel) / (length+1),
                                    "min": min(min_decibel, all_decibel["min"])
                                },
                                k_pos
                            ])
                        if right_notes != [] and index_right_notes.size > 0 and right_notes[index_right_notes][-1]:
                            st, en = right_notes[index_right_notes][0]
                            right_notes[index_right_notes] = [
                                (st, en),
                                pos_y,
                                length+1,
                                {
                                    "max": max(height_of_note, all_height["max"]),
                                    "mean": (all_height["mean"] * length + height_of_note) / (length+1),
                                    "min": min(height_of_note, all_height["min"])
                                },
                                {
                                    "max": max(max_decibel, all_decibel["max"]),
                                    "mean": (all_decibel["mean"] * length + mean_decibel) / (length+1),
                                    "min": min(min_decibel, all_decibel["min"])
                                },
                                k_pos,
                                True
                            ]
                    # это точно не новый коридор
                    flag_new_coridor = False
            if flag_new_coridor:
                # если это начало (если смотреть справа) коридора
                # то добавляем его
                data[mean, k_pos_for_data] = mean_decibel
                arr2.append([
                    mean,
                    1,
                    {"max": height_of_note, "mean": height_of_note, "min": height_of_note},
                    {"max": max_decibel, "mean": mean_decibel, "min": min_decibel},
                    k_pos
                ])
                if k_pos_for_data == data.shape[1]-1:
                    right_notes.append([
                        (start, end),
                        mean,
                        1,
                        {"max": height_of_note, "mean": height_of_note, "min": height_of_note},
                        {"max": max_decibel, "mean": mean_decibel, "min": min_decibel},
                        k_pos,
                        True
                    ])
            start = end + 1
        if arr2 != []:
            # если в этом столбце были корридоры (ноты)
            for pos_y, length, all_height, all_decibel, k_pos_start in arr:
                if [pos_y, length+1] not in np.array(arr2)[:, :2] and data[pos_y, k_pos_for_data+1] != 0:
                    # и если предыдущая нота не попала в текущий массив (это значит что коридор (нота) по идее закончился)
                    # и громкость следующего семпла этой же частоты != 0 (это значит что еще не очищали этот коридор)
                    if check_delete_this_note(length, all_height, all_decibel, data[pos_y, k_pos_for_data:k_pos_for_data+length].max()):
                        # если коридор подошел под критерий удаления
                        # удаляем этот коридор
                        data[pos_y, k_pos_for_data+1:k_pos_for_data+length+2] = 0
                    else:
                        # ноту надо сохранить
                        real_hz=hz_scale[pos_y]
                        hz=get_nearest(real_hz)
                        eval(insert_code)
        else:
            # во всей колонке не обнаружено коридоров, а значит все предыдущие закончились и их надо проверить на удаление
            for pos_y, length, all_height, all_decibel, k_pos_start in arr:

                np_right_notes = np.array(right_notes)
                if np_right_notes.size:
                    index_right_notes = np.where(pos_y == np_right_notes[:, 1])[0]
                    if index_right_notes.size > 0:
                        index_right_notes = index_right_notes[0]
                        if right_notes[index_right_notes][-1]:
                            right_notes[index_right_notes][-1] = False
                            right_notes[index_right_notes][-2] = k_pos

                if check_delete_this_note(length, all_height, all_decibel, data[pos_y, k_pos_for_data:k_pos_for_data+length].max()):
                    # если коридор подошел под критерий удаления
                    # удаляем этот коридор
                    data[pos_y, k_pos_for_data+1:k_pos_for_data+length+2] = 0
                else:
                    # ноту надо сохранить
                    real_hz=hz_scale[pos_y]
                    hz=get_nearest(real_hz)
                    eval(insert_code)
        # в конце пробега по текущей колонке запоминаем её как предыдущую, для следующей
        arr = arr2

    # добавляю к найденным нотам их левые части из предыдущей записи
    for r_ind, (r_pos_y, r_length, r_all_height, r_all_decibel, r_k_pos_start) in enumerate(arr):
        for l_ind, ((l_start, l_end), l_pos_y, l_length, l_all_height, l_all_decibel, l_k_start, _) in enumerate(left_notes):
            if l_start-2 < r_pos_y < l_end+2:
                if not (r_all_decibel["max"] - l_all_decibel["max"] > difference_max_for_split and (
                    r_all_decibel["mean"] - l_all_decibel["mean"] > difference_mean_for_split)):
                    # это продолжение ноты
                    arr[r_ind] = [
                        r_pos_y,
                        r_length+l_length,
                        {
                            "max": max(r_all_height["max"], l_all_height["max"]),
                            "mean": (r_all_height["mean"] * r_length + l_all_height["mean"] * l_length) / (r_length+l_length),
                            "min": min(r_all_height["min"], l_all_height["min"])
                        },
                        {
                            "max": max(r_all_decibel["max"], l_all_decibel["max"]),
                            "mean": (r_all_decibel["mean"] * r_length + l_all_decibel["mean"] * l_length) / (r_length+l_length),
                            "min": min(r_all_decibel["min"], l_all_decibel["min"])
                        },
                        l_k_start
                    ]
    # добавляю к самым первым нотам этой записи их левые части из предыдущей записи
    for r_ind, ((r_start, r_end), r_pos_y, r_length, r_all_height, r_all_decibel, r_k_start, r_not_end) in enumerate(right_notes):
        for l_ind, ((l_start, l_end), l_pos_y, l_length, l_all_height, l_all_decibel, l_k_start, _) in enumerate(left_notes):
            if r_not_end:
                if l_start-2 < r_pos_y < l_end+2:
                    if r_all_decibel["max"] - l_all_decibel["max"] > difference_max_for_split and (
                        r_all_decibel["mean"] - l_all_decibel["mean"] > difference_mean_for_split):
                        # это разные ноты, надо закончить эту
                        right_notes[r_ind][-1] = False
                        right_notes[r_ind][-2] = k_pos
                    else:
                        # это продолжение ноты
                        right_notes[r_ind] = [
                            (r_start, r_end),
                            r_pos_y,
                            r_length+l_length,
                            {
                                "max": max(r_all_height["max"], l_all_height["max"]),
                                "mean": (r_all_height["mean"] * r_length + l_all_height["mean"] * l_length) / (r_length+l_length),
                                "min": min(r_all_height["min"], l_all_height["min"])
                            },
                            {
                                "max": max(r_all_decibel["max"], l_all_decibel["max"]),
                                "mean": (r_all_decibel["mean"] * r_length + l_all_decibel["mean"] * l_length) / (r_length+l_length),
                                "min": min(r_all_decibel["min"], l_all_decibel["min"])
                            },
                            l_k_start,
                            False
                        ]

    # теперь массив правых нот завершен
    for j, i in enumerate(right_notes):
        if i[-1]:
            right_notes[j][-1] = False


    # данные закончились, а значит все найденные коридоры закончились и надо их проверить на удаление
    for pos_y, length, all_height, all_decibel, k_pos_start in arr:
        if check_delete_this_note(length, all_height, all_decibel, data[pos_y, k_pos_for_data:k_pos_for_data+length].max()):
            # если коридор подошел под критерий удаления
            # удаляем этот коридор
            data[pos_y, k_pos_for_data+1:k_pos_for_data+length+2] = 0
        else:
            # ноту надо сохранить
            real_hz=hz_scale[pos_y]
            hz=get_nearest(real_hz)
            eval(insert_code)
    return data, all_notes, right_notes