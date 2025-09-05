const buttons = document.querySelectorAll("#wrapper > .design button")

buttons.forEach((element) => {

	element.addEventListener("click", () => {
		(element.innerHTML === "Pokemons") ? location.href = "index.html?page=1" : location.href = `${element.innerHTML.toLowerCase()}.html`;
	})
})