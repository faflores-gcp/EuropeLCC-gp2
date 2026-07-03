# Travel Europe LLC - Web Infrastructure Deployment

l<img width="769" height="411" alt="google_cloud_run" src="https://github.com/user-attachments/assets/bb30c358-277e-4a76-8211-b9097ce27e33" />

For the cloud run app deployment we started by creaing our artifact registry standard repository using Google CloudUI and naming it "grupo2"
to start pushing images into it we need to authenticate docker with our current gcloud credentials.

gcloud auth configure-docker us-central1-docker.pkg.dev

then, we need to tag our image with googles address so it wont try to push it to docker hub:

docker tag g2webapp:v1 us-central1-docker.pkg.dev/juanalfredol-group1-dev/grupo2/landing-site:v1

then to push the image to registry:

docker push us-central1-docker.pkg.dev/juanalfredol-group1-dev/grupo2/landing-site:v1

Now, time to deploy to a Cloud run app
we can use the following command

```
gcloud run deploy travel-europe-service
--image=us-central1-docker.pkg.dev/juanalfredol-group1-dev/grupo2/landing-site:v1 
--region=us-central1
--port=80
--allow-unauthenticated
--platform=managed
```

Note that in our case the flag --port=80 was necessary to avoid the default
--allow-unauthenticated will make our website public.

We also can configure IAM policies to achieve this. But the former is the go-to standard

Now that your app is fully operational you can get the url by doing
gcloud run services describe travel-europe-service --region=us-central1

if you don't remember a resource name you can get it with 

gcloud run services list --region=us-central1

# Travel Europe LLC - Web Infrastructure Deployment

Este proyecto despliega la infraestructura para el sitio web de [Travel Europe LLC](https://traveleurope.com) utilizando recursos nativos de Google Cloud, siguiendo un enfoque de "green field" y mejores prácticas de despliegue automatizado.

## Arquitectura del Proyecto
Hemos migrado de un despliegue manual a una arquitectura escalable y contenedorizada. Los componentes clave son:

* **Contenedorización:** Imagen del sitio web estático empaquetada con Docker y almacenada en **Artifact Registry**.
* **Orquestación:** Despliegue gestionado mediante **Compute Engine** (con Plantillas de Instancia y Grupos de Instancias Gestionados - MIG).
* **Balanceo de Carga:** Configuración de un **Load Balancer** global para proveer un único endpoint de acceso (IP externa) y alta disponibilidad.
* **Infraestructura como Código:** Despliegue ejecutado a través de Google Cloud SDK (`gcloud`).

## Ciclo de vida (Sprints)
- **Sprint 1:** Containerización local y subida de imagen a Artifact Registry.
- **Sprint 2:** Despliegue de infraestructura en GCP y configuración de balanceador de carga.
- **Sprint 3:** Documentación y entrega del repositorio siguiendo estándares de control de versiones.

## Guía de Despliegue
Para replicar este entorno, se utilizaron los siguientes comandos principales:

1.  **Creación de plantilla:**
    `gcloud compute instance-templates create-with-container ...`
2.  **Gestión de grupo:**
    `gcloud compute instance-groups managed create ...`

## Recursos adicionales
* **Repositorio original:** [PON AQUÍ EL LINK AL REPO ORIGINAL QUE TE DIERON]
* **Integrantes:** [Tu nombre/Equipo]
* **Proyecto:** TELSAL | Google Cloud Tech Pre-Training
