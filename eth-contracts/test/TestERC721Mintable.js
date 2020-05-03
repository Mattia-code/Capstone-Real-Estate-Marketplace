var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one,1,{from: account_one});
            await this.contract.mint(account_two,2,{from: account_one});
            await this.contract.mint(account_three,3,{from: account_one});
            await this.contract.mint(account_four,4,{from: account_one});
        })

        it('should return total supply', async function () {
            let supply = await this.contract.totalSupply.call();
            assert.equal(supply,4,"should return total supply.");
        })

        it('should get token balance', async function () {
            let balance = await this.contract.balanceOf.call(account_one);
            assert.equal(balance.toNumber(),1,"should get token balance.");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let tokenURI = await this.contract.tokenURI.call(1);
            assert.equal(tokenURI,"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
                "should return token uri");
        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.transferFrom(account_one,account_three,1);
            let owner = await this.contract.ownerOf.call(1);
            assert.equal(owner,account_three,"should transfer token from one owner to another.");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            let exception = false;
            try{
                await this.contract.mint(account_three,5,{from: account_two});
            }catch(e){
                exception = true;
            }
            assert.equal(exception,true,"should fail when minting when address is not contract owner.");
        })

        it('should return contract owner', async function () {
            let contract_owner = await this.contract.getOwner.call({from:account_one});
            assert.equal(contract_owner,account_one,"should return contract owner.")
        })

    });
})