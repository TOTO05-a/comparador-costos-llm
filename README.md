# Comparador de costos de LLM

Calculadora web que compara cuánto costaría una misma cantidad de tokens de entrada y salida en los principales modelos de IA.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Funcionalidades

- Tarjetas por modelo con costo de entrada, costo de salida y total, calculados sobre precios por millón de tokens.
- 14 modelos de 4 proveedores: OpenAI (GPT-4o, GPT-4.1 y variantes), Anthropic (Claude Opus, Sonnet y Haiku), Google (Gemini 2.5 Pro, Flash y Flash-Lite) y DeepSeek (R1, V3.2, V4 Flash).
- Filtro por proveedor y orden por precio (ascendente o descendente) o por nombre.
- Marca el modelo más económico y resume el total de tokens, el costo mínimo y el máximo.
- Precios de referencia fijados en el código (abril de 2026); verifícalos en la página oficial de cada proveedor antes de decidir.

## Estructura

```
index.html    Interfaz principal del comparador
script.js     Datos de modelos y precios, cálculo, filtros y orden
styles.css    Estilos
Gemini.html   Versión mínima de un solo archivo (selector de modelo + tokens)
```

## Stack

HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Ejecución

No requiere instalación. Clona el repositorio y abre `index.html` en el navegador, o sirve la carpeta:

```bash
git clone https://github.com/TOTO05-a/comparador-costos-llm.git
cd comparador-costos-llm
python -m http.server 8000   # luego abre http://localhost:8000
```

Los precios se editan en el arreglo `MODELS` de `script.js` (`inputPrice` y `outputPrice`, en USD por millón de tokens).

## Variables de entorno

Ninguna: es una aplicación estática y no llama a ninguna API.

## Estado y mejoras previstas

- El conteo de tokens es manual: el campo de texto aún no usa un tokenizador real.
- `script.js` está en revisión: hay una declaración duplicada en `buildCards` que debe corregirse para que `index.html` funcione completo; mientras tanto `Gemini.html` es autónoma.
- Pruebas automatizadas: no hay.

## Autor

**Antonio Cruz** · [github.com/TOTO05-a](https://github.com/TOTO05-a)
