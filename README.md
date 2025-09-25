# TON Dev House Telegram Mini App
Telegram Mini App for DAO Voting is available at:
https://t.me/TonDevHOUSE_Masa_bot

<img width="397" height="692" alt="Image" src="https://github.com/user-attachments/assets/7731f77b-f674-4141-be49-54992fae5b71" />

The source code is public at:
https://github.com/Masashi-Ono0611/Ton_Dev_house_miniapp

## Escrow System Contract

This repository includes an Escrow System contract that enables secure fund management between owners and recipients through the scripts.

### Key Features

- **Secure fund management**: Funds are held in escrow until conditions are met
- **Role-based access**: Only owners can release or cancel escrow, only recipients can request funds


## DAO Voting Contract

This repository includes a DAO Voting contract that allows users to vote yes or no through the Telegram Mini App (or scripts).

### Key Features

- **Admin-controlled reset**: Admin address is stored in contract storage, allowing only the admin to reset votes
- **Transaction safety**: Uses queryId to prevent transaction conflicts and ensure vote integrity
- **Permissive design**: Unknown operations are ignored rather than throwing errors, making it more robust for testing and production