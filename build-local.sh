npm run build
npm pack
export VERSION=1.0.0
cp calindra-cartesify-backend-${VERSION}.tgz ../cartesify-nodejs-rest-example/backend

cd ../cartesify-nodejs-rest-example/backend
npm uninstall @calindra/cartesify-backend
npm i ./calindra-cartesify-backend-${VERSION}.tgz
