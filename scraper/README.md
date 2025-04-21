# MINI PC's SCRAPER

Proyecto para extraer la información de `Mini Pc's` de diferentes páginas web y guardarla para nuestra web.

### Arquitectura

Script de NodeJS que recorre una lista de `URLs`. Visita cada una y le **dá el contenido a DeepSeek** para que extraiga la información, por último la **guardamos en BBDD**.

> Usamos _Webbutler_ y _WebSeek_

#### TODOS

[ ] Al cargar cada URL tratar de aceptar las coockies clicando en elemento "Aceptar todas", "Permitir todas" ...
[ ] Actualizar las URLs para poner buenas páginas de producto válidas y mas cantidad
[ ] Guardar data en BBDD
