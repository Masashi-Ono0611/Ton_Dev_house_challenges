import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { EscrowSystem } from '../wrappers/EscrowSystem';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('EscrowSystem', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('EscrowSystem');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let escrowSystem: SandboxContract<EscrowSystem>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        escrowSystem = blockchain.openContract(EscrowSystem.createFromConfig({
            queryId:0,
            owner:deployer.address
        }, code));

        const deployResult = await escrowSystem.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: escrowSystem.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and escrowSystem are ready to use
    });
    it('should initialize escrow', async () => {
        const recipient = await blockchain.treasury('recipient');
        const initResult = await escrowSystem.sendInitializeEscrow(deployer.getSender(), toNano('0.05'), recipient.address, toNano('0.02'));
        
        expect(initResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: escrowSystem.address,
            success: true,
        });
    });
    it('should request funds', async () => {
        const recipient = await blockchain.treasury('recipient');
        await escrowSystem.sendInitializeEscrow(deployer.getSender(), toNano('0.05'), recipient.address, toNano('0.02'));

        const requestResult = await escrowSystem.sendRequestFunds(recipient.getSender(), toNano('0.01'));
        
        expect(requestResult.transactions).toHaveTransaction({
            from: recipient.address,
            to: escrowSystem.address,
            success: true,
        });
    });
    it('should release funds',async ()=>{
        const recipient = await blockchain.treasury('recipient');
        await escrowSystem.sendInitializeEscrow(deployer.getSender(), toNano('0.05'), recipient.address, toNano('0.02'));
        await escrowSystem.sendRequestFunds(recipient.getSender(), toNano('0.01'));
        
        const releaseResult = await escrowSystem.sendReleaseFunds(deployer.getSender(), toNano('0.01'));
        
        expect(releaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: escrowSystem.address,
            success: true,
        });
    })
    it('should cancel escrow', async () => {
        const recipient = await blockchain.treasury('recipient');
        const tx = await escrowSystem.sendInitializeEscrow(deployer.getSender(), toNano('0.05'), recipient.address, toNano('0.02'));
        expect(tx.transactions).toHaveTransaction({
            from: deployer.address,
            to: escrowSystem.address,
            success: true,
        });
        
        const cancelResult = await escrowSystem.sendCancelEscrow(deployer.getSender(), toNano('0.01'));
        
        expect(cancelResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: escrowSystem.address,
            success: true,
        });
    });
});