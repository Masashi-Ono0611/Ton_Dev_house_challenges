import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tolk',
    entrypoint: 'contracts/escrow_system.tolk',
    withStackComments: true,
    withSrcLineComments: true,
    experimentalOptions: '',
};
