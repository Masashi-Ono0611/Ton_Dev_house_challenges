# Tolk Language Overview

Tolk is a next-generation language for developing smart contracts on TON. It replaces FunC with an expressive syntax, a robust type system, and built-in serialization — while generating highly optimized assembly code.

This page introduces Tolk's core features, explains how it compares to FunC, and outlines how to get started with the language — whether you're migrating from FunC or writing smart contracts from scratch.

## Why Choose Tolk

1. **Clean, expressive syntax** inspired by TypeScript and Rust
2. **Built-in primitives for TON**, including auto-packed structs, pattern matching, and first-class message handling
3. **Strong static type system** with null safety, type aliases, union types, and generics for safer, clearer code
4. **Gas-efficient by design** — see benchmarks and comparison; features like lazy loading can reduce costs
5. **Low-level control** is available when needed, with direct access to the TVM stack and instructions

## Getting Started with Tolk

If you're starting with Tolk, follow these steps:

1. Explore the [TON smart contract documentation](https://docs.ton.org/v3/documentation/smart-contracts/overview) to learn the fundamentals

2. Set up your first Tolk counter project:
   ```bash
   npm create ton@latest
   ```

3. Follow the [step-by-step guide](https://docs.ton.org/v3/documentation/smart-contracts/tolk/counter-smart-contract) to build a counter contract

4. Read the [Tolk language guide](https://docs.ton.org/v3/documentation/smart-contracts/tolk/language-guide) for a high-level overview of the language

5. Continue exploring the documentation. When you come across FunC or Tact code, compare it to its Tolk equivalent — you'll often find it's cleaner and more declarative

## How to Migrate from FunC

If you've written contracts in FunC, migrating to Tolk is straightforward — and often results in simpler, more maintainable code.

1. Try building a basic contract in Tolk — for example, a counter using `npm create ton@latest`. You'll quickly notice the shift from stack logic to expressive constructs with structured types, unions, pattern matching, toCell(), and more

2. Explore the [Tolk vs FunC benchmarks](https://github.com/ton-blockchain/tolk-bench). These are real-world contracts (Jetton, NFT, Wallet, etc.) migrated from FunC — same logic, but expressed in a cleaner, more expressive style

3. Read [Tolk vs FunC: in short](https://docs.ton.org/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short) for a quick comparison of syntax and concepts

4. Use the [FunC-to-Tolk converter](https://github.com/ton-blockchain/convert-func-to-tolk) to migrate existing codebases incrementally

### Example of a Basic Tolk Smart Contract

```tolk
import "utils"

struct Storage {
    counter: int32
}

fun Storage.load() {
    return Storage.fromCell(contract.getData());
}

fun onInternalMessage(in: InMessage) {
    // Message handling logic here
}

get fun currentCounter(): int {
    val storage = lazy Storage.load();
    return storage.counter;
}
```

Compare this with the equivalent FunC code:

```func
#include "utils.fc";

global int ctx_counter;

int load_data() impure {
    slice cs = get_data().begin_parse();
    ctx_counter = cs~load_uint(32);
}

() recv_internal(int msg_value, cell msg_full, slice msg_body) impure {
    slice cs = msg_full.begin_parse();
    int flags = cs~load_uint(4);
    if (flags & 1) {
        return ();
    }
    // ... more logic
}

int currentCounter() method_id {
    load_data(); ;; fills global variables
    return ctx_counter;
}
```

## Tooling Around Tolk

A set of tools is available to support development with Tolk — including IDE support, language services, and migration utilities.

- [JetBrains IDE plugin](https://github.com/ton-blockchain/intellij-ton)
- [VS Code extension](https://marketplace.visualstudio.com/items?itemName=ton-core.vscode-ton)
- [Language server](https://github.com/ton-blockchain/ton-language-server)
- [FunC-to-Tolk converter](https://github.com/ton-blockchain/convert-func-to-tolk)
- [tolk-js](https://github.com/ton-blockchain/tolk-js)

The Tolk compiler itself lives in the [ton repository](https://github.com/ton-blockchain/ton).

## Is Tolk Production-Ready?

All contracts in the [Tolk vs FunC benchmarks](https://github.com/ton-blockchain/tolk-bench) pass the same test suites as their FunC counterparts — with identical logic and behavior.

Tolk is under active development, and some edge cases may still occur. Evaluate it for your use case and ensure thorough testing before production deployment.

Regardless of the language, well-tested code is the key to building reliable smart contracts.

## Issues and Contacts

If you encounter an issue, please connect with the developer community on TON Dev chats or create a [GitHub issue](https://github.com/ton-community/ton-docs/issues).

## See Also

- [Tolk vs FunC: in short](https://docs.ton.org/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short)
- [Environment setup](https://docs.ton.org/v3/documentation/smart-contracts/tolk/environment-setup)
- [Counter smart contract tutorial](https://docs.ton.org/v3/documentation/smart-contracts/tolk/counter-smart-contract)
- [Tolk language guide](https://docs.ton.org/v3/documentation/smart-contracts/tolk/language-guide)

---

*This documentation is based on the official TON documentation and is intended for educational purposes.*
