from librosa import load as lb_load
import librosa.display
import numpy as np
from matplotlib import  pyplot as plt
from collections import Counter
import copy
import json
from typing import Union, List, Tuple, Dict

class GlobalConst:
	audio_file = []
	db = []
	notes = []
	json = []

	def __init__(self):
		# self.setAudioConst()
		pass

	def setAudioConst(self, file_path: str = "sintez_metr.wav", sampling_rate: int = 48000, n_fft: int = 2**13) -> None:
		self.sampling_rate = sampling_rate
		self.file_path = file_path
		self.n_fft = n_fft

	def setBpm(self, new_bpm: int = 90) -> None:
		self.bpm = new_bpm
		self.quarter_in_sec = 60/new_bpm
		self.frames_in_sec = self.sampling_rate / self.hop_length
		self.quarter_in_frames = int(self.quarter_in_sec*self.frames_in_sec)

	def setMin(self, note_min: Union[float, int] = 1/4, pause_min: Union[float, int] = 1/4) -> None:
		self.min_frame_note = note_min*4*self.quarter_in_frames
		self.min_float_note = note_min
		self.min_frame_pause = pause_min*4*self.quarter_in_frames
		self.min_float_pause = pause_min

	def setNoteConstData(self) -> None:
		self.min_heght_note_for_save = 4
		self.difference_max_for_split = 15
		self.difference_mean_for_split = 10
		self.difference_max_min_in_note_for_save = 18
		self.min_decibel_for_save = 30

	def setNoteConstProperties(self):
		# 20.60158
		self.array_of_all_hz = [round(20.61*2**(i/12), 2) for i in range(97)]
		self.array_of_diez = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]
		self.array_of_name = ["до", "до-диез", "ре", "ре-диез", "ми", "фа", "фа-диез", "соль", "соль-диез", "ля", "ля-диез", "си"]

		self.array_of_len_string = ['1', '1/2', '1/4', '1/8', '1/16', '0']
		self.array_of_len = [eval(i) for i in self.array_of_len_string]
		self.max_of_length = max(self.array_of_len)
		self.min_of_length = min(self.array_of_len)

	def changeStart(self, ind_start: int = 4) -> None:
		self.array_of_diez = self.array_of_diez[ind_start:] + self.array_of_diez[:ind_start]
		self.array_of_name = self.array_of_name[ind_start:] + self.array_of_name[:ind_start]

	def getLengthExactly(self, value: Union[int, float], round_to_more: bool = True, minimum: float = 0) -> str:
	    if value > self.max_of_length:
	        res = str(self.max_of_length) + '+' + self.getLengthExactly(value-self.max_of_length, round_to_more, minimum)
	        if res.endswith('+0'):
	            return res[:-2]
	        else:
	            return res
	    len_arr = np.array(self.array_of_len)
	    next_arr = np.where(len_arr >= value)[0]
	    prev_arr = np.where(len_arr <= value)[0]
	    next_len = len_arr[next_arr.max()]
	    prev_len = len_arr[prev_arr.min()]
	    
	    to_next = next_len - value
	    to_prev = value - prev_len
	    
	    if round_to_more and to_next < to_prev:
	        if next_len < minimum:
	            return str(0)
	        else:
	            return str(next_len)
	    
	    if prev_len <= self.min_of_length:
	        if prev_len < minimum:
	            return str(0)
	        else:
	            return str(self.min_of_length)

	    if prev_len < minimum:
	        return str(0)

	    res = str(prev_len) + '+' + self.getLengthExactly(value - prev_len, round_to_more, minimum)
	    if res.endswith('+0'):
	        return res[:-2]
	    else:
	        return res


class AnalizAudio:

	def __init__(self, consts: GlobalConst):
		self.consts = consts

	def addAudio(self) -> None:
		self.consts.audio_file, self.consts.sampling_rate = lb_load(self.consts.file_path, sr=self.consts.sampling_rate)
		self.consts.duration = self.consts.audio_file.shape[0]/self.consts.sampling_rate
		# автоматизированно меняю значение
		self.consts.hop_length = int(self.consts.duration*4)*10

	# self.consts.duration
	def cutAudio(self, start_sec: Union[int, float] = 0, end_sec: Union[int, float] = 18.413) -> None:
		self.start_timestamp = int(self.sampling_rate*start_sec)
		self.end_timestamp = int(self.sampling_rate*end_sec)

	def cutFrames(self, start_frame: int = 0, end_frame: int = -1) -> None:
		self.start_timestamp = start_frame
		self.end_timestamp = end_frame

	def setData(self):
		stft = librosa.stft(self.consts.audio_file[self.start_timestamp:self.end_timestamp], n_fft=self.consts.n_fft, hop_length=self.consts.hop_length)

		# нахуя тут модуль?
		self.consts.db = librosa.amplitude_to_db(abs(stft))


