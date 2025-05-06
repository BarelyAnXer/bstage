# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

To start the app, run:

```sh
yarn install
yarn start
```


```bash
yarn install --immutable
yarn tsc
yarn build:backend

docker image build . -f packages/backend/Dockerfile --tag backstage
docker run -it -p 7007:7007 backstage
```