var multiForm = document.getElementById('multi-images-uploader');
var singleForm = document.getElementById('single-image-uploader');
var singleImgInput = document.getElementById('single-image-input');
var multiImgInput = document.getElementById('multi-images-input');
var singleImgDisplay = document.getElementById('single-image-display');
var multiImgDisplay = document.getElementById('files-list-display');

var multiImgFormData;
var singleImgFormData;

multiForm.addEventListener('submit', function (e) {
  e.preventDefault();
  request(multiImgFormData, multiForm.action);
});

singleForm.addEventListener('submit', function (e) {
  e.preventDefault();
  request(singleImgFormData, singleForm.action);
});

singleImgInput.addEventListener('change', function (e) {
  singleImgDisplay.innerHTML = '';
  singleImgFormData = new FormData();
  singleImgFormData.append('image', singleImgInput.files[0]);
  renderFileMeta(singleImgDisplay, singleImgInput.files[0], 0);
});


multiImgInput.addEventListener('change', function (e) {
  var filesCount = multiImgInput.files.length;

  multiImgDisplay.innerHTML = '';
  multiImgFormData = new FormData();

  for (var i = 0; i < filesCount; i++) {
    multiImgFormData.append('images', multiImgInput.files[i]);
    renderFileMeta(multiImgDisplay, multiImgInput.files[i], i);
  }
});

function renderFileMeta(display, file, index) {
  var fileDisplayEl = document.createElement('p');

  fileDisplayEl.innerHTML = (index + 1) + ': ' + file.name;
  display.appendChild(fileDisplayEl);
};

//todo see mdn formData example
//todo also add how much ms it took to complete

//todo after response singleForm.reset();
function request(form, url) {
  if (!form) {
    return;
  }

  var xhr = new XMLHttpRequest();

  xhr.open('POST', url);
  xhr.send(form);

  xhr.addEventListener("load", function (e) {
    console.log('onload response: ', xhr.response)
    console.log('onload status: ', xhr.status)
    console.log('onload statusText: ', xhr.statusText)
  });
}