class AnalizData:

	def __init__(self, consts: GlobalConst):
		self.consts = consts
		# self.clearData()
		# self.plotData()

	def clearData(self) -> None:
		# db[db < db.mean()] = 0
		self.consts.db[self.consts.db < 10] = 0

	def plotData(self, figsize: Tuple[int, int] = (24, 10)) -> None:
		plt.figure(figsize=figsize)
		_, self.consts.hz_scale = librosa.display.specshow(self.consts.db, sr=self.consts.sampling_rate, x_axis='time', y_axis='log', hop_length=self.consts.hop_length)
		plt.colorbar()

	def getHzScale(self) -> None:
		"""будущий метод вместо отрисовки будет получать только hz_scale"""
		self.consts.hz_scale = librosa.display.specshow2(self.consts.db, sr=self.consts.sampling_rate, x_axis='time', y_axis='log', hop_length=self.consts.hop_length)

	def checkingForDeletion(self, check_length, check_height, check_decibel, max_of_mean) -> bool:
	    if check_length < self.consts.min_frame_note or (
	        check_decibel["max"] - check_decibel["min"] < self.consts.difference_max_min_in_note_for_save 
	        or check_height["max"] < self.consts.min_heght_note_for_save
	        or max_of_mean < self.consts.min_decibel_for_save):
	            # если длина ноты < минимально допустимой
	            # или разница между максимумом и минимумом по громкости коридора > максимально допустимой
	            # или максимальная ширина < минимально допустимой)
	        return True
	    return False

	def getNearestHz(self, value: float) -> float:
	    # переводим переданный массив в формат numpy array, для использования внутримодульных функций
	    np_arr = np.array(self.consts.array_of_all_hz)

	    # вычисляем максимум и минимум из значений в массиве
	    max_of_length = max(self.consts.array_of_all_hz)
	    min_of_length = min(self.consts.array_of_all_hz)

	    if value > max_of_length:
	        # если значение больше максимума, то ближайшее к нему число - сам максимум, его и вернем
	        return max_of_length
	    if value < min_of_length:
	        # если значение меньше минимума, то ближайшее к нему число - сам минимум, его и вернем
	        return min_of_length

	    # вычисляем между какими числами из массива (следующее и предыдущее) расположено переданное число
	    next_val = np_arr[np.where(np_arr >= value)[0].min()]
	    prev_val = np_arr[np.where(np_arr < value)[0].max()]
	    
	    # вычисляем расстояние от этих чисел до переданного числа
	    to_next = next_val - value
	    to_prev = value - prev_val
	    
	    if to_next > to_prev:
	        # если до предыдущего значения ближе, то передаем предыдущее
	        return prev_val
	    else:
	        # иначе передаем следующее
	        return next_val

	def fromTheEnd(self) -> List[ Dict[ str, Union[ float, int, List[float] ] ] ]:
	    # массив хранит минимизированные коридоры на предыдущем шаге
	    arr = []
	    
	    data = self.consts.db
	    
	    # все найденные ноты (с их доп параметрами)
	    all_notes = self.consts.notes
	    
	    self.consts.min_decibel_for_save = data[:, :][data[:, :]>0].mean()
	    self.consts.min_decibel_for_save = data[:, :][data[:, :]>0].max() * (1-len(data[:, :][data[:, :]>self.consts.min_decibel_for_save])/len(data[:, :][data[:, :]>0]))
	    
	    insert_code = 'all_notes.insert(0, {"start_pos": k_pos,"pos_y": pos_y,"real_hz": real_hz,"hz": hz,"real_length": length,"length": self.consts.getLengthExactly( length/ (self.consts.quarter_in_frames*4) ),"all_height": all_height,"all_decibel": all_decibel,"offset": 0,"league": "", "data_val": data[pos_y, k_pos:k_pos+length]})'

	    # обход колонок начнем с конца (справа)
	    for k_pos in range(data.shape[1])[::-1]:
	        # k_pos - поиция колонки

	        # flag_in_coridor определяет мы сейчас внутри коридора или нет
	        flag_in_coridor = False
	        # массив хранит текущие минимизированные коридоры
	        arr2 = []

	        for s_pos in range(data.shape[0]):
	            # s_pos - позиция строки
	            decibel = data[s_pos, k_pos]

	            if not flag_in_coridor and decibel > 0:
	                # если мы не внутри коридора и текущая громкость > 0
	                # то коридор начался

	                # start - начало коридора в этом столбце
	                start = s_pos
	                flag_in_coridor = True
	            elif flag_in_coridor and (decibel == 0 or s_pos == data.shape[0] - 1):
	                # если мы внутри коридора и (текущая громкость == 0 или мы дошли до конца)
	                # то коридор закончился

	                # end - конец коридора в этом столбце
	                end = s_pos - 1
	                flag_in_coridor = False

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

	                    if start-2 < pos_y < end+2:
	                        # если был минимизирован коридор на честоте, которая лежит в интервале частот текущего коридора
	                        if all_decibel["max"] - max_decibel > self.consts.difference_max_for_split and (
	                            all_decibel["mean"] - mean_decibel > self.consts.difference_mean_for_split):
	                            # если следующая громкость гораздо громче текущей (по макимуму и по среднему значению)
	                            # то это другая нота и мы их разделяем
	                            data[pos_y, k_pos] = 0
	                        else:
	                            # иначе это продолжение ноты
	                            data[pos_y, k_pos] = data_column_copy[pos_y-2:pos_y+2].mean()
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
	        if arr2 != []:
	            # если в этом столбце были корридоры (ноты)
	            for pos_y, length, all_height, all_decibel in arr:
	                if [pos_y, length+1] not in np.array(arr2)[:, :2] and data[pos_y, k_pos+1] != 0:
	                    # и если предыдущая нота не попала в текущий массив (это значит что коридор (нота) по идее закончился)
	                    # и громкость следующего семпла этой же частоты != 0 (это значит что еще не очищали этот коридор)
	                    if self.checkingForDeletion(length, all_height, all_decibel, data[pos_y, k_pos:k_pos+length].max()):
	                        # если коридор подошел под критерий удаления
	                        # удаляем этот коридор
	                        data[pos_y, k_pos+1:k_pos+length+2] = 0
	                    else:
	                        # ноту надо сохранить
	                        real_hz=self.consts.hz_scale[pos_y]
	                        hz=self.getNearestHz(self.consts.hz_scale[pos_y])
	                        eval(insert_code)
	        else:
	            # во всей колонке не обнаружено коридоров, а значит все предыдущие закончились и их надо проверить на удаление
	            for pos_y, length, all_height, all_decibel in arr:
	                if self.checkingForDeletion(length, all_height, all_decibel, data[pos_y, k_pos:k_pos+length].max()):
	                    # если коридор подошел под критерий удаления
	                    # удаляем этот коридор
	                    data[pos_y, k_pos+1:k_pos+length+2] = 0
	                else:
	                    # ноту надо сохранить
	                    real_hz=self.consts.hz_scale[pos_y]
	                    hz=self.getNearestHz(self.consts.hz_scale[pos_y])
	                    eval(insert_code)
	        # в конце пробега по текущей колонке запоминаем её как предыдущую, для следующей
	        arr = arr2

	    # данные закончились, а значит все найденные коридоры закончились и надо их проверить на удаление
	    for pos_y, length, all_height, all_decibel in arr:
	        if self.checkingForDeletion(length, all_height, all_decibel, data[pos_y, k_pos:k_pos+length].max()):
	            # если коридор подошел под критерий удаления
	            # удаляем этот коридор
	            data[pos_y, k_pos+1:k_pos+length+2] = 0
	        else:
	            # ноту надо сохранить
	            real_hz=hz_scale[pos_y]
	            hz=self.getNearestHz(self.consts.hz_scale[pos_y])
	            eval(insert_code)
	    self.consts.notes = all_notes


