# Metodologia del proyecto

## Software utilizado

Para el desarrollo del prototipo del simulador de consumo energetico se utilizo un entorno de desarrollo web basado en HTML, CSS y JavaScript. La estructura principal de la interfaz fue elaborada en `index.html`, los estilos visuales y la distribucion de los paneles se trabajaron en `style.css`, y la logica de calculo e interaccion del simulador se implemento en `script.js`.

Como herramientas de apoyo se empleo Visual Studio Code para la edicion del codigo, Google Chrome para la ejecucion y prueba del prototipo, Git para el control de versiones y GitHub para el almacenamiento del proyecto. El prototipo funciona como una aplicacion web estatica, por lo que puede ejecutarse directamente desde el navegador sin necesidad de instalar dependencias adicionales.

## Planos tecnicos del prototipo

El prototipo desarrollado corresponde a un simulador web de consumo energetico para una vivienda con sistema de energia solar. Por ello, los planos tecnicos se representan mediante la organizacion visual de la interfaz y el esquema funcional del sistema.

El diseno se divide en tres zonas principales:

1. Panel izquierdo: contiene la lista de electrodomesticos, su potencia, cantidad, horas de uso y estado activo o inactivo.
2. Panel central: muestra la vivienda, el cambio entre dia y noche, los paneles solares y la representacion visual del sistema.
3. Panel derecho: presenta los resultados del calculo, como consumo estimado, energia generada, almacenamiento en baterias, deficit, excedente y recomendaciones.

De acuerdo con normas basicas de dibujo tecnico, el esquema del prototipo se organiza con vistas claras, distribucion proporcional y rotulacion de cada modulo. Los elementos principales se identifican mediante etiquetas, iconos y valores numericos para facilitar la lectura del funcionamiento del sistema.

## Secuencia del metodo desarrollado

El metodo seguido para construir el simulador fue el siguiente:

1. Se definio el problema a resolver: estimar el consumo electrico de una vivienda y compararlo con la energia generada por paneles solares.
2. Se identificaron los elementos principales del sistema: electrodomesticos, paneles solares, baterias, periodo de uso diurno y nocturno.
3. Se establecieron las variables de calculo: potencia en watts, cantidad de equipos, horas de uso, numero de paneles, capacidad de baterias y perdidas del sistema.
4. Se diseno la interfaz del simulador con una distribucion tipo dashboard para que el usuario pueda observar entradas, escena y resultados al mismo tiempo.
5. Se implemento la estructura del prototipo en HTML, separando las secciones de electrodomesticos, vivienda, paneles solares, baterias y resumen de resultados.
6. Se aplicaron estilos CSS para mejorar la visualizacion, ordenar los modulos, integrar imagenes y adaptar el diseno a una pantalla de escritorio.
7. Se programo la logica en JavaScript para calcular el consumo energetico, la generacion solar, el almacenamiento disponible y las recomendaciones.
8. Se agrego el cambio entre modo dia y modo noche para representar la diferencia entre generacion solar y consumo nocturno.
9. Se realizaron pruebas modificando electrodomesticos, horas de uso, cantidad de paneles y baterias para verificar que los resultados cambiaran correctamente.
10. Se publico el prototipo mediante GitHub Pages para permitir su visualizacion desde un enlace web.

## Materiales, instrumentos y presupuesto

| N. | Material o instrumento | Descripcion | Cantidad | Costo estimado |
| --- | --- | --- | ---: | ---: |
| 1 | Computadora o laptop | Equipo usado para programar, probar y visualizar el simulador | 1 | S/ 0.00 |
| 2 | Visual Studio Code | Editor de codigo utilizado para desarrollar los archivos del proyecto | 1 | S/ 0.00 |
| 3 | Google Chrome | Navegador usado para ejecutar y probar el simulador | 1 | S/ 0.00 |
| 4 | Git | Herramienta para control de versiones del proyecto | 1 | S/ 0.00 |
| 5 | GitHub | Plataforma para alojar el repositorio y publicar el prototipo | 1 | S/ 0.00 |
| 6 | HTML | Lenguaje usado para crear la estructura de la interfaz | 1 | S/ 0.00 |
| 7 | CSS | Lenguaje usado para el diseno visual del simulador | 1 | S/ 0.00 |
| 8 | JavaScript | Lenguaje usado para los calculos e interacciones del simulador | 1 | S/ 0.00 |
| 9 | Imagenes e iconos | Recursos visuales de electrodomesticos, bateria, vivienda, sol, luna y logotipo | Varios | S/ 0.00 |
| 10 | Internet | Recurso necesario para subir y consultar el proyecto en GitHub | 1 | S/ 0.00 |
|  | **Total estimado** |  |  | **S/ 0.00** |

El presupuesto se considera de costo cero porque el prototipo fue desarrollado como software web utilizando herramientas gratuitas y recursos digitales disponibles en el proyecto. En caso de considerar el costo del equipo de computo o del servicio de internet, estos pueden agregarse como costos indirectos.

## Procedimiento de construccion del prototipo

Primero se creo la estructura base del proyecto web con los archivos `index.html`, `style.css` y `script.js`. En el archivo HTML se organizaron las secciones principales del simulador: lista de electrodomesticos, escenario de la vivienda, paneles solares, baterias y resumen de resultados. Esta estructura permitio separar claramente las entradas del usuario y las salidas del sistema.

Luego se diseno la parte visual mediante CSS. Se definio una interfaz tipo dashboard con tres columnas principales para que el usuario pudiera observar los electrodomesticos, la vivienda y los resultados en una sola pantalla. Tambien se incorporaron imagenes para representar la casa, los electrodomesticos, el sol, la luna, las baterias y los estados de dia y noche.

Despues se implemento la logica del simulador en JavaScript. Para calcular el consumo, el sistema multiplica la potencia de cada electrodomestico por la cantidad de unidades y por las horas de uso. Para estimar la generacion solar, se toma en cuenta la cantidad de paneles solares, su potencia aproximada, las horas de luz y las perdidas del sistema. Con estos datos, el simulador calcula la energia generada, la energia consumida, el almacenamiento disponible en baterias, el posible excedente y el deficit energetico.

Posteriormente se agregaron controles interactivos para modificar la cantidad de paneles, activar o desactivar electrodomesticos, cambiar sus valores de potencia, ajustar las horas de uso y alternar entre modo dia y modo noche. Estos controles permiten que el usuario observe en tiempo real como cambian los resultados del sistema.

Finalmente se realizaron pruebas de funcionamiento en el navegador. Se verifico que los calculos respondieran correctamente ante diferentes escenarios, como mayor numero de electrodomesticos, reduccion de paneles solares, aumento de baterias o cambio al modo noche. Una vez revisado el funcionamiento, el proyecto fue subido a GitHub y publicado mediante GitHub Pages para que pueda consultarse desde un enlace web.

## Enlace del prototipo

El prototipo funcional puede visualizarse en el siguiente enlace:

https://martodeus.github.io/simulador-consumo-energetico/
