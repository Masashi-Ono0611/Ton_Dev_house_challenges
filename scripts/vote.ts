import { Address, toNano } from '@ton/core';
import { SimpleDao } from '../wrappers/SimpleDao';
import { NetworkProvider } from '@ton/blueprint';

// Unified voting script: choose YES or NO from CLI
// Usage:
//   npx blueprint run vote
// Optional env overrides:
//   CONTRACT_ADDRESS=EQ... QUERY_ID=123 CHOICE=yes|no npx blueprint run vote

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    // 1) Ask for address (or use env)
    const addrInput = process.env.CONTRACT_ADDRESS ?? (await ui.input('Enter contract address (EQ... / kQ...):'));
    const addr = Address.parse(addrInput);

    // 2) Ask for choice yes/no (or use env)
    const choiceRaw = (process.env.CHOICE ?? (await ui.input('Vote choice (yes/no):'))).trim().toLowerCase();
    if (choiceRaw !== 'yes' && choiceRaw !== 'no') {
        throw new Error("Invalid choice. Enter 'yes' or 'no'.");
    }
    const isYes = choiceRaw === 'yes';

    // 3) Ask for queryId (or use current timestamp)
    const queryIdInput = process.env.QUERY_ID ?? (await ui.input('Enter queryId (blank = use current timestamp):'));
    const queryId = queryIdInput && queryIdInput.length > 0
        ? Number(queryIdInput)
        : Math.floor(Date.now() / 1000);

    const simpleDao = provider.open(SimpleDao.createFromAddress(addr));

    // Read current votes BEFORE sending the transaction
    const [yesBefore, noBefore, totalBefore] = await simpleDao.getVotes();
    console.log('Current votes BEFORE transaction:');
    console.log('Votes => yes:', yesBefore, ' no:', noBefore, ' total:', totalBefore);

    // Send the vote
    const value = toNano('0.05');
    await simpleDao.sendVote(provider.sender(), value, queryId, isYes);

    console.log(`Sent vote: ${isYes ? 'YES' : 'NO'}`);
    console.log('queryId:', queryId);
    console.log('Address:', addr.toString());
}
