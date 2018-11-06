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

    //getting elements from DOM
    const showGalleryBtn = document.getElementById('show_gallery');
    const myGalleryContainer = document.getElementById('my-custom-gallery');
    const foundPhotosContainer = document.getElementById('images-from-flickr');
    const searchForm = document.getElementById('search_form');
    document.getElementById('search_input').focus(); // set autofocus to input on page load


    let renderedPhotoItem = ''; // here will be single photo


    //validate search form on submit event
    //searchPhrase taken from user input
    //on successful validation perform search and render result
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchPhrase = document.getElementById('search_input').value;
        if(searchPhrase === '') {
            alert('Search field must contain any text!');
            return false
        } else {
            foundPhotosContainer.innerHTML = '';
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
            foundPhotosContainer.appendChild(onePicsItem);
        }
    }

    //function doSearch performs most of search process, and output results
    //
    function doSearch() {
        let reqSearch = new XMLHttpRequest();
        flickrEndpoint += '&text=' + searchPhrase;
        let wholePhotos = []; // here will be all the photos grabbed from API
            reqSearch.open("GET", flickrEndpoint, true, 'mob_dev', 'asdfasdf');
            reqSearch.send();
            reqSearch.onload = function() {
                if(reqSearch.status !== 200) {
                    alert('Server responded with error ' + reqSearch.status + ':' + reqSearch.statusText);
                } else {
                    wholePhotos = JSON.parse(reqSearch.responseText);
                    wholePhotos = wholePhotos.photos.photo;
                    if(wholePhotos.length > 0){
                        doRenderImages(wholePhotos);
                        searchForm.reset();
                        renderedPhotoItem = document.getElementsByClassName('one-gallery-item');
                        showGalleryBtn.classList.remove('disabled');
                    } else {
                        alert('could not find any picture for this word');
                    }
                }
            };
    }

    //
    // listen to what photos add to gallery
    //

    let selectedPics = [];
    foundPhotosContainer.addEventListener('click', function(evt){
        let clickedPic = evt.target;
        clickedPic.classList.toggle('active');
        if(clickedPic.classList.contains('active')){
            selectedPics.push(clickedPic.innerHTML);
            return selectedGalleryPics = Array.from(selectedPics);
        } else {
            if(selectedPics !== ''){
                selectedPics.pop(clickedPic.innerHTML);
            }
        }
    });

        //
        // a lot of manipulation on click, creating a gallery and rendering it
        //

        showGalleryBtn.addEventListener('click', function(e){
            e.preventDefault();
            let myGallery = [];
            myGalleryContainer.innerHTML = '';
            let showGalleryBtn = e.target;
            if(!showGalleryBtn.classList.contains('disabled')) {
                if(typeof selectedGalleryPics !== "undefined" && selectedPics.length > 0) {
                    myGallery = Object.values(selectedGalleryPics);
                    let galleryTitle = document.createElement('h3');
                    galleryTitle.innerText = "It's your selected photos";
                    galleryTitle.classList.add('title');
                    myGalleryContainer.appendChild(galleryTitle);
                    for(let one in myGallery) {
                        let objectMyGal = {
                          element: myGallery[one]
                        };
                        let gallerylistWrap = document.createElement('li');
                        gallerylistWrap.classList.add('one-gallery-item');
                        gallerylistWrap.innerHTML = objectMyGal.element;
                        myGalleryContainer.appendChild(gallerylistWrap);
                    }
                    foundPhotosContainer.innerHTML = '';
                } else {
                    alert('your gallery is empty, my lord');
                }
            } else {
                alert('you should search for your photos first');
            }
        });

});