class AnalizNotes:

	def __init__(self, consts: GlobalConst):
		self.consts = consts

	def printNames(self) -> None:
	    for ind, note in enumerate(self.consts.notes):
	        if note["hz"] == 0:
	            print("позиция =",note["start_pos"], "pause", note["length"])
	        else:
	            index_hz = self.consts.array_of_all_hz.index(note["hz"])
	            diez = self.consts.array_of_diez[index_hz % len(self.consts.array_of_diez)]
	            name = self.consts.array_of_name[index_hz % len(self.consts.array_of_name)]
	            print("позиция =",note["start_pos"], name, note["length"])

	def printInfo(self) -> None:
		print('\nчисло нот =', len(self.consts.notes))
		for ind, i in enumerate(found_notes):
			print(f'{i["hz"]=:8}, {i["start_pos"]=:4}, {i["real_length"]=:3}, {i["length"]=}')
		print('\n')

	def deleteRepetitions(self):
	    data = self.consts.notes
	    ind = 0
	    while ind < len(data):
	        flag = False
	        i = data[ind]
	        ind2 = ind + 1
	        while ind2 < len(data):
	            i2 = data[ind2]
	            if [i["hz"], i["start_pos"]] == [i2["hz"], i2["start_pos"]]:
	                if i["real_length"] >= i2["real_length"]:
	                    data.pop(ind2)
	                    ind2 -= 1
	                else:
	                    data.pop(ind)
	                    flag = True

	            ind2 += 1
	        if not flag:
	            ind += 1
	    self.consts.notes = data

	def alignmentLength(self):
	    data = self.consts.notes
	    ind_note = 0
	    while ind_note < len(data):
	        np_data = np.array([list(i.items()) for i in data])
	        note = data[ind_note]
	        start = note["start_pos"]
	        real_length = note["real_length"]
	        # print('\n', ind_note, '\n', np_data)
	        more_then = np.where(start<np_data[:, 0, 1])[0]
	        less_then = np.where(start+real_length>np_data[:, 0, 1])[0]

	        more_and_less = np.concatenate( [more_then, less_then] )
	        count_of_repetitions = Counter(more_and_less) 
	        np_count_of_repetitions = np.array(list(count_of_repetitions.items()))
	        ind_common_el = np.where(np_count_of_repetitions[:, 1] > 1)[0]

	        notes_between = np_data[np_count_of_repetitions[ ind_common_el ][:, 0]]
	        if len(notes_between) != 0:
	            # разделяем ноту
	            min_ind = 0
	            min_start = notes_between[min_ind, 0, 1]
	            for j, i in enumerate(notes_between[1:]):
	                if i[0, 1] < min_start:
	                    min_start = i[0, 1]
	                    min_ind = j

	            copy_note = copy.deepcopy(data[ind_note])            

	            new_real_length = start + copy_note["real_length"] - min_start
	            new_length = self.consts.getLengthExactly(new_real_length / (self.consts.quarter_in_frames*4), minimum=self.consts.min_float_note)
	            league = data[ind_note]["league"]
	            if eval(new_length) >= self.consts.min_float_note:
	                copy_note["start_pos"] = min_start
	                copy_note["length"] = new_length
	                copy_note["real_length"] = new_real_length
	                if league == "":
	                    copy_note["league"] = "end"
	                    league = "start"
	                if league == "end":
	                    copy_note["league"] = "end"
	                    league = "middle"
	                data.insert(ind_note+1, copy_note)

	            new_real_length = min_start - start
	            new_length = self.consts.getLengthExactly(new_real_length / (self.consts.quarter_in_frames*4), minimum=self.consts.min_float_note)
	            if eval(new_length) >= self.consts.min_float_note:
	                data[ind_note]["real_length"] = new_real_length
	                data[ind_note]["length"] = new_length
	                data[ind_note]["league"] = league
	            else:
	                data.pop(ind_note)
	                ind_note -= 1
	        else:
	            # создаем паузу
	            next_notes = np.where(start+real_length <= np_data[:, 0, 1])[0]
	            if next_notes != []:
	                next_note = data[min(next_notes)]
	                start_next_note = next_note["start_pos"]
	                pause_real_length = start_next_note - (start+real_length)
	                pause_length = self.consts.getLengthExactly(pause_real_length / (self.consts.quarter_in_frames*4), minimum=self.consts.min_float_pause)
	                if eval(pause_length) >= self.consts.min_float_pause:
	                    copy_note = copy.deepcopy(data[ind_note])
	                    copy_note["start_pos"] = start+real_length
	                    copy_note["hz"] = 329.76
	                    copy_note["real_length"] = pause_real_length
	                    copy_note["length"] = pause_length
	                    copy_note["offset"] = 0
	                    copy_note["league"] = ""
	                    data.insert(ind_note+1, copy_note)
	                    ind_note += 1
	        ind_note += 1
	    self.consts.notes = data

	def splitLength(self):
	    data = self.consts.notes
	    count_in_column = 0
	    last_start = -1
	    ind_note = 0
	    while ind_note < len(data):
	        note = copy.deepcopy(data[ind_note])
	        
	        if note["start_pos"] == last_start and count_in_column != 0:
	            new_copy_note = copy.deepcopy(data[ind_note])
	            data.pop(ind_note)
	            for i in range(len(lengths)):
	                copy_note = copy.deepcopy(new_copy_note)
	                copy_note["start_pos"] = int(last_start + sum(lengths_float[:i])*one_part_of_len)
	                copy_note["length"] = lengths[i]
	                if i == len(lengths)-1:
	                    copy_note["league"] = "end" #but no
	                elif i == 0:
	                    copy_note["league"] = "start" #but no
	                else:
	                    copy_note["league"] = "middle"
	                data.insert((ind_note - (len(lengths)-1 - i)*count_in_column), copy_note)
	                ind_note += 1

	            ind_note -= 1
	            count_in_column += 1
	        elif len(lengths := note["length"].split('+')) != 1:
	            count_in_column = 1
	            
	            sum_of_len = eval(note["length"])
	            all_len = note["real_length"]
	            one_part_of_len = all_len/sum_of_len
	            lengths_float = [float(i) for i in lengths]
	            
	            data[ind_note]["length"] = lengths[0]
	            data[ind_note]["league"] = "start" #but no
	            
	            copy_note = copy.deepcopy(data[ind_note])
	            
	            for i in range(1, len(lengths)):
	                copy_note["start_pos"] = int(note["start_pos"] + sum(lengths_float[:i])*one_part_of_len)
	                copy_note["length"] = lengths[i]
	                if i == len(lengths)-1:
	                    copy_note["league"] = "end" #but no
	                else:
	                    copy_note["league"] = "middle"
	                ind_note += 1
	                data.insert(ind_note, copy_note)

	        last_start = note["start_pos"]
	        ind_note += 1
	    self.consts.notes = data


