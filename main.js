document.addEventListener('DOMContentLoaded', function(){
    var flickrEndpoint = "https://api.flickr.com/services/rest/?"; //flickr api to call
    const myApiKey = "api_key=b54580f369a7eeebecb2004dc429d08f"; // unique api key
    const methodSearch = "&method=flickr.photos.search"; //method to search photos
    const formatResponse = "&format=json"; // response format to parse items into whole photos
    const photosAmount = "&per_page=16&sort=relevance"; // options for photos
    const imgUrl = "&extras=url_m"; // get the url of the image
    const plainJson = "&nojsoncallback=true"; // to get response in json instead of jsonp
    let searchPhrase = '';
    flickrEndpoint+= myApiKey + methodSearch + formatResponse + photosAmount + imgUrl + plainJson;//just concat it in one request

    const searchForm = document.getElementById('search_form');
    document.getElementById('search_input').focus();
    let renderedPhotoItem = '';

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

    function doSearch() {
        let reqSearch = new XMLHttpRequest();
        flickrEndpoint += '&text=' + searchPhrase;
        console.log(searchPhrase);
        let wholePhotos = [];
            reqSearch.open("GET", flickrEndpoint, true, 'mob_dev', 'asdfasdf');
            reqSearch.send();
            reqSearch.onload = function() {
                if(reqSearch.status != 200) {
                    alert('Server responded with error ' + reqSearch.status + ':' + reqSearch.statusText);
                } else {
                    wholePhotos = JSON.parse(reqSearch.responseText);
                    wholePhotos = wholePhotos.photos.photo;
                    console.log(wholePhotos);
                    console.log(reqSearch.responseText);
                    for( let i = 0; i < wholePhotos.length; i++) {
                        let src = wholePhotos[i].url_m;
                        let title = wholePhotos[i].title;

                        let onePicsItem = document.createElement('li');
                        onePicsItem.classList.add('one-gallery-item');
                        let imageElement = document.createElement('img');
                        let imgTitle = document.createElement('h4');
                        if(src && src !== undefined){
                            imageElement.src = src;
                        } else {
                            imageElement.src = 'https://www.freeiconspng.com/uploads/no-image-icon-21.png';
                        }
                        imageElement.title = title;
                        imgTitle.innerText = title;
                        onePicsItem.innerHTML += imgTitle.outerHTML + imageElement.outerHTML;
                        document.getElementById('images-from-flickr').appendChild(onePicsItem);
                    }
                    searchForm.reset();
                    renderedPhotoItem = document.getElementsByClassName('one-gallery-item');
                    console.log(renderedPhotoItem);
                }
            };
        // } else {
        //     alert('Search field must contain any text!');
        //     return false
        // }
    }


    document.getElementById('images-from-flickr').addEventListener('click', function(evt){
        console.log(evt.target);
        let clickedPic = evt.target;
        clickedPic.classList.toggle('active');
    })

});