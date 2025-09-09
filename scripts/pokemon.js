const pageFetchURL = "https://pokeapi.co/api/v2/pokemon?offset="
const urlParams = new URLSearchParams(window.location.search)
const pokemonFetchURL = "https://pokeapi.co/api/v2/pokemon/"
const pageContent = document.querySelector("#bottom")
const headerContent = document.querySelector("#top")
let currentPage = Number(urlParams.get("page")) || 1
const unknownIcon = "/icons/unknown.svg"
let pokemonsInPage = 32
let maxPokemons = 0
let cooldown = false
let lastPage

fetch(`${pageFetchURL}0`)
	.then((response) => response.json())
	.then((data) => {
		maxPokemons = data.count
		maxLoading = maxPokemons - 1
		lastPage = Math.round(data.count / pokemonsInPage)
	})

setTimeout(() => {
	if (!location.pathname.includes("html")) { history.pushState(null, null, "/index.html") }
	if (!Number(location.search.split("=")[1]) && !location.search.includes("all")) { history.pushState(null, null, "?page=1") }
	if (currentPage > lastPage && !location.search.includes("all")) { location.search = "?page=1" } else { console.log(`${currentPage} : ${lastPage}`) }
}, 250)

pageContent.innerHTML = ""
pageContent.insertAdjacentHTML("beforeend", "<ol id='list'><div id='list-end'></div></ol>")
headerContent.insertAdjacentHTML("beforeend", `<p id='page'>Page ${currentPage}</p><nav id="navigation"><button id='backwords'>Last Page</button><button id='all'>All Pokemons</button><button id='forwords'>Next Page</button></nav>`)

function loadButtons() {
	const nextPage = document.querySelector("#forwords")
	const backPage = document.querySelector("#backwords")
	const allPage = document.querySelector("#all")

	nextPage.addEventListener("click", () => {
		if (cooldown == false) {
			if (currentPage == "all") {
				history.pushState(null, null, `?page=1`)
				location.reload()
			}

			if ((currentPage + 1) > lastPage) { currentPage = 0 }
			cooldown = true

			history.pushState(null, null, `?page=${currentPage += 1}`)
			loadPokemons()
		}
	})

	allPage.addEventListener("click", () => {
		if (cooldown == false) {
			currentPage = "all"
			history.pushState(null, null, `?page=all`)
			document.querySelector("#list").innerHTML = "<div id='list-end'>"
			loadPokemons()
		}
	})

	backPage.addEventListener("click", () => {
		if (cooldown == false) {
			if (currentPage == "all") {
				history.pushState(null, null, `?page=-1`)
				location.reload()
			}

			if ((currentPage - 1) <= 0) { currentPage = lastPage }
			cooldown = true

			history.pushState(null, null, `?page=${currentPage -= 1}`)
			loadPokemons()
		}
	})
}

async function loadPokemons() {
	if (currentPage == "all" || location.search.includes("all")) { pokemonsInPage = 5000; currentPage = "all"; openAllPage("poke") } else {

		const listElement = document.querySelector("#list")
		document.querySelector("#page").innerHTML = `Page ${currentPage}`
		let returnedTable

		listElement.innerHTML = ""

		await fetch(`${pageFetchURL}${pokemonsInPage * (currentPage - 1)}&limit=${pokemonsInPage}`)
			.then((response) => response.json())
			.then((data) => {
				returnedTable = data.results
			})

		returnedTable.forEach((element, idx) => {
			setTimeout(() => {
				fetch(element.url)
					.then((response) => response.json())
					.then((data) => {
						if (!data.sprites.front_default || data.sprites.front_default == null) {
							listElement.insertAdjacentHTML("beforeend",
								`<li title="${data.name}">
								<figure class="unknown">
									<img src="${unknownIcon}" id="${data.id}" alt="order-${data.order}" class="unknown">
								</figure>
							</li>`)
						} else {
							listElement.insertAdjacentHTML("beforeend",
								`<li title="${data.name}">
								<figure>
									<img src="${data.sprites.front_default}" id="${data.id}" alt="order-${data.order}">
								</figure>
							</li>`)
						}
					})
			}, idx * 100)
		})
	}

	setTimeout(() => {
		cooldown = false
		console.log("Cooldown Resetet")
	}, pokemonsInPage * 100)
}

function loadSpeficPokemon(id) {
	fetch(`${pokemonFetchURL}${id}`)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);

			headerContent.insertAdjacentHTML("beforeend", `
			<h2 class="inline" id="page-info">${data.name.charAt(0).toUpperCase()}${data.name.substring(1)}</h2>
			<img src="${data.sprites.other["dream_world"]["front_default"]}" alt="image of pokemon" style="inline-block" class="inline">
		`)
		})
	console.log(id);
}

pageContent.addEventListener("click", (elm) => {
	if (Number(elm.target.id)) {
		pageContent.innerHTML = ""
		headerContent.innerHTML = ""
		loadSpeficPokemon(elm.target.id)
	}
})

loadButtons()
loadPokemons()