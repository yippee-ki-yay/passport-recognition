var tesseract = require('node-tesseract');
var cv = require('opencv');

var sendersData = {
  firstName: 'Martin',
  lastName: 'Sarah',
  date: '850101',
};

var GREEN = [0, 255, 0];
var inputImg = __dirname + '/test_images/passport_CAN.jpg';
var outputImg = __dirname + '/test_images/passport_transformed.jpg';


var lower_threshold = [];
var upper_threshold = [];

var numMatches = 0;

(function startRecognition() {

  lower_threshold = [ 0 + Math.random()* 5];
  upper_threshold = [110 + Math.random()*5];

  console.log(lower_threshold + " " + upper_threshold);

  transformImage();

})();

function transformImage() {
  cv.readImage(inputImg, function(err, im){
    if (err) throw err;
   if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');

   im.convertGrayscale();

    im.inRange(lower_threshold, upper_threshold);

    tmpImg = im.copy();

   tmpImg.save(outputImg);
   console.log('Image thresholded');

   extractText(outputImg);

  });
}


function extractText(image) {
  tesseract.process(image,function(err, text) {
      if(err) {
          console.error(err);
      } else {

         text = text.toLowerCase();

         numMatches = 0;

         console.log(text);

          if(text.indexOf(sendersData.firstName.toLowerCase()) !== -1) {
            console.log("First name matches");
            numMatches++;
          }

          if(text.indexOf(sendersData.lastName.toLowerCase()) !== -1) {
            console.log("Last name matches");
            numMatches++;
          }

          if(text.indexOf(sendersData.date.toLowerCase()) !== -1) {
            console.log("date match");
            numMatches++;
          }

          if(numMatches === 3) {
            console.log("This is the right passport");
          } else {
            console.log("This is not the right passport");
          }

      }
  });
}
