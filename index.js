const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const movies = []
let filteredMovies = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const MOVIES_PER_PAGE = 12
const paginator = document.querySelector('#paginator')
const displayModes = document.querySelector('.display-modes')
let cardModeOn = true
let currentPage = 1

// functions
function renderMovieList(data) {
  let rawHTML = ''
  if (!cardModeOn) {
    rawHTML += '<div class="list-group-flush w-100">'
    data.forEach((item) => {
      rawHTML += `<div class="list-group-item d-flex justify-content-between">${item.title}
        <span>
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id=${item.id}>More</button>
          <button class="btn btn-info btn-add-favorite" data-id=${item.id}>+</button>
        </span> 
      </div>`
      
    });
    rawHTML += '</div>'
    dataPanel.innerHTML = rawHTML
  } else {
    console.log("render list mode")
    data.forEach((item) => {
      rawHTML += `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img
            src="${POSTER_URL + item.image}"
            class="card-img-up" alt="Movie Poster" />
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>
    `
    });
    dataPanel.innerHTML = rawHTML
  }
}




function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalImage.innerHTML = `
    <img src="${POSTER_URL+data.image}" alt="movie-poster" class="img-fluid">
    `
    modalDate.innerText = 'Release date:' + data.release_date
    modalDescription.innerText = data.description
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('?????????????????????????????????')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  console.log(movie)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount/MOVIES_PER_PAGE)
  let rawHTML = ''

  for(let page = 1; page <= numberOfPages; page++){
    rawHTML += `  <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}


// listeners
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
 if (event.target.tagName !== 'A' ) return // ????????????a??????(<a></a>)
  currentPage = Number(event.target.dataset.page)
 renderMovieList(getMoviesByPage(currentPage))
})

displayModes.addEventListener('click', function ListModeClicked(event) {
  if (event.target.matches('.fa-bars')) {
    cardModeOn = false
    console.log('list clicked', cardModeOn)
    renderMovieList(getMoviesByPage(currentPage))
  } else {
    cardModeOn = true
    console.log('card clicked', cardModeOn)
    renderMovieList(getMoviesByPage(currentPage))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase() //??? searchInput.value ?????? search bar ??? input ???
  // if (!keyword.length) {
  //   return alert('Please enter a valid string')
  // }
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovies.length === 0) {
    return alert(`????????????????????????${keyword} ???????????????????????????`)
  }

  //?????? movies ??????????????????????????????????????? input ?????? title ??????
  // ????????????title ?????? input ????????????????????????????????????????????????
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //     console.log(filteredMovies)
  //   }
  // }
  renderPaginator(filteredMovies.length)
  renderMovieList(filteredMovies)
  // ????????????????????? renderMovieList ?????????????????????????????????????????????
})

axios.get(INDEX_URL).then(function (response) {
  movies.push(...response.data.results) //??????????????? ?????????????????? ???????????? response.data.results ????????????????????????????????????????????? push ??????????????????????????????????????? movies ??????
  renderMovieList(getMoviesByPage(1))
  renderPaginator(movies.length)
}).catch((err) => console.log(err))
