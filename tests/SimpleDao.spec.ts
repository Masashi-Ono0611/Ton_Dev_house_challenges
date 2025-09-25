import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { SimpleDao } from '../wrappers/SimpleDao';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('SimpleDao', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('SimpleDao');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let simpleDao: SandboxContract<SimpleDao>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        // Create admin (deployer) first to pass its address in config
        deployer = await blockchain.treasury('deployer');

        simpleDao = blockchain.openContract(SimpleDao.createFromConfig({
            queryId: 0,
            admin: deployer.address,
        }, code));

        const deployResult = await simpleDao.sendDeploy(deployer.getSender(), toNano('0.1'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: simpleDao.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
    });
    it('should vote YES', async () => {
        const voteResult = await simpleDao.sendVote(deployer.getSender(), toNano('0.05'), 1, true);
        
        expect(voteResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: simpleDao.address,
            success: true,
        });
        const [yesVotes, noVotes, totalVotes] = await simpleDao.getVotes();
        expect(yesVotes).toBe(1);
        expect(noVotes).toBe(0);
        expect(totalVotes).toBe(1);
    });
    it('should vote NO', async () => {
        const voteResult = await simpleDao.sendVote(deployer.getSender(), toNano('0.05'), 2, false);
        
        expect(voteResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: simpleDao.address,
            success: true,
        });
        const [yesVotes, noVotes, totalVotes] = await simpleDao.getVotes();
        expect(yesVotes).toBe(0);
        expect(noVotes).toBe(1);
        expect(totalVotes).toBe(1);
    });
    it('should reset votes', async () => {
        await simpleDao.sendVote(deployer.getSender(), toNano('0.05'), 3, true);
        let[yesVotes, noVotes, totalVotes] = await simpleDao.getVotes();
        expect(yesVotes).toBe(1);
        expect(noVotes).toBe(0);
        expect(totalVotes).toBe(1);

        const resetResult = await simpleDao.sendResetVotes(deployer.getSender(), toNano('0.05'), 4);
        expect(resetResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: simpleDao.address,
            success: true,
        });

        [yesVotes, noVotes, totalVotes] = await simpleDao.getVotes();
        expect(yesVotes).toBe(0);
        expect(noVotes).toBe(0);
        expect(totalVotes).toBe(0);
    });
});
