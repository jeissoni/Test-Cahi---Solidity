const money = artifacts.require('Money');
const expect = require('chai').expect;
const time = require('./utils/time');


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


        it('owner is addres0', async()=>{
            const owner = await moneyInstance.owner();
            expect(owner).to.equal(address0);
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
                expect(result.receipt.status).to.equal(false);
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


        it ('Enable to add supply with time' , async()=>{
            await time.increase();
            await moneyInstance.addSupply({from:address1});
            const balance0 = await moneyInstance.balances(address1);
            const supply = await moneyInstance.supply();
            expect(balance0.toNumber()).to.equal(1000);
            expect(supply.toNumber()).to.equal(2000);
        });

        it ('Unable to add supply out of time' , async()=>{           
            try {
                const result = await moneyInstance.addSupply({from:address1});
                expect(result.receipt.status).to.equal(false);
            } catch (error) {
                expect(error.reason).to.equal('Error time');
            }
        });


        it ('Add function with permission', async() => {
            const result = await moneyInstance.add(10,20, {from: address0})
            expect(result.toNumber()).to.equal(30);
        });

        
        it('Add function from NOT permission', async () => {            
           
            let err = null;
            try {

                const result = await moneyInstance.add(10,20,{from:address1});
                expect(result.receipt.status).to.equal(false);

            } catch (error) {
                err = error;                
            }

            assert.ok(err instanceof Error);
                      
        });
        


    });

});