class ConvertNotes:
	dimension_now = [3, 4]
	result_json = [
	    {
	        "key": "scripka",
	        "dimension": dimension_now,
	        "content":
	            [
	                [
	                    # [
	                    #     "start",
	                    #     {
	                    #         "svg_key": "1/4",
	                    #         "y_pos" : 2,
	                    #         "code": 44
	                    #     },
	                    #     {
	                    #         "svg_key": "1/4",
	                    #         "y_pos" : 3,
	                    #         "code": 44
	                    #     }
	                    # ]
	                ]
	            ]
	    }
	]

	hz_center_of_scripka = 494.08
	hz_lower_of_scripka = 329.76
	# ind_center_of_scripka = array_of_all_hz.index(hz_center_of_scripka)
	# ind_lower_of_scripka = array_of_all_hz.index(hz_lower_of_scripka)
	name_of_scripka = "scripka"

	array_of_center = [hz_center_of_scripka]
	array_of_lower = [hz_lower_of_scripka]
	array_of_center_name = [name_of_scripka]

	def __init__(self, consts: GlobalConst):
		self.consts = consts

	# сделать методом без параметра селф
	def getReduction(self, M, N=1):
	    if isinstance(M, float):
	        M_str = str(M).split('.')[1]
	        N = 10**len(M_str)
	        M = int(M_str)
	    m = copy.deepcopy(M)
	    n = copy.deepcopy(N)
	    for ind in range(2, min(m+1, n+1)):
	        if m % ind == 0 and n % ind == 0:
	            M = m / ind
	            N = n / ind
	    return str(int(M))+"/"+str(int(N))

	def getOffset(self, value: float, base: float = 329.76) -> int:
	    index_value = self.consts.array_of_all_hz.index(value)
	    index_base = self.consts.array_of_all_hz.index(base)
	    return index_value - index_base

	def printJson(self):
		print(json.dumps(self.result_json, sort_keys=True, indent=4))

	def convert(self):
		found_notes = self.consts.notes
		last_start_pos = 0
		empty_in_tact = self.dimension_now[0] / self.dimension_now[1]

		ind_center = 0


		free = empty_in_tact

		last_start_pos = -1
		# -1 чтоб точно не существовало такой ноты

		for ind, note in enumerate(found_notes):
		    if free == 0:
		        self.result_json[-1]["content"].append([])
		        free = empty_in_tact

		    if note["start_pos"] == last_start_pos:
		        # print(json.dumps(self.result_json[-1]["content"], sort_keys=True, indent=4))
		        self.result_json[-1]["content"][-1][-1].append({
		                    "svg_key": self.getReduction(float(note["length"])),
		                    "y_pos" : self.getOffset(value=note["hz"], base=self.array_of_lower[ind_center]),
		                    "code": 0
		                })
		    else:
		        if free - float(note["length"]) < 0:
		            len_now = free
		            len_next = float(note["length"]) - len_now
		            
		            self.result_json[-1]["content"][-1].append([
		                note["league"],
		                # ИЗМЕНИТЬ ЛИГУ
		                {
		                    "svg_key": self.getReduction(float(len_now)),
		                    "y_pos" : self.getOffset(value=note["hz"], base=self.array_of_lower[ind_center]),
		                    "code": 0
		                }
		            ])
		            self.result_json[-1]["content"].append([])
		            self.result_json[-1]["content"][-1].append([
		                note["league"],
		                # ИЗМЕНИТЬ ЛИГУ
		                {
		                    "svg_key": self.getReduction(float(len_next)),
		                    "y_pos" : self.getOffset(value=note["hz"], base=self.array_of_lower[ind_center]),
		                    "code": 0
		                }
		            ])
		            free = empty_in_tact - len_next
		        else:
		            self.result_json[-1]["content"][-1].append([
		                note["league"],
		                {
		                    "svg_key": self.getReduction(float(note["length"])),
		                    "y_pos" : self.getOffset(value=note["hz"], base=self.array_of_lower[ind_center]),
		                    "code": 0
		                }
		            ])
		            free -= float(note["length"])
		    last_start_pos = note["start_pos"]

		self.consts.json = self.result_json


