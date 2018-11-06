document.addEventListener('DOMContentLoaded', function(){
    let flickrEndpoint = "https://api.flickr.com/services/rest/?"; //flickr api to call
    const myApiKey = "api_key=b54580f369a7eeebecb2004dc429d08f"; // unique api key
    const methodSearch = "&method=flickr.photos.search"; //method to search photos
    const formatResponse = "&format=json"; // response format to parse items into whole photos
    const photosAmount = "&per_page=16&sort=relevance"; // options for photos
    const imgUrl = "&extras=url_m"; // get the url of the image
    const plainJson = "&nojsoncallback=true"; // to get response in json instead of jsonp
    let searchPhrase = '';
    flickrEndpoint+= myApiKey + methodSearch + formatResponse + photosAmount + imgUrl + plainJson;//just concat it in one request

    const searchForm = document.getElementById('search_form');
    document.getElementById('search_input').focus(); // set autofocus to input on page load
    let renderedPhotoItem = '';
    let showGalleryBtn = document.getElementById('show_gallery');

    //validate search form on submit event
    //@param searchPhrase taken from user input
    //on successful validation perform search and render result
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchPhrase = document.getElementById('search_input').value;
        if(searchPhrase === '') {
            alert('Search field must contain any text!');
            return false
        } else {
            document.getElementById('images-from-flickr').innerHTML = '';
            doSearch();
        }
    });
    //
    //render images from an array
    function doRenderImages(arr) {
        for( let i = 0; i < arr.length; i++) {
            let singleListObject = {
                src: arr[i].url_m,
                title: arr[i].title,
                id: arr[i].id
            };
            if (singleListObject.src === '' || singleListObject.src === undefined) {
                singleListObject.src = 'https://www.freeiconspng.com/uploads/no-image-icon-21.png';
            }
            let onePicsItem = document.createElement('li');
            onePicsItem.classList.add('one-gallery-item');
            let imageElement = document.createElement('img');
            let imgTitle = document.createElement('h4');
            imageElement.src = singleListObject.src;
            imageElement.title = singleListObject.title;
            imgTitle.innerText = singleListObject.title;
            onePicsItem.innerHTML += imgTitle.outerHTML + imageElement.outerHTML;
            document.getElementById('images-from-flickr').appendChild(onePicsItem);
        }
    }

    //function doSearch performs most of search process, and output results
    //
    function doSearch() {
        let reqSearch = new XMLHttpRequest();
        flickrEndpoint += '&text=' + searchPhrase;
        console.log(searchPhrase);
        let wholePhotos = []; // here will be all the photos grabbed from API
            reqSearch.open("GET", flickrEndpoint, true, 'mob_dev', 'asdfasdf');
            reqSearch.send();
            reqSearch.onload = function() {
                if(reqSearch.status !== 200) {
                    alert('Server responded with error ' + reqSearch.status + ':' + reqSearch.statusText);
                } else {
                    wholePhotos = JSON.parse(reqSearch.responseText);
                    wholePhotos = wholePhotos.photos.photo;
                    doRenderImages(wholePhotos);
                    // console.log(wholePhotos);
                    // console.log(reqSearch.responseText);
                    //now we have array of objects - images
                    //lets render it one by one as html elements

                    searchForm.reset();
                    renderedPhotoItem = document.getElementsByClassName('one-gallery-item');
                    showGalleryBtn.classList.remove('disabled');
                    // console.log(renderedPhotoItem);
                }
            };
    }

    let selectedPics = [];
    document.getElementById('images-from-flickr').addEventListener('click', function(evt){
        let clickedPic = evt.target;
        clickedPic.classList.toggle('active');
        if(clickedPic.classList.contains('active')){
            selectedPics.push(clickedPic.outerHTML);
            // console.log('added class');
            console.log(selectedPics);
            console.log('added to arr');
            return selectedPics = Array.from(selectedPics);
        } else {
            if(selectedPics !== ''){
                selectedPics.pop(clickedPic.outerHTML);
                console.log(selectedPics);
                console.log('removed from arr');
            }
            console.log('removed class');
        }
    });

        showGalleryBtn.addEventListener('click', function(e){
            e.preventDefault();
            console.log(e.target);
            let showGalleryBtn = e.target;
            if(!showGalleryBtn.classList.contains('disabled')) {
                if(typeof selectedPics !== "undefined" && selectedPics.length > 0) {
                    // let myGallery = selectedPics.map(function(){

                    // });
                    console.log(Object.values(selectedPics) + ' here are your images!!!');
                } else {
                    alert('your gallery is empty, my lord');
                }
            } else {
                alert('you should search for your photos first');
            }
        });

});