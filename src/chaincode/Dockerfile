from hyperledger/fabric-baseimage
COPY . $GOPATH/src/build-chaincode/
WORKDIR $GOPATH

RUN go install build-chaincode && cp src/build-chaincode/vendor/github.com/hyperledger/fabric/peer/core.yaml $GOPATH/bin && mv $GOPATH/bin/build-chaincode $GOPATH/bin/c1fb8fee0079cdd8f3286c02d468541254ded41f2a2c6997ef9f2657ae048d41
COPY certificate.pem /certs/peer/cert.pem