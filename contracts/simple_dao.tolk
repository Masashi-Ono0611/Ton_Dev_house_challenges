/*
    Create a Simple DAO contract that allows user to vote yes or no
    The SimpleDao struct is the main storage of the contract.
    It contains:
    - queryId: uint32
    - yesVotes: uint32
    - noVotes: uint32
    - totalVotes: uint32

    The contract has 2 functionalities :
    - Record a vote
    - Reset the votes
    The contract has a yesVotes that is used to identify the yes votes.
    The contract has a noVotes that is used to identify the no votes.
    The contract has a totalVotes that is used to identify the total votes.

    There will be 2 structs :
    - RecordVote : This struct is used to record a vote.
    - ResetVotes : This struct is used to reset the votes.

    The struct definitions are :
    - RecordVote(queryId: uint32, vote: bool) : 0xF4A2B1C9
    - ResetVotes(queryId: uint32) : 0xD4E7B328

    There will be 1 getter function :
    - getVotes : This function is used to get the votes. (yesVotes, noVotes, totalVotes)

    Helpful Blueprint sdk commands:
    - npx blueprint build - To build the contract
    - npx blueprint test tests/SimpleDao.spec.ts - To test the contract
*/

tolk 1.1

// Simple DAO contract implemented in Tolk
// Storage layout must match wrappers/SimpleDao.ts (queryId, yesVotes, noVotes, totalVotes)
// Uses auto-packing and lazy loading per Tolk language guide

struct Storage {
    queryId: uint32
    yesVotes: uint32
    noVotes: uint32
    totalVotes: uint32
}

fun Storage.load(): Storage {
    return Storage.fromCell(contract.getData());
}

fun Storage.save(self) {
    contract.setData(self.toCell());
}

const OP_RECORD_VOTE = 0xF4A2B1C9; // RecordVote(queryId: uint32, vote: bool)
const OP_RESET_VOTES  = 0xD4E7B328; // ResetVotes(queryId: uint32)

fun onInternalMessage(in: InMessage) {
    // Body may be empty (e.g., deploy). No-op in that case
    if (in.body.isEmpty()) {
        return;
    }

    var st = Storage.load();
    var b = in.body;

    val op = b.loadUint(32);
    if (op == OP_RECORD_VOTE) {
        val qid = b.loadUint(32) as uint32;
        val vote = (b.loadUint(1) != 0); // read 1 bit as bool
        st.queryId = qid;
        if (vote) {
            st.yesVotes = (st.yesVotes + 1) as uint32;
        } else {
            st.noVotes = (st.noVotes + 1) as uint32;
        }
        st.totalVotes = (st.totalVotes + 1) as uint32;
        st.save();
        return;
    }

    if (op == OP_RESET_VOTES) {
        val qid = b.loadUint(32) as uint32;
        st.queryId = qid;
        st.yesVotes = 0;
        st.noVotes = 0;
        st.totalVotes = 0;
        st.save();
        return;
    }

    // Unknown op — simply ignore (no throw), to keep behavior permissive for tests
}

get fun getVotes(): (int, int, int) {
    val st = lazy Storage.load();
    // Return as ints; wrapper reads three numbers in order (yes, no, total)
    return (st.yesVotes, st.noVotes, st.totalVotes);
}
