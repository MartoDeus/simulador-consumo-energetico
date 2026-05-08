# Simulador de consumo energetico

## Estado actual
- Proyecto web estatico clonado desde GitHub y trabajado localmente.
- Carpeta local actual: `C:\Users\User\Documents\Codex\2026-05-07\puedes-abrir-mi-navegador-de-chrome\simulador-consumo-energetico`.
- Archivos principales:
  - `index.html`
  - `style.css`
  - `script.js`
  - `assets/solar-house.png`
  - `assets/dia.png`
  - `assets/noche.png`
  - `assets/televisor.png`
  - `assets/computadora.png`
  - `assets/refrigeradora.png`
  - `assets/plancha.png`
  - `assets/foco.png`
  - `assets/bateria.png`
  - `assets/logo.png`
  - `assets/sol.png`
  - `assets/luna.png`
  - `assets/utp.webp`

## Objetivo
Construir un simulador web de energia solar para una casa que permita:
- calcular consumo de electrodomesticos,
- estimar generacion de paneles solares,
- estimar almacenamiento en baterias,
- comparar comportamiento de dia y de noche,
- mostrar resumenes, alertas, recomendaciones y consejos.

## Lo que ya esta hecho
- Layout tipo dashboard pensado para verse completo en una sola pantalla de escritorio.
- Selector `Dia / Noche` que cambia solo la escena central de la casa, no toda la interfaz.
- Panel izquierdo de electrodomesticos con filas compactas, iconos visuales, nombres cortos, watts editables, estado activo y boton de eliminar.
- Los iconos de TV, computadora, refrigeradora, plancha, focos y baterias usan imagenes desde `assets`.
- Las filas de electrodomesticos se compactaron: se elimino el agarre de puntos, el valor de watts queda junto a la unidad `W`, y los botones de activo/eliminar van en la misma linea con el mismo tamano.
- Se agrego el item `Focos` con 10 unidades de 10 W cada una como valor tipico de foco LED.
- Formulario de electrodomesticos mas claro con campos:
  - Equipo
  - Potencia (W)
  - Cantidad
  - Horas de uso
- Panel de baterias con filas individuales.
- Cada bateria tiene capacidad independiente: cambiar una bateria ya no cambia las demas.
- Iconos de baterias mejorados.
- Panel central con imagen de casa solar y modulo compacto de paneles solares.
- La imagen central cambia entre `assets/dia.png` y `assets/noche.png` segun el selector `Dia / Noche` y se integra como imagen full-bleed dentro del escenario central.
- El logo superior usa `assets/utp.webp`.
- El logo superior se amplio para verse con mas claridad.
- Al cambiar entre `Dia` y `Noche`, aparece una animacion de entrada/salida con `assets/sol.png` o `assets/luna.png` sobre la escena central.
- La posicion del sol y la luna se subio para no chocar visualmente con el techo de la casa.
- En modo `Noche`, el fondo general de la pagina cambia a un azul claro suave, manteniendo la interfaz clara.
- Modulo de paneles solares simplificado: muestra titulo, cantidad con botones `+` y `-`, y energia generada.
- Se eliminaron elementos visuales innecesarios del centro, como nodos grandes, burbujas y badges que ensuciaban la escena.
- Se ocultaron las lineas de flujo antiguas sobre la imagen central porque ya no encajan con las nuevas imagenes de dia/noche.
- Panel derecho con resumen en tiempo real y dimensionamiento sugerido.
- Se elimino el modulo `Flujo de energia` porque no aportaba al uso actual.
- Franja inferior `Dia / Noche` corregida para que no corte texto ni muestre decoracion innecesaria.
- Controles inferiores de horas explican mejor su funcion: recalcular consumo, generacion y respaldo.
- Scroll interno mas suave y rapido en paneles con listas largas.
- Optimizaciones visuales para mejorar rendimiento:
  - menos sombra pesada,
  - blur reducido,
  - menos transiciones globales,
  - cambio de dia/noche limitado a la escena central.

## Calculos principales
- Consumo por periodo segun watts, cantidad y horas de cada electrodomestico activo.
- Generacion solar diaria segun cantidad de paneles, potencia por panel, horas de dia y perdidas internas del sistema.
- Capacidad total de baterias como suma de capacidades individuales.
- Energia almacenada disponible para la noche.
- Energia desperdiciada por excedente no almacenado.
- Deficit nocturno sin baterias.
- Recomendacion de paneles y baterias.
- Cobertura nocturna estimada.

## Decisiones de diseno actuales
- La pagina debe sentirse como una herramienta de simulacion, no como una landing page.
- La informacion principal debe quedar visible sin que el usuario tenga que bajar toda la pagina.
- Si hay demasiados elementos, el scroll debe ocurrir dentro del panel correspondiente.
- El modo `Dia / Noche` debe cambiar solo la escena central para no distraer ni hacer lenta la interfaz.
- Los modulos deben ser compactos, legibles y con controles claros.

## Proximo enfoque recomendado
- Revisar visualmente la proporcion exacta entre columnas izquierda, centro y derecha en pantallas de 13 y 27 pulgadas.
- Pulir mas el panel derecho si queda demasiado cargado.
- Mejorar mensajes de recomendaciones para que sean mas utiles y menos repetitivos.
- Probar casos extremos:
  - muchas baterias,
  - muchos electrodomesticos,
  - cero paneles,
  - cero baterias,
  - modo noche con alta demanda.

## Nota para retomar en otro chat
Si se continua en otro chat, indicar:
- la carpeta del proyecto,
- que existe este `README.md`,
- que se debe revisar primero el estado actual antes de seguir,
- y que los archivos activos son `index.html`, `style.css` y `script.js`.
