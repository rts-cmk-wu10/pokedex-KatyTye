const urlParams = new URLSearchParams(window.location)
let searchParam = urlParams.get("search") || "1"

if (searchParam.includes("pokemon")) {
	loadSpeficPokemon(Number(searchParam.split("-")[1]))
}