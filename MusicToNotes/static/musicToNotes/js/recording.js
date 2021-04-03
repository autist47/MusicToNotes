let constraintObj = { 
    audio: true, 
    video: false
};

function start_recording(time_slice=3000){
    //handle older browsers that might implement getUserMedia in some way
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
        navigator.mediaDevices.getUserMedia = function(constraintObj) {
            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }
            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraintObj, resolve, reject);
            });
        }
    }else{
        navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            devices.forEach(device=>{
                console.log(device.kind.toUpperCase(), device.label);
                //, device.deviceId
            })
        })
        .catch(err=>{
            console.log(err.name, err.message);
        })
    }

    navigator.mediaDevices.getUserMedia(constraintObj).then(function(mediaStreamObj) {
        let mediaRecorder = new MediaRecorder(mediaStreamObj);

        let count_part = 0;
        let end = false;
        let chunk  = [];

        function slice_audio(){
            mediaRecorder.stop()
            mediaRecorder.start()
        }
        
        mediaRecorder.start();
        timerId = setInterval(slice_audio, time_slice);

        function stop_recording() {
            clearInterval(timerId);
            end = true
            mediaRecorder.stop();
            $("#recording-btn").off('click', stop_rec)
        }
        function stop_rec() {
            if ($(this).hasClass('stop-recording')){
                stop_recording();
                $(this).removeClass('stop-recording')
            }
        }

        $("#recording-btn").on("click", stop_rec)

        mediaRecorder.ondataavailable = function(ev) {
            count_part++
            chunk.push(ev.data)
        }

        mediaRecorder.onstop = (ev)=>{
            send_recording(chunk, '_part_'+(count_part).toString()+'.webm', end, count_part)
            chunk = []
            if (end){
                count_part = 0;
                end = false;
            }
        }
    }).catch(function(err) { 
        console.log(err.name, err.message); 
    });
}