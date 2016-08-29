var myFileSelector : HTMLInputElement = <HTMLInputElement>$("#myFileSelector")[0];

myFileSelector.addEventListener("change", function () {
    //Check the image file is valid
    checkImage(function (myFile) {
        sendFaceDetectRequest(myFile, function(faceId){
            console.log(faceId);
            sendFindSimilarRequest(faceId, function(result){
                result.forEach(element => {
                    console.log(element.persistedFaceId);
                });
            })
        })
    });
    sendGetListRequest(function(data){
        data.persistedFaces.forEach(element => {
            console.log(element.userData);
        });
    });
});

function checkImage(callback){
    var myFile : File = myFileSelector.files[0];
    var myFileReader : FileReader = new FileReader();

    if(myFile) {          
        myFileReader.readAsDataURL(myFile);
    }
    else {
        alert("Invalid File!");
    }

    myFileReader.onloadend = function() {
        if(!myFile.name.match(/\.(jpg|jpeg|png)$/)) {
            alert("Invalid File!");
        }
        else {
            callback(myFile);
        }
    }
}

function sendFaceDetectRequest(file, callback){
    $.ajax({
        url: "https://api.projectoxford.ai/face/v1.0/detect", 
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "9da3ade20681481bb489a91e206a37c9");
        },
        type: "POST",
        data: file,
        processData: false
    })
    .done(function (data) {
        if(data.length != 0){
            var faceId : String = data[0].faceId;
            callback(faceId);
        }
    })
    .fail(function (error) {
        alert("Could not find a face.")
    })
}

function sendFindSimilarRequest(faceId, callback){
    $.ajax({
        url: "https://api.projectoxford.ai/face/v1.0/findsimilars",
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "9da3ade20681481bb489a91e206a37c9");
        },
        type: "POST",
        data: JSON.stringify({
            faceId: faceId,
            faceListId: "celebs",
            maxNumOfCandidatesReturned:10,
            mode: "matchFace"
        })
    })
    .done(function(data) {
            if(data.length != 0){
                callback(data);
            }
        })
    .fail(function() {
            alert("error");
        });
}

function sendGetListRequest(callback){
     $.ajax({
            url: "https://api.projectoxford.ai/face/v1.0/facelists/celebs?",
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","9da3ade20681481bb489a91e206a37c9");
            },
            type: "GET",
            // Request body
            data: "{ body }",
        })
        .done(function(data) {
            if(data.length != 0){
                callback(data);
            }
        })
        .fail(function() {
            alert("error");
        });
}