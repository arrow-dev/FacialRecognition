"use strict";function checkImage(e){var t=myFileSelector.files[0],a=new FileReader;t?a.readAsDataURL(t):alert("You must select a file!"),a.onloadend=function(){t.name.match(/\.(jpg|jpeg|png)$/)?e(t):alert("Invalid file!")}}function sendFaceDetectRequest(e,t){$.ajax({url:"https://api.projectoxford.ai/face/v1.0/detect",beforeSend:function(e){e.setRequestHeader("Content-Type","application/octet-stream"),e.setRequestHeader("Ocp-Apim-Subscription-Key","9da3ade20681481bb489a91e206a37c9")},type:"POST",data:e,processData:!1}).done(function(e){if(0!=e.length){var a=e[0].faceId;t(a)}else alert("Could not detect a face, please try another image!"),myBtn.style.visibility="visible"}).fail(function(e){var t=JSON.parse(e.responseText);alert(t.error.message)})}function sendFindSimilarRequest(e,t){$.ajax({url:"https://api.projectoxford.ai/face/v1.0/findsimilars",beforeSend:function(e){e.setRequestHeader("Content-Type","application/json"),e.setRequestHeader("Ocp-Apim-Subscription-Key","9da3ade20681481bb489a91e206a37c9")},type:"POST",data:JSON.stringify({faceId:e,faceListId:"master",maxNumOfCandidatesReturned:6,mode:"matchFace"})}).done(function(e){0!=e.length&&t(e)}).fail(function(){alert("error"),myBtn.style.visibility="visible"})}function sendGetListRequest(e){$.ajax({url:"https://api.projectoxford.ai/face/v1.0/facelists/master?",beforeSend:function(e){e.setRequestHeader("Ocp-Apim-Subscription-Key","9da3ade20681481bb489a91e206a37c9")},type:"GET",data:"{ body }"}).done(function(t){0!=t.length&&(e(t),myBtn.style.visibility="visible")}).fail(function(){alert("Something went wrong, try refreshing the page.")})}function getUserData(e,t){myFaceList.forEach(function(a){if(a.persistedFaceId==e){var i=JSON.parse(a.userData);t(i)}})}var myFileSelector=$("#myFileSelector")[0],myFaceList,myBtn=$("#btnStart")[0];sendGetListRequest(function(e){myFaceList=e.persistedFaces}),myFileSelector.addEventListener("change",function(){myBtn.style.visibility="hidden",$("#images").empty(),checkImage(function(e){sendFaceDetectRequest(e,function(e){sendFindSimilarRequest(e,function(e){e.forEach(function(e){getUserData(e.persistedFaceId,function(t){console.log(t.name+" "+t.url);var a=$("<div>").attr({"class":"col-xs-12 col-sm-6 imgItem"}),i=$("<h3>").append(t.name),n=$("<h4>").append(Math.round(100*e.confidence)+"% Match"),s=$("<img>").attr({src:"../images/loader.gif"}),c=$("<img>").attr({src:t.url}).on("load",function(){s.hide(),c.show()}).hide();a.append(s,c,i,n),$("#images").append(a),myBtn.style.visibility="visible"})})})})})});