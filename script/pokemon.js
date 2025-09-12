const sourceApiURL = "https://pokeapi.co/api/v2/pokemon/"
const sourceHTML = document.querySelector("#wrapper")
let pokemonData
let sourceColors
let baseHTML

async function loadSpeficPokemon(pokemonID) {
	let currentColor
	let nextColor

	await fetch(`${sourceApiURL}${pokemonID}`)
		.then((repsonse) => repsonse.json())
		.then((data) => {
			pokemonData = data
			console.log(data);
		})

	await fetch("/script/templates/colors.json")
		.then((repsonse) => repsonse.json())
		.then((data) => {
			sourceColors = data
		})

	await fetch("/script/templates/pokemon.json")
		.then((repsonse) => repsonse.json())
		.then((data) => {
			baseHTML = data
		})

	sourceHTML.insertAdjacentHTML("afterbegin", baseHTML.value)
	sourceHTML.querySelector("#content > .pokemon-top").insertAdjacentHTML("afterbegin", baseHTML.svg)

	const pokemonName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)
	const pdxWeight = document.querySelector("#pokemon-weight")
	const pdxHeight = document.querySelector("#pokemon-height")
	const pdxImage = document.querySelector("#pokemon-image")
	const pdxName = document.querySelector("#pokemon-name")
	const pdxMoves = document.querySelector("#abilitys-list")
	const pdxId = document.querySelector("#pokemon-id")
	const pdxStats = document.querySelector("#stats-list")
	const pdxType = document.querySelector("#type")

	pdxWeight.innerHTML = pokemonData.weight / 10 + " kg"
	pdxHeight.innerHTML = pokemonData.height / 10 + " m"
	pdxImage.src = pokemonData.sprites.other["official-artwork"]["front_default"]
	pdxName.innerHTML = pokemonName
	pdxId.innerHTML = "#" + retrievePokemonID(pokemonData.order)
	pdxMoves.innerHTML = pokemonData.abilities.map((elm) => { return `<p>${elm.ability.name}</p>` }).join().replaceAll(",", "")

	pdxType.innerHTML = pokemonData.types.map((elm, idx) => {
		if (idx === 0) {
			currentColor = sourceColors[elm.type.name.toLowerCase()]
			nextColor = `${sourceColors[elm.type.name.toLowerCase() + "2"]}`
		}
		return `<li style="background: ${sourceColors[elm.type.name.toLowerCase()]};"><p>${elm.type.name}</p></li>`
	}).join().replaceAll(",", "")

	pdxStats.innerHTML = pokemonData.stats.map((elm) => {
		return `<li><p style="color:${currentColor};">${retrieveStatsName(elm.stat.name)}</p><p>${elm["base_stat"]}</p><progress value="${elm["base_stat"]}" max=100></progress></li>`
	}).join().replaceAll(",", "")

	document.querySelector(".pokemon-top > svg").style.fill = nextColor
	document.querySelector(".pokemon-top").style.background = currentColor
	document.querySelectorAll("h2").forEach((elm) => { elm.style.color = currentColor })
	document.querySelectorAll(".basic-info li > p").forEach((elm) => { elm.style.color = currentColor })
	document.querySelectorAll("progress").forEach((elm) => {
		elm.style.setProperty("--third-text-color", currentColor);
	})
}

function retrieveStatsName(input) {

	input = input.replace("hp", "HP")
	input = input.replace("speed", "SPD")
	input = input.replace("attack", "ATK")
	input = input.replace("defense", "DEF")
	input = input.replace("special", "S")
	input = input.replace("-", "")

	return input
}

function retrievePokemonID(id) {
	if (id < 1000) {
		if (id < 100) {
			if (id < 10) {
				return `000${id}`
			} else {
				return `00${id}`
			}
		} else {
			return `0${id}`
		}
	} else {
		return `${id}`
	}
}