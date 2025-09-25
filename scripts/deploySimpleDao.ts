import { toNano } from '@ton/core';
import { SimpleDao } from '../wrappers/SimpleDao';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const simpleDao = provider.open(
        SimpleDao.createFromConfig(
            { queryId: 0 }, // initial config
            await compile('SimpleDao')
        )
    );

    await simpleDao.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(simpleDao.address);

    // run methods on `simpleDao`
}
