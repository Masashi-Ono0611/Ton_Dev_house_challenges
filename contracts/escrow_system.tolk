tolk 1.1

struct EscrowSystem {
    queryId: uint32;
    owner: address;
    recipient: address;
    amount: uint64;
    isReleased: bool;
    isRequested: bool;
}

fun EscrowSystem.load() {
    return EscrowSystem.fromCell(contract.getData());
}
fun EscrowSystem.store(self) {
    contract.setData(EscrowSystem.toCell(self));
}

struct (0xE3D2C1B4) InitializeEscrow {
    queryId: uint32;
    recipient: address;
    amount: uint64;
}
struct (0xF4E3D2C1) RequestFunds {
    queryId: uint32;
}
struct (0xA1B2C3D4) ReleaseFunds {
    queryId: uint32;
}
struct (0xB1C2D3E4) CancelEscrow {
    queryId: uint32;
}

type MessageBody = (InitializeEscrow | RequestFunds | ReleaseFunds | CancelEscrow)

fun onInternalMessage(in: InMessage) {
    var escrow = lazy EscrowSystem.load();
    var s: slice = in.body;
    if (s.isEmpty()) {
        return;
    }
    val op = s.loadUint(32);
    if (op == 0xE3D2C1B4) { // InitializeEscrow
        assert (in.senderAddress == escrow.owner) throw 103;
        val _qid = s.loadUint(32);
        val rec = s.loadAddress();
        val amt = s.loadUint(64);
        escrow.recipient = rec;
        escrow.amount = amt;
        escrow.isReleased = false;
        escrow.isRequested = false;
        escrow.store();
    } else if (op == 0xF4E3D2C1) { // RequestFunds
        assert (in.senderAddress == escrow.recipient) throw 101;
        assert (!escrow.isRequested) throw 102;
        val _qid = s.loadUint(32);
        escrow.isRequested = true;
        escrow.store();
    } else if (op == 0xA1B2C3D4) { // ReleaseFunds
        assert (in.senderAddress == escrow.owner) throw 104;
        assert (escrow.isRequested) throw 108;
        assert (!escrow.isReleased) throw 109;
        val _qid = s.loadUint(32);
        escrow.isReleased = true;
        escrow.store();
    } else if (op == 0xB1C2D3E4) { // CancelEscrow
        assert (in.senderAddress == escrow.owner) throw 105;
        assert (!escrow.isReleased) throw 107;
        val _qid = s.loadUint(32);
        escrow.isReleased = true;
        escrow.store();
    } else {
        assert (false) throw 100;
    }
}

get fun getEscrowDetails(): (address, address, uint64 , bool, bool) {
    var escrow = lazy EscrowSystem.load();
    return (escrow.owner, escrow.recipient, escrow.amount, escrow.isReleased, escrow.isRequested);
}