import { Address, toNano } from '@ton/core';
import { SimpleDao } from '../wrappers/SimpleDao';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // Auto-set admin to the wallet used to deploy
    const sender = provider.sender() as any;
    const admin: Address | undefined = sender.address as Address | undefined;
    if (!admin) {
        throw new Error('Sender address is not available. Please ensure your wallet is connected.');
    }

    const simpleDao = provider.open(
        SimpleDao.createFromConfig(
            { queryId: 0, admin }, // initial config with admin
            await compile('SimpleDao')
        )
    );

    await simpleDao.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(simpleDao.address);

    // run methods on `simpleDao`
}
