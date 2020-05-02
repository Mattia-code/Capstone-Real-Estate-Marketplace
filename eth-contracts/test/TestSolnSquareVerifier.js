var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var SquareVerifier = artifacts.require('SquareVerifier');

contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    let proof = require('./proof.json');

    beforeEach(async function () {
        this.verifier = await SquareVerifier.new({ from: account_one });
        this.contract = await SolnSquareVerifier.new(this.verifier.address, { from: account_one });
    })

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('Test if a new solution can be added for contract - SolnSquareVerifier', async function () {
        const { proof: { a, b, c }, inputs: input } = proof;

        let key = await this.contract.generateKey.call(a, b, c, input);
        let result = await this.contract.addSolution(1, account_two, key);

        assert.equal(result.logs[0].event, 'SolutionAdded', "Error: no event emitted.");
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('Test if an ERC721 token can be minted for contract - SolnSquareVerifier', async function () {
        const { proof: { a, b, c }, inputs: input } = proof;

        let totalSupply = (await this.contract.totalSupply.call()).toNumber();
        await this.contract.mintToken(account_two, 5, a, b, c, input, {from: account_one});

        let newTotalSupply = (await this.contract.totalSupply.call()).toNumber();

        assert.equal(totalSupply+1, newTotalSupply, "Error 2: an ERC721 token cannot be minted for contract - SolnSquareVerifier");
    })
})
