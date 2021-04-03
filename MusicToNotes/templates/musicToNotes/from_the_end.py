def from_the_end(same_data):
    # массив хранит минимизированные коридоры на предыдущем шаге
    arr = []
    
    data = copy.deepcopy(same_data)
    
    # все найденные ноты (с их доп параметрами)
    all_notes = []
    
    global min_decibel_for_save
    
    min_decibel_for_save = data[:, :][data[:, :]>0].mean()
    min_decibel_for_save = data[:, :][data[:, :]>0].max() * (1-len(data[:, :][data[:, :]>min_decibel_for_save])/len(data[:, :][data[:, :]>0]))
    
#     print(f"{min_decibel_for_save=}")
#     data_in_notes = '{"start_pos": k_pos,"pos_y": pos_y,"real_hz": real_hz,"hz": hz,"real_length": length,"length": get_length_exactly( length/ (quarter_in_frames*4) ),"all_height": all_height,"all_decibel": all_decibel,"offset": get_offset(hz),"league": "", "data_val": data[pos_y, k_pos:k_pos+length]}'
    insert_code = 'all_notes.insert(0, {"start_pos": k_pos,"pos_y": pos_y,"real_hz": real_hz,"hz": hz,"real_length": length,"length": get_length_exactly( length/ (quarter_in_frames*4) ),"all_height": all_height,"all_decibel": all_decibel,"offset": get_offset(hz),"league": "", "data_val": data[pos_y, k_pos:k_pos+length]})'
#     print(insert_code.replace(',', ',\n\t'))

    # обход колонок начнем с конца (справа)
    for k_pos in range(data.shape[1])[::-1]:
        # k_pos - поиция колонки

        # flag_in_coridor определяет мы сейчас внутри коридора или нет
        flag_in_coridor = False
        # массив хранит текущие минимизированные коридоры
        arr2 = []

        b = np.where(data[:, k_pos] == 0)[0]
        c = np.where(data[:, k_pos] > 0)[0]
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
                max_decibel = data[start:end, k_pos].max()
                mean_decibel = data[start:end, k_pos].mean()
                min_decibel = data[start:end, k_pos].min()
            else:
                min_decibel = mean_decibel = max_decibel = data[start, k_pos]


            data_column_copy = copy.deepcopy(data[:, k_pos])
            # обнуляем весь коридор в этом столбце
            data[start:end+1, k_pos] = 0
            # flag_new_coridor - флаг определяет это новый коридор или нет
            flag_new_coridor = True

            for pos_y, length, all_height, all_decibel in arr:
                # берем из предыдущих минимизированных коридоров следующее:
                # pos_y - позиция (индекс) по оси y
                # length - длина коридора
                # all_height - словарь из Максимальной, Средней и Минимальной высоты (ширины) коридора
                # all_decibel - словарь из Максимальной, Средней и Минимальной громкости коридора

                if start-2 <= pos_y <= end+2:
                    # если был минимизирован коридор на честоте, которая лежит в интервале частот текущего коридора

                    # только что заметил, что тут (ниже) не юзается модуль)) мб надо бы


                    if all_decibel["max"] - max_decibel > difference_max_for_split and (
                        all_decibel["mean"] - mean_decibel > difference_mean_for_split):
                        # если следующая громкость гораздо громче текущей (по макимуму и по среднему значению)
                        # то это другая нота и мы их разделяем
                        data[pos_y, k_pos] = 0
                    else:
                        # иначе это продолжение ноты
                        data[pos_y, k_pos] = data_column_copy[pos_y-2:pos_y+2].mean()
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
                                }
                            ])
                    # это точно не новый коридор
                    flag_new_coridor = False
            if flag_new_coridor:
                # если это начало (если смотреть справа) коридора
                # то добавляем его
                data[mean, k_pos] = mean_decibel
                arr2.append([
                    mean,
                    1,
                    {"max": height_of_note, "mean": height_of_note, "min": height_of_note},
                    {"max": max_decibel, "mean": mean_decibel, "min": min_decibel}
                ])
            start = end + 1
        if arr2 != []:
            # если в этом столбце были корридоры (ноты)
            for pos_y, length, all_height, all_decibel in arr:
                if [pos_y, length+1] not in np.array(arr2)[:, :2] and data[pos_y, k_pos+1] != 0:
                    # и если предыдущая нота не попала в текущий массив (это значит что коридор (нота) по идее закончился)
                    # и громкость следующего семпла этой же частоты != 0 (это значит что еще не очищали этот коридор)
                    if check_delete_this_note(length, all_height, all_decibel, data[pos_y, k_pos:k_pos+length].max()):
                        # если коридор подошел под критерий удаления
                        # удаляем этот коридор
                        data[pos_y, k_pos+1:k_pos+length+2] = 0
                    else:
                        # ноту надо сохранить
                        real_hz=hz_scale[pos_y]
                        hz=get_nearest(hz_scale[pos_y])
                        eval(insert_code)
        else:
            # во всей колонке не обнаружено коридоров, а значит все предыдущие закончились и их надо проверить на удаление
            for pos_y, length, all_height, all_decibel in arr:
                if check_delete_this_note(length, all_height, all_decibel, data[pos_y, k_pos:k_pos+length].max()):
                    # если коридор подошел под критерий удаления
                    # удаляем этот коридор
                    data[pos_y, k_pos+1:k_pos+length+2] = 0
                else:
                    # ноту надо сохранить
                    real_hz=hz_scale[pos_y]
                    hz=get_nearest(hz_scale[pos_y])
                    eval(insert_code)
        # в конце пробега по текущей колонке запоминаем её как предыдущую, для следующей
        arr = arr2
    # данные закончились, а значит все найденные коридоры закончились и надо их проверить на удаление
    for pos_y, length, all_height, all_decibel in arr:
        if check_delete_this_note(length, all_height, all_decibel, data[pos_y, k_pos:k_pos+length].max()):
            # если коридор подошел под критерий удаления
            # удаляем этот коридор
            data[pos_y, k_pos+1:k_pos+length+2] = 0
        else:
            # ноту надо сохранить
            real_hz=hz_scale[pos_y]
            hz=get_nearest(hz_scale[pos_y])
            eval(insert_code)
    return data, all_notes