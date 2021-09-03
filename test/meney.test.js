const money = artifacts.require('Money');
const expect = require('chai').expect;


contract('money', accounts => {
    const address0 = accounts[0];
    const address1 = accounts[1];

    console.log('priemra cuenta: ', address0);
    console.log('segunda cuenta: ', address1);


    let moneyInstance;

    beforeEach(async () => {
        moneyInstance = await money.new({
            from: address0
        });
    });


    context('constructor', async () => {

        it('init supply 1000', async () => {

            const supply = await moneyInstance.supply();
            expect(supply.toNumber()).to.equal(1000);

        });


        it('init balance accoount0 should 100', async () => {
            const balances = await moneyInstance.balances(address0);
            expect(balances.toNumber()).to.equal(1000);
        });
    });


    context('Execution', async () => {

        it('Unable to make transfer without sufficient balance', async () => {
            try {
                // hacer una transaccion que deberia fallar y saltar el catch
                const result = await moneyInstance.transfer(1001, address1, {
                    from: address0
                });

                // si la anterior linea no salta el error, se da por fallido el test
                expect(result.receiot.status).to.equal(false);
            } catch (error) {
                expect(error.reason).to.equal('Insufficient balance');
            }
        });


        it('Enable to make tranfer with sufficient balance', async () => {

            await moneyInstance.transfer(100, address1, {
                from: address0
            });

            const balance0 = await moneyInstance.balances(address0);
            const balance1 = await moneyInstance.balances(address1);

            expect(balance0.toNumber()).to.equal(900);
            expect(balance1.toNumber()).to.equal(100);

        });


        it ('Enable to add supply eith time' ,async()=>{
            await time.increase();
            await moneyInstance.addSupply({from:address1});
            const balance0 = await moneyInstance.balances(address1);
            const supply = await moneyInstance.supply();
            expect(balance0.toNumber()).to.equal(1000);
            expect(supply.toNumber()).to.equal(2000);
        });

    });

});