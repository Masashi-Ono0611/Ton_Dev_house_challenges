import { Address, toNano } from '@ton/core';
import { SimpleDao } from '../wrappers/SimpleDao';
import { NetworkProvider } from '@ton/blueprint';

// Reset vote counts script (clears yes/no/total)
// Usage (interactive):
//   npx blueprint run resetVotes
// Optional env overrides:
//   CONTRACT_ADDRESS=EQ... QUERY_ID=123 npx blueprint run resetVotes

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    // 1) Ask for address (or use env)
    const addrInput = process.env.CONTRACT_ADDRESS ?? (await ui.input('Enter contract address (EQ... / kQ...):'));
    const addr = Address.parse(addrInput);

    // 2) Ask for queryId (or use current timestamp)
    const queryIdInput = process.env.QUERY_ID ?? (await ui.input('Enter queryId (blank = use current timestamp):'));
    const queryId = queryIdInput && queryIdInput.length > 0
        ? Number(queryIdInput)
        : Math.floor(Date.now() / 1000);

    const simpleDao = provider.open(SimpleDao.createFromAddress(addr));

    // Read current votes BEFORE sending the transaction
    const [yesBefore, noBefore, totalBefore] = await simpleDao.getVotes();
    console.log('Current votes BEFORE reset transaction:');
    console.log('Votes => yes:', yesBefore, ' no:', noBefore, ' total:', totalBefore);

    // Send the reset
    const value = toNano('0.05');
    await simpleDao.sendResetVotes(provider.sender(), value, queryId);

    console.log('Sent reset');
    console.log('queryId:', queryId);
    console.log('Address:', addr.toString());
}