# consts = GlobalConst()
# consts.setAudioConst(file_path="sintez_metr.wav", sampling_rate=48000, n_fft=2**13)

# analiz_audio = AnalizAudio(consts)
# analiz_audio.addAudio()

# consts.setBpm(90)
# consts.setMin(note_min=1/4, pause_min=1/4)
# consts.setNoteConstData()
# consts.setNoteConstProperties()
# consts.changeStart(4)

# analiz_audio.cutFrames(start_frame=0, end_frame=-1)
# analiz_audio.setData()

# analiz_data = AnalizData(consts)
# analiz_data.clearData()
# analiz_data.plotData()
# analiz_data.fromTheEnd()
# print("\nчисло нот после фильтрации -", len(consts.notes), '\n')

# analiz_notes = AnalizNotes(consts)
# analiz_notes.deleteRepetitions()
# print("нот после удаления повторов -", len(consts.notes), '\n')
# analiz_notes.alignmentLength()
# print("нот после выравнивания -", len(consts.notes), '\n')
# analiz_notes.splitLength()
# print("нот после разреза -", len(consts.notes), '\n')

# convert_notes = ConvertNotes(consts)
# convert_notes.convert()
# convert_notes.printJson()






# print("create consts")
# consts = GlobalConst()
# consts.setAudioConst()

# print("create analiz_audio")
# analiz_audio = AnalizAudio(consts)
# analiz_audio.addAudio()

# print("change consts")
# consts.setBpm()
# consts.setMin()
# consts.setNoteConstData()
# consts.setNoteConstProperties()
# consts.changeStart()

# analiz_audio.cutFrames()
# analiz_audio.setData()

# print("create analiz_data")
# analiz_data = AnalizData(consts)
# analiz_data.clearData()
# analiz_data.plotData()
# print("start from_the_end")
# analiz_data.fromTheEnd()
# print("\nчисло нот после фильтрации -", len(consts.notes), '\n')

# print("create analiz_notes")
# analiz_notes = AnalizNotes(consts)
# analiz_notes.deleteRepetitions()
# print("нот после удаления повторов -", len(consts.notes), '\n')
# analiz_notes.alignmentLength()
# print("нот после выравнивания -", len(consts.notes), '\n')
# analiz_notes.splitLength()
# print("нот после разреза -", len(consts.notes), '\n')

# print("create convert_notes")
# convert_notes = ConvertNotes(consts)
# print("start convert")
# convert_notes.convert()
# convert_notes.printJson()