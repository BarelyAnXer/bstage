helm upgrade --install cluster-api-visualizer cluster-api-visualizer \
       --repo https://jont828.github.io/cluster-api-visualizer/charts -n capi-visualizer --create-namespace --set service.type=LoadBalancer
