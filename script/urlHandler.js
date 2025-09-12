const urlParams = new URLSearchParams(window.location)
let searchParam = urlParams.get("search")

if (!searchParam) {
	window.location = "index.html?search=pokemon-1"
}

if (searchParam.includes("pokemon")) {
	loadSpeficPokemon(Number(searchParam.split("-")[1]))
}