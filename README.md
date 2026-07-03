# Travel Europe LLC - Web Infrastructure Deployment

<img width="569" height="311" alt="google_cloud_run" src="https://github.com/user-attachments/assets/bb30c358-277e-4a76-8211-b9097ce27e33" />

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

Note that in our case the flag ```--port=80``` was necessary to avoid the default
``` --allow-unauthenticated will make our website public. ```

We also can configure IAM policies to achieve this. But the former is the go-to standard

Now that your app is fully operational you can get the url by doing

```gcloud run services describe travel-europe-service --region=us-central1```

if you don't remember a resource name you can get it with 

```
gcloud run services list --region=us-central1
```

# GCE(Compute Engine)

<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/29bb0f3d-0062-43e7-95db-005cdb70a563" />

For the Compute Engine (GCE) deployment, we implemented a scalable architecture using Managed Instance Groups (MIG) to ensure high availability and automated container lifecycle management.

## Defining the Instance Template
We created a base configuration that automates the downloading and execution of the container from Artifact Registry upon instance startup, ensuring deployment consistency

```
gcloud compute instance-templates create-with-container vm-templates \
  --machine-type=e2-small \
  --tags=network-lb-tag \
  --scopes=cloud-platform \
  --container-image=us-central1-docker.pkg.dev/juanalfredol-group1-dev/grupo2/landing-site:latest
```

## Managed Instance Group (MIG)
To ensure scalability and high availability, we deployed a Managed Instance Group (MIG) using the previously configured template. This group ensures that, in the event of any failure, instances are automatically repaired while maintaining the desired number of replicas.

```
gcloud compute instance-groups managed create container-group \
   --base-instance-name=container-vm \
   --size=3 \
   --template=vm-templates \
   --region=us-central1
```

# Network and Load Balancing Configuration

### Step 1
Create the healthcheck

```gcloud compute health-checks create http http-basic-check --port=80```

This command creates a healthcheck named http-basic-check on port 80
The load balancer needs a healthcheck, otherwise it has no way of knowing which VM is healthy. 

### Step 2: Create a Backend Service

> A backend service defines how Cloud Load Balancing distributes traffic. The backend service configuration contains a set of values, such as the protocol used to connect to backends, various distribution and session settings, health checks, and timeouts. 
> — *Google Backend Services Overview*

```bash
gcloud compute backend-services create web-backend-service \
    --protocol=HTTP \
    --health-checks=http-basic-check \
    --global
```
## Step 3 Adding the backend
```
gcloud compute backend-services add-backend web-backend-service \
    --instance-group=container-group \
    --instance-group-region=us-central1 \
    --global
```
``` gcloud compute backend-services add-backend web-backend-service ```
 This command modifies the existing web-backend-service.

then we point it to the MIG name and region
```
--instance-group=container-group \
    --instance-group-region=us-central1 \
```

The --global flag its because the backend is a global service

## Step 4
Create the URL Map

```
gcloud compute url-maps create web-map \
  --default-service=web-backend-service
```

A URL map is a set of rules for routing incoming HTTP(S) requests to specific backend services or backend buckets. A minimal URL map matches all incoming request paths (/*). Like in our case 
```--default-service=web-backend-service``` routes all incoming traffic that matches our URL to the single backend service we have.

## Step 5

Create the target http Proxy

```
gcloud compute target-http-proxies create http-lb-proxy \
  --url-map=web-map
  ```

The target proxy is the component receiving requests from the user.
the ```--url-map=web-map``` tells it to use the rules defined in the url map

## Step 6 Forwarding rule

```
gcloud compute forwarding-rules create http-content-rule \
  --global \
  --target-http-proxy=http-lb-proxy \
  --ports=80
  ``` 

This ties a public IP to our proxy 
Flags
  ```--global```  needed to use it on a global http load balancer
  ```--target-http-proxy=http-lb-proxy```  points to our proxy
  ```--ports=80 `specifies port```

## Step 7 Firewall rules

Now for "hiding the vms" we need an specific rule that allow traffic from google load balancers and health checkers only

```
gcloud compute firewall-rules create allow-lb-and-health-checks \
  --network=default \
  --action=allow \
  --direction=INGRESS \
  --rules=tcp:80 \
  --source-ranges=35.191.0.0/16,130.211.0.0/22 \
  --target-tags=network-lb-tag
  ```
