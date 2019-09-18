# customer-vision-demo-solarcell
 customer-vision-demo-solarcell

 Please follow up the deployment steps of this link: https://github.com/microsoft/computerscience/blob/master/Labs/AI%20and%20Machine%20Learning/Custom%20Vision%20Service/Custom%20Vision%20Service.md

 Pay attention to modify ajax code as following example, adding headers content-type as application/octet-stream.

1. Scroll down in **predict.js** and examine the block of code that begins on line 29. This is the code that calls out to the Custom Vision Service using AJAX. Using the Custom Vision Prediction API is as simple as making an authenticated POST to a REST endpoint.

	```javascript
 $.ajax({
            type: "POST",
            url: url,
            data: imageBytes,
            processData: false,
            headers: {
                "Prediction-Key": predictionKey,
                "Content-Type": "application/octet-stream"
            }
        }).done(function (data) {
            var predictions = data.predictions;
            var solarcell = [predictions.find(o => o.tagName === 'solarcell-bad'), predictions.find(o => o.tagName === 'solarcell-good')];
            var sortedsolarcell = _.sortBy(solarcell, 'probability').reverse();
            var possiblesolarcell = sortedsolarcell[0];

            if (possiblesolarcell.probability > 0.9) {
                $('#analysisResults').html('<div class="matchLabel">' + possiblesolarcell.tagName + ' (' + (possiblesolarcell.probability * 100).toFixed(0) + '%)' + '</div>');
            }
            else {
                $('#analysisResults').html('<div class="noMatchLabel">Unknown picture</div>');
            }

        }).fail(function (xhr, status, err) {
            alert(err);
        });
	```
