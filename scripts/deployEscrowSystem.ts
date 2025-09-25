import { Address, toNano } from '@ton/core';
import { EscrowSystem } from '../wrappers/EscrowSystem';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const sender = provider.sender() as any;
    const owner: Address | undefined = sender.address as Address | undefined;
    if (!owner) {
        throw new Error('Sender address is not available. Please ensure your wallet is connected.');
    }

    const escrowSystem = provider.open(
        EscrowSystem.createFromConfig(
            { queryId: 0, owner },
            await compile('EscrowSystem')
        )
    );

    await escrowSystem.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(escrowSystem.address);

    // run methods on `escrowSystem`
}