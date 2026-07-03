# Travel Europe LLC - Web Infrastructure Deployment

<img width="769" height="411" alt="google_cloud_run" src="https://github.com/user-attachments/assets/bb30c358-277e-4a76-8211-b9097ce27e33" />

For the cloud run app deployment we started by creaing our artifact registry standard repository using Google CloudUI and naming it "grupo2"
to start pushing images into it we need to authenticate docker with our current gcloud credentials.

gcloud auth configure-docker us-central1-docker.pkg.dev

then, we need to tag our image with googles address so it wont try to push it to docker hub:

```
docker tag g2webapp:v1 us-central1-docker.pkg.dev/juanalfredol-group1-dev/grupo2/landing-site:v1
```

then to push the image to registry:

```
docker push us-central1-docker.pkg.dev/juanalfredol-group1-dev/grupo2/landing-site:v1
```

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

```
gcloud run services list --region=us-central1
```

# GCE(Compute Engine)

<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/29bb0f3d-0062-43e7-95db-005cdb70a563" />

For the Compute Engine (GCE) deployment, we implemented a scalable architecture using Managed Instance Groups (MIG) to ensure high availability and automated container lifecycle management.

## A. Defining the Instance Template
We created a base configuration that automates the downloading and execution of the container from Artifact Registry upon instance startup, ensuring deployment consistency

```
gcloud compute instance-templates create-with-container vm-templates \
  --machine-type=e2-small \
  --tags=network-lb-tag \
  --scopes=cloud-platform \
  --container-image=us-central1-docker.pkg.dev/juanalfredol-group1-dev/grupo2/landing-site:latest
```


