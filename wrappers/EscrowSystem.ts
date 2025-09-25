import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type EscrowSystemConfig = {
    queryId:number,
    owner: Address,
};

export function escrowSystemConfigToCell(config: EscrowSystemConfig): Cell {
    return beginCell()
    .storeUint(config.queryId, 32)
    .storeAddress(config.owner)
    .storeAddress(new Address(0, Buffer.alloc(32))) 
    .storeUint(0, 64)
    .storeBit(false)
    .storeBit(false)
    .endCell();
}

export class EscrowSystem implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new EscrowSystem(address);
    }

    static createFromConfig(config: EscrowSystemConfig, code: Cell, workchain = 0) {
        const data = escrowSystemConfigToCell(config);
        const init = { code, data };
        return new EscrowSystem(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    async sendInitializeEscrow(provider: ContractProvider, via: Sender, value: bigint, recipient: Address, amount: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xE3D2C1B4, 32) // InitializeEscrow opcode
                .storeUint(0, 32)         // queryId field 
                .storeAddress(recipient)   // recipient field
                .storeUint(amount, 64)     // amount field
                .endCell(),
        });
    }
    async sendRequestFunds(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xF4E3D2C1, 32) // RequestFunds opcode
                .storeUint(0, 32)         // queryId field 
                .endCell(),
        });
    }
    async sendReleaseFunds(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xA1B2C3D4, 32) // ReleaseFunds opcode
                .storeUint(0, 32)         // queryId field
                .endCell(),
        });
    }
    async sendCancelEscrow(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xB1C2D3E4, 32) // CancelEscrow opcode
                .storeUint(0, 32)         // queryId field
                .endCell(),
        });
    }
    async getEscrowDetails(provider: ContractProvider):Promise<[Address, Address, bigint, boolean, boolean]> {
        const state = await provider.get("getEscrowDetails", []);
        return [
            state.stack.readAddress(),
            state.stack.readAddress(),
            state.stack.readBigNumber(),
            state.stack.readBoolean(),
            state.stack.readBoolean()
        ]
    }
}