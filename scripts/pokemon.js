const pageFetchURL = "https://pokeapi.co/api/v2/pokemon?offset="
const urlParams = new URLSearchParams(window.location.search)
const pageContent = document.querySelector("#bottom")
const headerContent = document.querySelector("#top")
let currentPage = Number(urlParams.get("page")) || 1
let lastPage

if (!Number(currentPage)) { location.search = "?page=1" }

pageContent.innerHTML = ""
pageContent.insertAdjacentHTML("beforeend", "<ol id='list'></ol>")
headerContent.insertAdjacentHTML("beforeend", `<p id='page'>Page ${currentPage}</p><button id='backwords'>Last Page</button><button id='forwords'>Next Page</button>`)

function fetchNumber() {
	fetch(`${pageFetchURL}0`)
		.then((response) => response.json())
		.then((data) => {
			lastPage = Math.round(data.count / 30)
		})
}

function loadButtons() {
	const nextPage = document.querySelector("#forwords")
	const backPage = document.querySelector("#backwords")

	nextPage.addEventListener("click", () => {
		if ((currentPage + 1) > lastPage) { currentPage = 0 }

		location.search = `?page=${currentPage += 1}`
	})

	backPage.addEventListener("click", () => {
		if ((currentPage - 1) <= 0) { currentPage = lastPage }

		location.search = `?page=${currentPage -= 1}`
	})

	fetchNumber()
}

async function loadPokemons() {
	let returnedTable

	await fetch(`${pageFetchURL}${30 * (currentPage - 1)}&limit=30`)
		.then((response) => response.json())
		.then((data) => {
			returnedTable = data.results
		})

	returnedTable.forEach((element, idx) => {
		setTimeout(() => {
			fetch(element.url)
				.then((response) => response.json())
				.then((data) => {
					console.log(element)
					console.log(data)
					document.querySelector("#list").insertAdjacentHTML("beforeend", `<img src="${data.sprites.front_default}" alt="${data.name}-${data.order}">`)
				})
		}, idx * 100)
	})
}

loadButtons()
loadPokemons()