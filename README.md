# Express Multer images upload boilerplate

> A clean and simple nodejs images uploader boilerplate/example ready to be run  

### Using:

- Express.js
- Multer
- Other utility modules such as: async, ejs..

### Boilerplate Includes:

`boilerplate` includes a simple and straight forward validation to prevent malicious uploads to the 
server. Features include:

- Single image upload
- Multiple images upload (array)
- Files validation (reject non images files)
- Image format validation (whitelist specific formats e.g: JPEG,PNG)
- Custom Multer disk storage (post upload actions e.g: compressing)



### Quick Setup

``` bash
# install deps
npm install

# serve example at 127.0.0.1:3030
npm start
```


### cURL Examples
#### Single image upload

Fire a basic POST / Form request to 127.0.0.1:3030/api/images

    curl -F "image=@path/to/local/image" http://127.0.0.1:3030/api/images/
    
#### Multiple images upload (array of images)

Add up to 10 -configurable- images at once at 127.0.0.1:3030/api/images/multi

    curl -F "images=@path/to/local/image" -F "images=@path/to/local/image" http://127.0.0.1:3030/api/images/multi

## License
The code is available under the [MIT](http://opensource.org/licenses/MIT) license.


