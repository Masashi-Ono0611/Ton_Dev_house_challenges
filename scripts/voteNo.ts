import { Address, toNano } from '@ton/core';
import { SimpleDao } from '../wrappers/SimpleDao';
import { NetworkProvider } from '@ton/blueprint';

// Usage:
// CONTRACT_ADDRESS=EQ... QUERY_ID=2 npx blueprint run voteNo
// If QUERY_ID is not provided, current unix time will be used.

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const addrInput = process.env.CONTRACT_ADDRESS ?? (await ui.input('Enter contract address (EQ... / kQ...):'));
    const addr = Address.parse(addrInput);

    const queryIdInput = process.env.QUERY_ID ?? (await ui.input('Enter queryId (blank = use current timestamp):'));
    const queryId = queryIdInput && queryIdInput.length > 0
        ? Number(queryIdInput)
        : Math.floor(Date.now() / 1000);

    const simpleDao = provider.open(SimpleDao.createFromAddress(addr));

    // Send a NO vote
    const value = toNano('0.05');
    await simpleDao.sendVote(provider.sender(), value, queryId, false);

    // Read back votes
    const [yesVotes, noVotes, totalVotes] = await simpleDao.getVotes();

    console.log('Voted NO');
    console.log('queryId:', queryId);
    console.log('Address:', addr.toString());
    console.log('Votes => yes:', yesVotes, ' no:', noVotes, ' total:', totalVotes);
}
