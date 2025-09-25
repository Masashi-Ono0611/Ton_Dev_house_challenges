import { Address, toNano } from '@ton/core';
import { EscrowSystem } from '../wrappers/EscrowSystem';
import { NetworkProvider } from '@ton/blueprint';

// EscrowSystem interaction script
// Usage examples:
//   npx blueprint run escrow
//   CONTRACT_ADDRESS=EQ... ACTION=view npx blueprint run escrow
//   CONTRACT_ADDRESS=EQ... ACTION=initialize RECIPIENT=EQ... AMOUNT_TON=1.5 npx blueprint run escrow
//   CONTRACT_ADDRESS=EQ... ACTION=request npx blueprint run escrow
//   CONTRACT_ADDRESS=EQ... ACTION=release npx blueprint run escrow
//   CONTRACT_ADDRESS=EQ... ACTION=cancel npx blueprint run escrow

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();

    // 1) Ask for contract address (or use env)
    const addrInput = process.env.CONTRACT_ADDRESS ?? (await ui.input('Enter contract address (EQ... / kQ...):'));
    const addr = Address.parse(addrInput);

    // Open contract instance
    const escrow = provider.open(EscrowSystem.createFromAddress(addr));

    // 2) Ask for action (or use env)
    const actionRaw = (process.env.ACTION ?? (await ui.input('Choose action (initialize/request/release/cancel/view):')))
        .trim()
        .toLowerCase();

    // Optional value to attach for gas
    const value = toNano(process.env.VALUE_TON ?? '0.05');

    if (actionRaw === 'view') {
        const [owner, recipient, amount, isReleased, isRequested] = await escrow.getEscrowDetails();
        console.log('Escrow details:');
        console.log('  owner     :', owner.toString());
        console.log('  recipient :', recipient.toString());
        console.log('  amount    :', amount.toString(), '(nanoTON)');
        console.log('  released  :', isReleased);
        console.log('  requested :', isRequested);
        console.log('Address:', addr.toString());
        return;
    }

    if (actionRaw === 'initialize') {
        const recInput = process.env.RECIPIENT ?? (await ui.input('Enter recipient address (EQ... / kQ...):'));
        const recipient = Address.parse(recInput);
        const amtTonInput = process.env.AMOUNT_TON ?? (await ui.input('Enter escrow amount in TON (e.g. 1.5):'));
        const amount = toNano(amtTonInput && amtTonInput.length > 0 ? amtTonInput : '0');

        await escrow.sendInitializeEscrow(provider.sender(), value, recipient, amount);
        console.log('InitializeEscrow sent');
        console.log('  recipient :', recipient.toString());
        console.log('  amount    :', amount.toString(), '(nanoTON)');
        console.log('Address:', addr.toString());
        return;
    }

    if (actionRaw === 'request') {
        await escrow.sendRequestFunds(provider.sender(), value);
        console.log('RequestFunds sent');
        console.log('Address:', addr.toString());
        return;
    }

    if (actionRaw === 'release') {
        await escrow.sendReleaseFunds(provider.sender(), value);
        console.log('ReleaseFunds sent');
        console.log('Address:', addr.toString());
        return;
    }

    if (actionRaw === 'cancel') {
        await escrow.sendCancelEscrow(provider.sender(), value);
        console.log('CancelEscrow sent');
        console.log('Address:', addr.toString());
        return;
    }

    throw new Error("Unknown action. Use one of: 'initialize', 'request', 'release', 'cancel', 'view'");
}
