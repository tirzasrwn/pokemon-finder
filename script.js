/**
 * Fetch Pokémon data from PokeAPI based on the user input (name or ID).
 * Updates the DOM to display all available Pokémon details.
 * Displays the URL of the request and the raw JSON response at the bottom of the page.
 * If the Pokémon is not found, an error message is displayed.
 *
 * @async
 * @function fetchPokemon
 * @returns {Promise<void>} - A promise that resolves when the Pokémon data has been fetched and displayed.
 */
async function fetchPokemon() {
  const nameOrId = document.getElementById("pokemonName").value.toLowerCase();
  const pokemonInfoDiv = document.getElementById("pokemon-info");
  const rawJsonDiv = document.getElementById("raw-json");
  const requestUrlDiv = document.getElementById("request-url");
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`;

  // Display loading states
  pokemonInfoDiv.innerHTML =
    '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
  rawJsonDiv.innerHTML = "<p>Loading...</p>";
  requestUrlDiv.textContent = apiUrl;

  try {
    // Fetch data from PokeAPI
    const response = await fetch(apiUrl);

    // Check if the response is OK, otherwise throw an error
    if (!response.ok) throw new Error("Pokémon not found");

    // Parse the response to JSON
    const pokemon = await response.json();

    // Create a list of abilities
    const abilities = pokemon.abilities
      .map((ability) => ability.ability.name)
      .join(", ");

    // Create a list of stats
    const stats = pokemon.stats
      .map((stat) => `${stat.stat.name}: ${stat.base_stat}`)
      .join(", ");

    // Create a list of moves (limiting to first 5 moves for display)
    const moves = pokemon.moves
      .slice(0, 5)
      .map((move) => move.move.name)
      .join(", ");

    // Display Pokémon details in the DOM
    pokemonInfoDiv.innerHTML = `
      <h2 class="text-capitalize">${pokemon.name} (#${pokemon.id})</h2>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="mb-3">
      <p><strong>Type:</strong> ${pokemon.types.map((type) => type.type.name).join(", ")}</p>
      <p><strong>Height:</strong> ${pokemon.height / 10} meters</p>
      <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
      <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
      <p><strong>Abilities:</strong> ${abilities}</p>
      <p><strong>Stats:</strong> ${stats}</p>
      <p><strong>Moves (First 5):</strong> ${moves}</p>
    `;

    // Display the raw JSON response
    rawJsonDiv.textContent = JSON.stringify(pokemon, null, 2);
  } catch (error) {
    // Display an error message in case of failure
    pokemonInfoDiv.innerHTML = `<p class="error">${error.message}</p>`;
    rawJsonDiv.innerHTML = '<p class="error">No data available.</p>';
  }
}

/**
 * Checks if the "Enter" key is pressed and triggers the fetchPokemon function if true.
 *
 * @function checkEnter
 * @param {KeyboardEvent} event - The keyboard event to check for "Enter" key.
 */
function checkEnter(event) {
  if (event.key === "Enter") {
    fetchPokemon();
  }
}
