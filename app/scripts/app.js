var myFileSelector = $('#myFileSelector')[0];
var loading = $('#loading')[0];
var myBtn = $('#btnStart')[0];
var myFaceList;
sendGetListRequest(function (data) {
    myFaceList = data.persistedFaces;
    toggleLoading(false);
});
myFileSelector.addEventListener('change', function () {
    toggleLoading(true);
    $('#images').empty();
    //Check the image file is valid
    checkImage(function (myFile) {
        //Send faceDetectRequest for the valid file
        sendFaceDetectRequest(myFile, function (faceId) {
            //Send findSimilarRequest for the result
            sendFindSimilarRequest(faceId, function (result) {
                result.forEach(function (element) {
                    getUserData(element.persistedFaceId, function (userData) {
                        console.log(userData.name + ' ' + userData.url);
                        var div = $('<div>').attr({
                            class: 'col-xs-12 col-sm-6 imgItem'
                        });
                        var title = $('<h3>').append(userData.name);
                        var confidence = $('<h4>').append(Math.round(element.confidence * 100) + '% Match');
                        var loaderImage = $('<img>').attr({
                            src: '../images/loader.gif',
                            alt: 'Image could not be loadedB'
                        });
                        var img = $('<img>').attr({
                            src: userData.url
                        }).on('load', function () {
                            loaderImage.hide();
                            img.show();
                        }).hide();
                        div.append(loaderImage, img, title, confidence);
                        $('#images').append(div);
                        toggleLoading(false);
                    });
                });
            });
        });
    });
});
function checkImage(callback) {
    var myFile = myFileSelector.files[0];
    var myFileReader = new FileReader();
    if (myFile) {
        myFileReader.readAsDataURL(myFile);
    }
    else {
        alert('You must select a file!');
        toggleLoading(false);
    }
    myFileReader.onloadend = function () {
        if (!myFile.name.match(/\.(jpg|jpeg|png)$/)) {
            alert('Invalid file!');
            toggleLoading(false);
        }
        else {
            callback(myFile);
        }
    };
}
function sendFaceDetectRequest(file, callback) {
    $.ajax({
        url: 'https://api.projectoxford.ai/face/v1.0/detect',
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader('Content-Type', 'application/octet-stream');
            xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', '9da3ade20681481bb489a91e206a37c9');
        },
        type: 'POST',
        data: file,
        processData: false
    })
        .done(function (data) {
        if (data.length != 0) {
            //console.log(data);
            var faceId = data[0].faceId;
            callback(faceId);
        }
        else {
            alert('Could not detect a face, please try another image!');
            toggleLoading(false);
        }
    })
        .fail(function (error) {
        var json = JSON.parse(error.responseText);
        alert(json.error.message);
    });
}
function sendFindSimilarRequest(faceId, callback) {
    $.ajax({
        url: 'https://api.projectoxford.ai/face/v1.0/findsimilars',
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader('Content-Type', 'application/json');
            xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', '9da3ade20681481bb489a91e206a37c9');
        },
        type: 'POST',
        data: JSON.stringify({
            faceId: faceId,
            faceListId: 'master',
            maxNumOfCandidatesReturned: 6,
            mode: 'matchFace'
        })
    })
        .done(function (data) {
        if (data.length != 0) {
            //console.log(data);
            callback(data);
        }
    })
        .fail(function () {
        alert('error');
        toggleLoading(false);
    });
}
function sendGetListRequest(callback) {
    $.ajax({
        url: 'https://api.projectoxford.ai/face/v1.0/facelists/master?',
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', '9da3ade20681481bb489a91e206a37c9');
        },
        type: 'GET',
        // Request body
        data: '{ body }',
    })
        .done(function (data) {
        if (data.length != 0) {
            //console.log(data);
            callback(data);
        }
    })
        .fail(function () {
        alert('Something went wrong, try refreshing the page.');
        toggleLoading(false);
    });
}
function getUserData(persistedFaceId, callback) {
    myFaceList.forEach(function (element) {
        if (element.persistedFaceId == persistedFaceId) {
            var userData = JSON.parse(element.userData);
            callback(userData);
        }
    });
}
function toggleLoading(bool) {
    if (bool) {
        myBtn.style.visibility = 'hidden';
        loading.style.visibility = 'visible';
    }
    else {
        myBtn.style.visibility = 'visible';
        loading.style.visibility = 'hidden';
    }
}
