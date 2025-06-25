helm install ingress-nginx oci://ghcr.io/k0rdent/catalog/charts/ingress-nginx-service-template \
      --version 4.11.5 -n kcm-system
helm install argo-cd oci://ghcr.io/k0rdent/catalog/charts/argo-cd-service-template \
      --version 7.8.0 -n kcm-system
