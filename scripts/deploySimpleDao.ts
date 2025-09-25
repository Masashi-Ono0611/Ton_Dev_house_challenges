import { Address, toNano } from '@ton/core';
import { SimpleDao } from '../wrappers/SimpleDao';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const adminInput = process.env.ADMIN_ADDRESS ?? (await ui.input('Enter ADMIN_ADDRESS (EQ... / kQ...):'));
    const admin = Address.parse(adminInput);

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
