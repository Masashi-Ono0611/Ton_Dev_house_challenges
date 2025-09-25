import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type SimpleDaoConfig = {
    queryId: number;
    admin: Address;
};

export function simpleDaoConfigToCell(config: SimpleDaoConfig): Cell {
    return beginCell()
        .storeUint(config.queryId, 32)
        .storeUint(0, 32) // yesVotes
        .storeUint(0, 32) // noVotes
        .storeUint(0, 32) // totalVotes
        .storeAddress(config.admin) // admin
        .endCell();
}

export class SimpleDao implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SimpleDao(address);
    }

    static createFromConfig(config: SimpleDaoConfig, code: Cell, workchain = 0) {
        const data = simpleDaoConfigToCell(config);
        const init = { code, data };
        return new SimpleDao(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendVote(provider: ContractProvider, via: Sender, value: bigint, queryId: number, vote: boolean) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xF4A2B1C9, 32) // RecordVote opcode
                .storeUint(queryId, 32)    // queryId field
                .storeBit(vote)            // vote field (bool)
                .endCell(),
        });
    }

    async sendResetVotes(provider: ContractProvider, via: Sender, value: bigint, queryId: number) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xD4E7B328, 32) // ResetVotes opcode
                .storeUint(queryId, 32)    // queryId field
                .endCell(),
        });
    }

    async getVotes(provider: ContractProvider): Promise<[number, number, number]> {
        const result = await provider.get('getVotes', []);
        return [
            result.stack.readNumber(), // yesVotes
            result.stack.readNumber(), // noVotes
            result.stack.readNumber()  // totalVotes
        ];
    }
}