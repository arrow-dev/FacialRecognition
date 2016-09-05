var myFileSelector : HTMLInputElement = <HTMLInputElement>$("#myFileSelector")[0];
var myFaceList;

sendGetListRequest((data)=>{ myFaceList = data.persistedFaces; });

myFileSelector.addEventListener("change", function () {
    $("div #images").children
    //Check the image file is valid
    checkImage(function (myFile) {
        //Send faceDetectRequest for the valid file
        sendFaceDetectRequest(myFile, function(faceId){
            //Send findSimilarRequest for the result
            sendFindSimilarRequest(faceId, function(result){
                result.forEach(element => {
                    getUserData(element.persistedFaceId, function(userData){
                        console.log(userData.name + " " + userData.url);
                        var img = $('<img>').attr({
                            src: userData.url
                        });
                        $("div #images").append(img);
                    });
                });
            })
        })
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
            //console.log(data);
            var faceId  = data[0].faceId;
            callback(faceId);
        }
        else{
            alert("Could not detect a face, please try another image!");
        }
    })
    .fail(function (error) {
        var json = JSON.parse(error.responseText);
        alert(json.error.message);
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
            faceListId: "master",
            maxNumOfCandidatesReturned:6,
            mode: "matchFace"
        })
    })
    .done(function(data) {
            if(data.length != 0){
                //console.log(data);
                callback(data);
            }
        })
    .fail(function() {
            alert("error");
        });
}

function sendGetListRequest(callback){
     $.ajax({
            url: "https://api.projectoxford.ai/face/v1.0/facelists/master?",
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
                //console.log(data);
                callback(data);
            }
        })
        .fail(function() {
            alert("error");
        });
}

function getUserData(persistedFaceId, callback){
    myFaceList.forEach(element => {
        if(element.persistedFaceId == persistedFaceId){
            var userData = JSON.parse(element.userData);    
            callback(userData);       
        }
    });
}