npm run build
npm pack
cp calindra-cartesify-backend-0.1.0.tgz ../cartesify-nodejs-rest-example/backend

cd ../cartesify-nodejs-rest-example/backend
npm uninstall @calindra/cartesify-backend
npm i ./calindra-cartesify-backend-0.1.0.tgz
