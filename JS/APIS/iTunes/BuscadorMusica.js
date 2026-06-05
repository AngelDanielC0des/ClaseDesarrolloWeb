/**
 * @fileoverview Componente modular y encapsulado para interactuar con la API de iTunes.
 * Implementa patrones arquitectónicos avanzados, abortadores de peticiones y optimización SEO/A11Y.
 */

export default class BuscadorMusica {
    #elementosDOM = {};
    #paginaActual = 1;
    #resultadosPorPagina = 9;
    #audioEnReproduccion = null;
    #temporizadorDeBusqueda = null;
    #controladorAbortar = null;

    /**
     * @param {Object} configuracion Configuración inicial del componente.
     * @param {number} [configuracion.resultadosPorPagina=9] Cantidad de elementos por bloque.
     */
    constructor(configuracion = {}) {
        this.#resultadosPorPagina = configuracion.resultadosPorPagina || 9;
        this.#mapearElementosDOM();
        this.#registrarEventos();
    }

    #mapearElementosDOM() {
        this.#elementosDOM = {
            entrada: document.querySelector('.song-catcher__input'),
            btnBuscar: document.querySelector('.song-catcher__button-search'), // Capturado con clase BEM
            resultados: document.querySelector('.song-catcher__results'),
            paginacion: document.querySelector('.song-catcher__pagination'),
            btnAnterior: document.querySelector('.song-catcher__pagination-btn:first-of-type'),
            btnSiguiente: document.querySelector('.song-catcher__pagination-btn:last-of-type'),
            indicador: document.querySelector('.song-catcher__page-indicator')
        };
    }

    #registrarEventos() {
        // Escucha pasiva con Debounce al escribir (3 segundos)
        this.#elementosDOM.entrada.addEventListener('input', () => {
            clearTimeout(this.#temporizadorDeBusqueda);
            this.#temporizadorDeBusqueda = setTimeout(() => {
                this.#reiniciarYBuscar();
            }, 3000);
        });

        // MEJORA: Búsqueda instantánea al presionar el botón físico de Buscar
        this.#elementosDOM.btnBuscar.addEventListener('click', () => {
            this.#reiniciarYBuscar();
        });

        // MEJORA UX: Búsqueda instantánea al presionar "Enter" en el teclado
        this.#elementosDOM.entrada.addEventListener('keydown', (evento) => {
            if (evento.key === 'Enter') {
                this.#reiniciarYBuscar();
            }
        });

        // Paginación
        this.#elementosDOM.btnAnterior.addEventListener('click', () => {
            if (this.#paginaActual > 1) {
                this.#paginaActual--;
                this.ejecutarConsulta();
            }
        });

        this.#elementosDOM.btnSiguiente.addEventListener('click', () => {
            this.#paginaActual++;
            this.ejecutarConsulta();
        });
    }

    #reiniciarYBuscar() {
        clearTimeout(this.#temporizadorDeBusqueda); // Limpia colas de espera
        this.#paginaActual = 1;
        this.ejecutarConsulta();
    }

    ejecutarConsulta() {
        const textoBuscado = this.#elementosDOM.entrada.value.trim();
        
        if (!textoBuscado) {
            this.#elementosDOM.resultados.innerHTML = '';
            this.#elementosDOM.paginacion.style.display = 'none';
            return;
        }

        if (this.#controladorAbortar) {
            this.#controladorAbortar.abort();
        }
        this.#controladorAbortar = new AbortController();

        this.#elementosDOM.resultados.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: white;">Buscando canciones...</p>';

        const saltoDeResultados = (this.#paginaActual - 1) * this.#resultadosPorPagina;
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(textoBuscado)}&entity=song&limit=${this.#resultadosPorPagina}&offset=${saltoDeResultados}`;

        (url, { signal: this.#controladorAbortar.signal })
            .then(respuesta => {
                if (!respuesta.ok) throw new Error('Error de comunicación con el servidor.');
                return respuesta.json();
            })
            .then(datos => {
                this.#renderizarTarjetas(datos.results);
                this.#actualizarNavegacion(datos.results.length);
            })
            .catch(error => {
                if (error.name === 'AbortError') return;
                console.error(error);
                this.#elementosDOM.resultados.innerHTML = '<p style="text-align:center; color: #ff6b6b; grid-column: 1 / -1;">Error al recuperar datos de iTunes.</p>';
                this.#elementosDOM.paginacion.style.display = 'none';
            });
    }

    #actualizarNavegacion(cantidadResultados) {
        if (cantidadResultados === 0 && this.#paginaActual === 1) {
            this.#elementosDOM.paginacion.style.display = 'none';
            return;
        }

        this.#elementosDOM.paginacion.style.display = 'flex';
        this.#elementosDOM.indicador.textContent = `Página ${this.#paginaActual}`;
        
        this.#elementosDOM.btnAnterior.disabled = (this.#paginaActual === 1);
        this.#elementosDOM.btnSiguiente.disabled = (cantidadResultados < this.#resultadosPorPagina);
    }

    #renderizarTarjetas(listaCanciones) {
        this.#elementosDOM.resultados.innerHTML = '';

        if (listaCanciones.length === 0) {
            this.#elementosDOM.resultados.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: white;">No se encontraron resultados.</p>';
            return;
        }

        const fragmento = document.createDocumentFragment();

        listaCanciones.forEach(cancion => {
            const tarjeta = document.createElement('article');
            tarjeta.className = 'song-catcher__card';
            tarjeta.setAttribute('itemscope', '');
            tarjeta.setAttribute('itemtype', 'https://schema.org/MusicRecording');

            tarjeta.innerHTML = `
                <img src="${cancion.artworkUrl100}" alt="Portada de ${cancion.trackName}" class="song-catcher__card-img" itemprop="image">
                <div class="song-catcher__card-info">
                    <h3 class="song-catcher__card-title" itemprop="name">${cancion.trackName}</h3>
                    <p class="song-catcher__card-artist" itemprop="byArtist" itemscope itemtype="https://schema.org/MusicGroup">
                        <span itemprop="name">${cancion.artistName}</span>
                    </p>
                    ${cancion.previewUrl 
                        ? `<audio controls src="${cancion.previewUrl}" class="song-catcher__audio" itemprop="audio" aria-label="Audio de preview de ${cancion.trackName}"></audio>` 
                        : '<p aria-hidden="true"><i>Audio no disponible</i></p>'
                    }
                </div>
            `;

            const reproductor = tarjeta.querySelector('.song-catcher__audio');
            if (reproductor) {
                reproductor.addEventListener('play', (evento) => {
                    if (this.#audioEnReproduccion && this.#audioEnReproduccion !== evento.target) {
                        this.#audioEnReproduccion.pause();
                    }
                    this.#audioEnReproduccion = evento.target;
                });
            }

            fragmento.appendChild(tarjeta);
        });
fetch
        this.#elementosDOM.resultados.appendChild(fragmento);
    }
}