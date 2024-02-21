export const userInfo = new Map([
  [
    "alice",
    {
      password: "och3Euc6oor6ieC1",
      chatTo: [
        { id: "bob", label: "Bob" },
        { id: "charlie", label: "Charlie" },
      ],
      mucTo: [
        { id: "test", label: "Test" },
        { id: "ab", label: "Alice and Bob" },
        { id: "ac", label: "Alice and Charlie" },
        { id: "abc", label: "Alice, Bob and Charlie" },
      ],
    },
  ],
  [
    "bob",
    {
      password: "och3Euc6oor6ieC1",
      chatTo: [
        { id: "alice", label: "Alice" },
        { id: "charlie", label: "Charlie" },
      ],
      mucTo: [
        { id: "test", label: "Test" },
        { id: "ab", label: "Alice and Bob" },
        { id: "ac", label: "Bob and Charlie" },
        { id: "abc", label: "Alice, Bob and Charlie" },
      ],
    },
  ],
  [
    "charlie",
    {
      password: "och3Euc6oor6ieC1",
      chatTo: [
        { id: "alice", label: "Alice" },
        { id: "bob", label: "Bob" },
      ],
      mucTo: [
        { id: "test", label: "Test" },
        { id: "ac", label: "Alice and Charlie" },
        { id: "ac", label: "Bob and Charlie" },
        { id: "abc", label: "Alice, Bob and Charlie" },
      ],
    },
  ],
]);
