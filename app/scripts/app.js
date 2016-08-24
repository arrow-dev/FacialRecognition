var myFileSelector = $("#myFileSelector")[0];
myFileSelector.addEventListener("change", function () {
    //Check the image file is valid
    checkImage(function (myFile) {
        sendFaceDetectRequest(myFile, function (faceId) {
            alert(faceId);
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
        alert("Invalid File!");
    }
    myFileReader.onloadend = function () {
        if (!myFile.name.match(/\.(jpg|jpeg|png))$/)) {
            alert("Invalid File!");
        }
        else {
            callback(myFile);
        }
    };
}
function sendFaceDetectRequest(file, callback) {
    $.ajax({
        url: "https://api.projectoxford.ai/face/v1.0/detect",
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "9da3ade20681481bb489a91e206a37c9");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (data) {
        if (data.length != 0) {
            var faceId = data[0].faceId;
            callback(faceId);
        }
    })
        .fail(function (error) {
    });
}
var Face = (function () {
    function Face(id, faceAttr) {
        this.FaceId = id;
        this.FaceAttributes = faceAttr;
    }
    return Face;
}());
