async function increase() {
    const onWeek = (60  * 60 * 24 * 7) + 1 // seconds  * minutes * hours * days 

    //viajar en el tiempo
    await  web3.currentProvider.send({
        jsonrpc : "2.0",
        method: "evm_increaseTime",
        params: [onWeek],
        id: new Date().getTime()
    }, () => {});


    //crear nuevos bloques
    await  web3.currentProvider.send({
        jsonrpc : "2.0",
        method: "evm_mine", //minar
        params: [],
        id: new Date().getTime()
    }, () => {});
}

module.exports = {
    increase
}