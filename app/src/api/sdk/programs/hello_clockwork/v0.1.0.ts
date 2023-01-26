export type HelloClockwork = {
  "version": "0.1.0",
  "name": "hello_clockwork",
  "instructions": [
    {
      "name": "helloWorld",
      "accounts": [
        {
          "name": "helloThread",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ],
      "returns": {
        "defined": "clockwork_sdk::state::ThreadResponse"
      }
    }
  ],
  "metadata": {
    "address": "G6JvJ96AEUsjQYaRckUMb4xUCQg1N3Sqy8DTiYnD2nw7"
  }
}

export const IDL: HelloClockwork = {
  "version": "0.1.0",
  "name": "hello_clockwork",
  "instructions": [
    {
      "name": "helloWorld",
      "accounts": [
        {
          "name": "helloThread",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ],
      "returns": {
        "defined": "clockwork_sdk::state::ThreadResponse"
      }
    }
  ],
  "metadata": {
    "address": "G6JvJ96AEUsjQYaRckUMb4xUCQg1N3Sqy8DTiYnD2nw7"
  }
}
