async function increase() {
    const onWeek = 60  * 60 * 24 * 7 // seconds  * minutes * hours * days 

    await  web3.currentProvider.send({

        jsonrpc : "2.0",
        method: "evm_increaseTime",
        params: [onWeek],
        id: new Date().getTime()
    }, () => {});
}

module.exports = {
    increase
}