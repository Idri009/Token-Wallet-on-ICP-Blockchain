import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// ICRC1 Ledger Interface (mock IDL)
const ICRC1_LEDGER_IDL = {
  icrc1_balance_of: {
    query: true,
    args: [{ name: 'account', type: { record: [{ name: 'owner', type: { principal: null } }] } }],
    rets: [{ type: { nat: null } }]
  },
  icrc1_transfer: {
    update: true,
    args: [{
      name: 'arg',
      type: {
        record: [
          { name: 'to', type: { record: [{ name: 'owner', type: { principal: null } }] } },
          { name: 'amount', type: { nat: null } },
          { name: 'fee', type: { opt: { nat: null } } },
          { name: 'memo', type: { opt: { blob: null } } },
          { name: 'from_subaccount', type: { opt: { blob: null } } },
          { name: 'created_at_time', type: { opt: { nat64: null } } }
        ]
      }
    }],
    rets: [{ type: { variant: { Ok: { nat: null }, Err: { record: [{ name: 'message', type: { text: null } }] } } } }]
  },
  icrc1_metadata: {
    query: true,
    args: [],
    rets: [{ type: { vec: { record: [{ name: 'key', type: { text: null } }, { name: 'value', type: { variant: { Text: { text: null }, Nat: { nat: null }, Int: { int: null }, Blob: { blob: null } } } }] } } }]
  },
  icrc1_name: {
    query: true,
    args: [],
    rets: [{ type: { text: null } }]
  },
  icrc1_symbol: {
    query: true,
    args: [],
    rets: [{ type: { text: null } }]
  },
  icrc1_total_supply: {
    query: true,
    args: [],
    rets: [{ type: { nat: null } }]
  },
  icrc1_minting_account: {
    query: true,
    args: [],
    rets: [{ type: { opt: { record: [{ name: 'owner', type: { principal: null } }] } } }]
  },
  icrc1_fee: {
    query: true,
    args: [],
    rets: [{ type: { nat: null } }]
  }
};

class ICRC1Service {
  constructor(canisterId, identity) {
    this.canisterId = canisterId;
    this.identity = identity;
    this.agent = new HttpAgent({
      identity: this.identity,
      host: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:4943' : 'https://ic0.app'
    });

    this.actor = Actor.createActor(ICRC1_LEDGER_IDL, {
      agent: this.agent,
      canisterId: this.canisterId
    });
  }

  // Get account balance
  async getBalance(owner) {
    try {
      const account = { owner: Principal.fromText(owner) };
      const balance = await this.actor.icrc1_balance_of(account);
      return balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  // Transfer tokens
  async transfer(to, amount, fee = null, memo = null) {
    try {
      const transferArgs = {
        to: { owner: Principal.fromText(to) },
        amount: BigInt(amount),
        fee: fee ? { Some: BigInt(fee) } : { None: null },
        memo: memo ? { Some: new TextEncoder().encode(memo) } : { None: null },
        from_subaccount: { None: null },
        created_at_time: { None: null }
      };

      const result = await this.actor.icrc1_transfer(transferArgs);
      
      if ('Ok' in result) {
        return { success: true, blockIndex: result.Ok };
      } else {
        return { success: false, error: result.Err.message };
      }
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }

  // Get token metadata
  async getMetadata() {
    try {
      const metadata = await this.actor.icrc1_metadata();
      return metadata;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  }

  // Get token name
  async getName() {
    try {
      const name = await this.actor.icrc1_name();
      return name;
    } catch (error) {
      console.error('Error fetching name:', error);
      throw error;
    }
  }

  // Get token symbol
  async getSymbol() {
    try {
      const symbol = await this.actor.icrc1_symbol();
      return symbol;
    } catch (error) {
      console.error('Error fetching symbol:', error);
      throw error;
    }
  }

  // Get total supply
  async getTotalSupply() {
    try {
      const totalSupply = await this.actor.icrc1_total_supply();
      return totalSupply;
    } catch (error) {
      console.error('Error fetching total supply:', error);
      throw error;
    }
  }

  // Get minting account
  async getMintingAccount() {
    try {
      const mintingAccount = await this.actor.icrc1_minting_account();
      return mintingAccount;
    } catch (error) {
      console.error('Error fetching minting account:', error);
      throw error;
    }
  }

  // Get transfer fee
  async getFee() {
    try {
      const fee = await this.actor.icrc1_fee();
      return fee;
    } catch (error) {
      console.error('Error fetching fee:', error);
      throw error;
    }
  }

  // Format balance with proper decimals
  formatBalance(balance, decimals = 8) {
    const divisor = Math.pow(10, decimals);
    return Number(balance) / divisor;
  }

  // Parse balance to proper format
  parseBalance(amount, decimals = 8) {
    const multiplier = Math.pow(10, decimals);
    return BigInt(Math.floor(amount * multiplier));
  }
}

export default ICRC1Service;
