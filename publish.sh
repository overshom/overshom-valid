set -e

yarn audit

yarn build

node dist

yarn test

npm publish