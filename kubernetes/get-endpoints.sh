echo "backstage"
kubectl get svc -n backstage-k0rdent backstage-k0rdent -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
echo "\ncapi-visualizer"
kubectl get svc -n capi-visualizer capi-visualizer -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
