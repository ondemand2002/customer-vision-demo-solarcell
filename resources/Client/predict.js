$(function () {

    var url = "Replace with your PREDICTION_ENDPOINT";
    var predictionKey = "Replace with your prediction_key";
    
    var fs = require("fs");
    var _ = require('underscore');

    // Store the value of a selected image for display
    var imageBytes;

    // Handle clicks of the Upload Image button
    $("#select_button").click(function () {

        $('#analysisResults').html('');

        // Load the image and show it in the window
        const electron = require('electron');
        const dialog = require('electron').dialog;

        var va = electron.remote.dialog.showOpenDialog();

        var contents = fs.readFileSync(va[0], "base64");
        imageBytes = fs.readFileSync(va[0]);

        $('#previewImage').html('<img width="240" src="data:image/png;base64,' + contents + '" />');

        // Submit the image to the Custom Vision Service
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
    });
});