let currentItemSelect = 1;
let maxLoading = 0;

const FetchURLs = {
	"poke": "https://pokeapi.co/api/v2/pokemon/",
	"attack": "https://pokeapi.co/api/v2/ability/",
	"item": "https://pokeapi.co/api/v2/item/"
}

function openAllPage(input) {
	document.querySelector("#page").innerHTML = `Page ${currentPage}`
	currentItemSelect = 1

	async function loadNextItem() {
		const listElement = await document.querySelector("#list-end")

		for (let i = 0; i < 16; i++) {
			let reached = false

			if (input == "poke" && currentItemSelect == 1025) {
				currentItemSelect = 10025
			} else if (input == "attack" && currentItemSelect == 308) {
				currentItemSelect = 10001
			}

			if (input == "poke" && currentItemSelect >= 10278) {
				reached = true
			} else if (input == "attack" && currentItemSelect >= 367) {
				reached = true
			}

			if (reached == false) {
				fetch(`${FetchURLs[input]}${currentItemSelect}`)
					.then((response) => response.json())
					.then((data) => {
						let nameOfItem

						try {
							(data.names[pokeDexLanguage].name)
							nameOfItem = data.names[pokeDexLanguage].name
						} catch {
							nameOfItem = data.name
						}

						if (data.sprites.default) {
							listElement.insertAdjacentHTML("beforebegin",
								`<li title="${nameOfItem}">
								<figure>
									<img src="${data.sprites.default}" id="${data.id}" alt="order-${data.id}">
									<figcaption><p>${nameOfItem}</p></figcaption>
								</figure>
							</li>`)
						} else if (!data.sprites.front_default || data.sprites.front_default == null) {
							listElement.insertAdjacentHTML("beforebegin",
								`<li title="${nameOfItem}">
								<figure class="unknown">
									<img src="${unknownIcon}" id="${data.id}" alt="order-${data.order}" class="unknown">
									<figcaption><p>${nameOfItem}</p></figcaption>
								</figure>
							</li>`)
						} else {
							listElement.insertAdjacentHTML("beforebegin",
								`<li title="${nameOfItem}">
								<figure>
									<img src="${data.sprites.front_default}" id="${data.id}" alt="order-${data.order}">
									<figcaption><p>${nameOfItem}</p></figcaption>
								</figure>
							</li>`)
						}
					})

				currentItemSelect += 1
			}
		}
	}

	loadNextItem()

	setTimeout(() => {
		const observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting) {
				loadNextItem()
			}
		}, {
			root: null,
			rootMargin: "0px",
			threshold: 0.5
		});

		observer.observe(document.querySelector("#list-end"))
	}, 100)
}