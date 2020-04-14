var multiForm = document.getElementById('multi-images-uploader');
var singleForm = document.getElementById('single-image-uploader');
var singleImgInput = document.getElementById('single-image-input');
var multiImgInput = document.getElementById('multi-images-input');
var singleImgDisplay = document.getElementById('single-image-display');
var multiImgDisplay = document.getElementById('files-list-display');

var multiImgFormData, singleImgFormData;

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

function request(form, url) {
  if (!form) {
    return;
  }

  var xhr = new XMLHttpRequest();

  xhr.open('POST', url);
  xhr.send(form);

  xhr.onload = function(oEvent) {
    var resDisplay = document.getElementById('response-display');
    var html = '';
    var response = JSON.parse(xhr.response);

    html += `<p>${xhr.status} ${xhr.statusText}</p>`;
    html += `<p style="white-space: pre-wrap;">${JSON.stringify(response, null, 4)}</p>`;

    if (xhr.status === 200) {
      if (response.data.path) {
        html += `<p><a target="_blank" rel="noopener noreferrer" href="${response.data.path}">Preview</a></p>`
      } else {
        response.data.paths.forEach(function(p) {
          html += `<p><a target="_blank" rel="noopener noreferrer" href="${p}">Preview</a></p>`;
        });
      }
    }

    resDisplay.innerHTML = html;
  };
}
