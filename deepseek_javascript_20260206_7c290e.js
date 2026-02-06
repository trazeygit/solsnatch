const hre = require("hardhat");
async function main() {
  const MaliciousDrainer = await hre.ethers.getContractFactory("MaliciousDrainer");
  const drainer = await MaliciousDrainer.deploy();
  await drainer.deployed();
  console.log("Drainer deployed to:", drainer.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});