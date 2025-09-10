const sourceApiURL = "https://pokeapi.co/api/v2/pokemon/"
const sourceHTML = document.querySelector("#wrapper")
let pokemonData
let sourceColors
let baseHTML

async function loadSpeficPokemon(pokemonID) {
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

	pdxType.innerHTML = pokemonData.types.map((elm) => {
		return `<li style="background: ${sourceColors[elm.type.name.toLowerCase()]};"><p>${elm.type.name}</p></li>`
	}).join().replaceAll(",", "")

	pdxStats.innerHTML = pokemonData.stats.map((elm) => {
		return `<li><p>${retrieveStatsName(elm.stat.name)}</p><p>${elm["base_stat"]}</p><progress value="${elm["base_stat"]}" max=100></progress></li>`
	}).join().replaceAll(",", "")
}

function retrieveStatsName(input) {
	let returnValue = input

	returnValue = returnValue.replace("hp", "HP")
	returnValue = returnValue.replace("speed", "SPD")
	returnValue = returnValue.replace("attack", "ATK")
	returnValue = returnValue.replace("defense", "DEF")
	returnValue = returnValue.replace("special", "S")
	returnValue = returnValue.replace("-", "")

	return returnValue
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