const pokeContent = document.getElementById('pokemonContent');
let generationshow = 1
const modalSearch = document.getElementById('pokemonContent')
const divGeneration = document.getElementById('textGen')
const pokeCard = document.querySelector('[data-poke-card]');
const pokeName = document.querySelector('[data-poke-name]');
const pokeImg = document.querySelector('[data-poke-img]');
const pokeImgContainer = document.querySelector('[data-poke-img-container]');
const pokeId = document.querySelector('[data-poke-id]');
const pokeTypes = document.querySelector('[data-poke-types]');
const pokeStats = document.querySelector('[data-poke-stats]');

const typeColors = {
    ice: '#AFEAFD',   
    ghost: '#561D25',
    steel: '#1D8A99', 
    default: '#2A1A1F', 
    fire: '#FFA05D',
	grass: '#8FD594',
	electric: '#FFE43B',
	water: '#7E97C0',
	ground: '#CAAC4D',
	rock: '#90642D',
	poison: '#9D5B9B',
	bug: '#CBC117',
	dragon: '#97b3e6',
	psychic: '#FF96B5',
	flying: '#BDB7B7',
	fighting: '#FF5D5D',
	normal: '#FFFFFF'
};


const searchPokemon = event => {
    event.preventDefault();
    const { value } = event.target.pokemon;
    fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
        .then(data => data.json())
        .then(response => renderPokemonData(response))
        .catch(err => renderNotFound())
}

const renderPokemonData = data => {
    const sprite =  data.sprites.front_default;
    const { stats, types } = data;

    pokeName.textContent = data.name;
    pokeImg.setAttribute('src', sprite);
    pokeId.textContent = `Nº ${data.id}`;
    setCardColor(types);
    renderPokemonTypes(types);
    renderPokemonStats(stats);
}


const setCardColor = types => {
    const colorOne = typeColors[types[0].type.name];
    const colorTwo = types[1] ? typeColors[types[1].type.name] : typeColors.default;
    pokeImg.style.background =  `radial-gradient(${colorTwo} 0%, ${colorOne} 0%)`;
    pokeImg.style.backgroundSize = ' 5px 5px';
}

const renderPokemonTypes = types => {
    pokeTypes.innerHTML = '';
    types.forEach(type => {
        const typeTextElement = document.createElement("div");
        typeTextElement.style.color = typeColors[type.type.name];
        typeTextElement.textContent = type.type.name;
        pokeTypes.appendChild(typeTextElement);
    });
}

const renderPokemonStats = stats => {
    pokeStats.innerHTML = '';
    stats.forEach(stat => {
        const statElement = document.createElement("div");
        const statElementName = document.createElement("div");
        const statElementAmount = document.createElement("div");
        statElementName.textContent = stat.stat.name;
        statElementAmount.textContent = stat.base_stat;
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementAmount);
        pokeStats.appendChild(statElement);
    });
}

const renderNotFound = () => {
    pokeName.textContent = '!Pokemon no encontrado¡';
    pokeImg.setAttribute('src','img/poke-shadow.png');
    pokeImg.style.background =  '#fff';
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    pokeId.textContent = '';
}


/*ordenar xr generacion*/
/*Primera Geneneracion 1-151*/
/*Segunda Geneneracion 152-251*/
/*tercera Geneneracion 252-386*/


/*Funcion para separar por generacion*/
function showPokemonGen(gen){
    const pokemonGen = {
        1:[1, 151],
        2:[152,251],
        3:[252, 386],
        4:[387, 493],
    };

    const pokemonGenDefault = [1, 151];
    const generacion = pokemonGen[gen] || pokemonGenDefault;
    return generacion;
}

let pokemonGeneration = showPokemonGen(generationshow)


/*cambiar de generacion*/

let arrowRight = document.getElementById('arrow-right').addEventListener('click', e=>{
   
    if (generationshow < 4){
        modalSearch.innerHTML = '';
       generationshow += 1
       pokemonGeneration = showPokemonGen(generationshow)
       divGeneration.innerHTML = 'Generacion # ' + generationshow
       drawPokemon()
   }
})

let arrowleft = document.getElementById('arrow-left').addEventListener('click', e=>{
    
    if (generationshow > 1){
       modalSearch.innerHTML = '';
       generationshow -= 1
       pokemonGeneration = showPokemonGen(generationshow)
       divGeneration.innerHTML = 'Generacion # ' + generationshow
       drawPokemon()
       console.log(generationshow)
   }
})

const drawPokemon = async () =>{
    for (let i = pokemonGeneration[0]; i <= pokemonGeneration[1]; i++) {
		await getPokemon(i);
	}
}

/*sincronizacion de la api de pokemon*/

const getPokemon = async (id, modal) =>{
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const rest = await fetch(url);
    const pokemon = await rest.json();
    createPokemon(pokemon, modal);   
}

/*pintar cartas de los pokemon*/
const colors = {
    fire: '#FFA05D',
	grass: '#8FD594',
	electric: '#FFE43B',
	water: '#7E97C0',
	ground: '#CAAC4D',
	rock: '#90642D',
	poison: '#9D5B9B',
	bug: '#EAFD71',
	dragon: '#97b3e6',
	psychic: '#FF96B5',
	flying: '#CDCDCD',
	fighting: '#FF5D5D',
	normal: '#FFFFFF'
}

const main_types = Object.keys(colors)

function  createPokemon(pokemon){
    const pokemonEl = document.createElement('div');    
	pokemonEl.classList.add('pokemon'); 
	const poke_types = pokemon.types.map(type => type.type.name);
	const type = main_types.find(type => poke_types.indexOf(type) > -1); 	
	const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    
	const color = colors[type];
	
	pokemonEl.style.backgroundColor = color;	
        const pokeInnerHTML = `
        <div class="img-container">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${name}" />
        </div>
        <div class="info">
            <span class="number">#${pokemon.id.toString().padStart(3, '0')}</span>
            <h3 class="name">${name}</h3>
            <small class="type">Tipo: <span>${type}</span></small> <br>       
        </div>`; 

        pokemonEl.innerHTML = pokeInnerHTML;
        pokeContent.appendChild(pokemonEl);  
        
}
drawPokemon()

pokeForm.addEventListener('submit', e =>{
    e.preventDefault();
    let searchPokemon = document.getElementById('pokemon').value;
    getPokemon(searchPokemon, true);
})


