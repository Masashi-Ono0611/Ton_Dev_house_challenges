# TON Dev House Challenge Repository

Welcome to the TON Dev House Challenge! This repository contains **2 smart contract challenges** designed to test your Tolk programming skills on the TON blockchain.

## 🏆 Prize Pool: $1000

Compete for a share of the **$1000 prize pool** by successfully completing these challenges!

## 📋 Challenge Overview

This repository contains two distinct challenges, each focusing on different aspects of TON smart contract development:

### Challenge 1: EscrowSystem Contract (`contracts/escrow_system.tolk`)

**Task**: Fix the errors in the EscrowSystem contract and make it work as expected.

**Description**: 
The EscrowSystem contract allows users to:
- Initialize an escrow
- Request funds 
- Release funds
- Cancel escrow

**Contract Storage (`EscrowSystem` struct)**:
- `owner: address` - The owner of the escrow
- `recipient: address` - The recipient of the escrow funds
- `amount: uint64` - The amount held in escrow
- `isReleased: bool` - Whether the funds have been released
- `isRequested: bool` - Whether the recipient has requested the funds

**Your Goal**: Debug and fix all issues in the contract to ensure all test cases pass.

### Challenge 2: SimpleDAO Contract (`contracts/simple_dao.tolk`)

**Task**: Create a Simple DAO contract that allows users to vote yes or no.

**Description**:
Build a voting contract from scratch with the following functionality:
- Record votes (yes/no)
- Reset all votes
- Track vote counts

**Contract Storage (`SimpleDao` struct)**:
- `queryId: uint32` - Query identifier
- `yesVotes: uint32` - Count of yes votes
- `noVotes: uint32` - Count of no votes  
- `totalVotes: uint32` - Total vote count

**Required Message Structures**:
- `RecordVote(queryId: uint32, vote: bool)` - Opcode: `0xF4A2B1C9`
- `ResetVotes(queryId: uint32)` - Opcode: `0xD4E7B328`

**Required Getter Function**:
- `getVotes()` - Returns `(yesVotes, noVotes, totalVotes)`

##  Blueprint SDK Commands

### Building Contracts
```bash
# Build all contracts
npx blueprint build

```

### Testing Contracts
```bash
# Test EscrowSystem contract
npx blueprint test tests/EscrowSystem.spec.ts

# Test SimpleDAO contract  
npx blueprint test tests/SimpleDao.spec.ts

# Test all contracts
npx blueprint test
```

### Create new Contract
```bash
# Create a new contract
npx blueprint create ContractName

```

##  Repository Structure

```
/
├── contracts/
│   ├── escrow_system.tolk    # Challenge 1: Fix the escrow contract
│   └── simple_dao.tolk       # Challenge 2: Implement DAO voting
├── tests/
│   ├── EscrowSystem.spec.ts  # Test cases for escrow contract
│   └── SimpleDao.spec.ts     # Test cases for DAO contract
├── scripts/
│   ├── deployEscrowSystem.ts # Deployment script for escrow
│   └── deploySimpleDao.ts    # Deployment script for DAO
├── wrappers/
│   ├── EscrowSystem.ts       # TypeScript wrapper for escrow
│   └── SimpleDao.ts          # TypeScript wrapper for DAO
└── build/                    # Compiled contract outputs
```

## Getting Started

1. **Fork this repository**
   
2. **Clone that repository**
   ```bash
   git clone <repository-url>
   cd Ton_Dev_house_challenges
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start with Challenge 1**
   ```bash
   # Run tests to see what needs fixing
   npx blueprint test tests/EscrowSystem.spec.ts
   ```

5. **Move to Challenge 2**
   ```bash
   # Implement the SimpleDAO contract
   # Then test your implementation
   npx blueprint test tests/SimpleDao.spec.ts
   ```

## ✅ Success Criteria

### Challenge 1 (EscrowSystem)
- [ ] All compilation errors fixed
- [ ] All test cases pass
- [ ] Contract functionality works as expected:
  - [ ] Escrow initialization
  - [ ] Fund requests by recipients
  - [ ] Fund release by owners
  - [ ] Escrow cancellation

### Challenge 2 (SimpleDAO)
- [ ] Contract compiles successfully
- [ ] All test cases pass
- [ ] Voting functionality implemented:
  - [ ] Record yes/no votes
  - [ ] Reset vote counts
  - [ ] Accurate vote tracking
- [ ] Getter function returns correct vote counts

## Development Tips

- **Tolk Language**: These contracts use Tolk 1.1, TON's new smart contract language
- **Testing**: Use the provided test files to validate your implementations
- **Blueprint**: Leverage Blueprint's tools for efficient development and deployment
- **Documentation**: Refer to [TON Documentation](https://docs.ton.org/) for additional guidance

## Submission

Ensure both challenges are completed and all tests pass before submission. Good luck!
Make sure you have everything before submission:
1. Github fork url of this repo
2. Screenshot of test cases passed 
3. Name the image file as - FirstName_LastName_Tests
4. TON wallet address of mainnet
5. Telegram Username
   
To submit, fill the form given below
[TON Dev House Submission Form](https://forms.gle/67Pswe6V5FmSWjYE9)

---

**Happy coding and may the best developer win! 🚀**

hello