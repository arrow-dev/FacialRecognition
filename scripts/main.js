"use strict";function checkImage(e){var t=myFileSelector.files[0],a=new FileReader;t?a.readAsDataURL(t):alert("Invalid File!"),a.onloadend=function(){t.name.match(/\.(jpg|jpeg|png)$/)?e(t):alert("Invalid File!")}}function sendFaceDetectRequest(e,t){$.ajax({url:"https://api.projectoxford.ai/face/v1.0/detect",beforeSend:function(e){e.setRequestHeader("Content-Type","application/octet-stream"),e.setRequestHeader("Ocp-Apim-Subscription-Key","9da3ade20681481bb489a91e206a37c9")},type:"POST",data:e,processData:!1}).done(function(e){if(0!=e.length){var a=e[0].faceId;t(a)}else alert("Could not detect a face, please try another image!")}).fail(function(e){var t=JSON.parse(e.responseText);alert(t.error.message)})}function sendFindSimilarRequest(e,t){$.ajax({url:"https://api.projectoxford.ai/face/v1.0/findsimilars",beforeSend:function(e){e.setRequestHeader("Content-Type","application/json"),e.setRequestHeader("Ocp-Apim-Subscription-Key","9da3ade20681481bb489a91e206a37c9")},type:"POST",data:JSON.stringify({faceId:e,faceListId:"master",maxNumOfCandidatesReturned:6,mode:"matchFace"})}).done(function(e){0!=e.length&&t(e)}).fail(function(){alert("error")})}function sendGetListRequest(e){$.ajax({url:"https://api.projectoxford.ai/face/v1.0/facelists/master?",beforeSend:function(e){e.setRequestHeader("Ocp-Apim-Subscription-Key","9da3ade20681481bb489a91e206a37c9")},type:"GET",data:"{ body }"}).done(function(t){0!=t.length&&e(t)}).fail(function(){alert("error")})}function getUserData(e,t){myFaceList.forEach(function(a){if(a.persistedFaceId==e){var n=JSON.parse(a.userData);t(n)}})}var myFileSelector=$("#myFileSelector")[0],myFaceList;sendGetListRequest(function(e){myFaceList=e.persistedFaces}),myFileSelector.addEventListener("change",function(){$("div #images").empty(),checkImage(function(e){sendFaceDetectRequest(e,function(e){sendFindSimilarRequest(e,function(e){e.forEach(function(e){getUserData(e.persistedFaceId,function(t){console.log(t.name+" "+t.url);var a=$("<div>").attr({"class":"col-xs-12 col-sm-6 imgItem"}),n=$("<img>").attr({src:t.url}),i=$("<h3>").append(t.name),c=$("<h4>").append(Math.round(100*e.confidence)+"% Match");a.append(n,i,c),$("div #images").append(a)})})})})})});