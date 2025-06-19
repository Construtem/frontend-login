# Frontend - Login

Este repositorio contiene el frontend del login del sistema Construtem.
Al logearse correctamente, el sistema dirigirá al trabajador a su respectivo servicio: 
- inventario.tssw.cl
- ventas.tssw.cl

## 🛠️ Tecnologías
- Next.js
  
## 🚀 Funcionalidades
- Vistas del login

## Requisitos

- Docker Desktop instalado
- Git instalado

## Instalación (entorno de desarrollo)

1. Clonar el repositorio en el directorio deseado:

*Desde la terminal debe situarse en el directorio que desee clonar repo (ej: "C:\Users\Admin\Desktop") y ejecutar siguiente comando*

<details>

<summary>**¿Cómo situarse en C:\Users\Admin\Desktop?**</summary>

1. Abrir terminal (Ya sea powershell, cmd, git bash, etc)
2. Te encontrarás situado en C:\Users\Admin o algo así
3. Debes ejecutar el comando
```bash
cd .\Desktop\
```
*Cualquier consulta escribirme a wsp +56979828311*
</details>

```bash
git clone https://github.com/Construtem/frontend-login
cd frontend-login
```
2. Correr aplicación desde directorio creado (ej "C:\Users\Admin\Desktop\frontend-login"),
ejecutando el siguiente comando:
```bash
docker compose up
```
*Luego de ejecutar este comando, su app se encontrará corriendo en el puerto 3000 en "http://localhost:3000"*

## Contribución

1. Crea una rama para tu funcionalidad/tarea:

```bash
git switch -c feature/<nombre-funcionalidad>
```

2. Realiza cambios y haz commit:

```bash
git add <archivos-cambiados>
git commit -m "<descripcion pequeña del cambio>"
```

3. Pushea tus cambios de la rama:

```bash
git push origin feature/<nombre-funcionalidad> 
```

4. Crea un Pull Request (PR) a la rama ´develop´ desde GitHub para que sea revisado por otro desarrollador
