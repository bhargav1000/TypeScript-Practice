import process from "node:process";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { 
    type SS58String, 
    createClient, 
    type PolkadotClient } from "polkadot-api";
import { dot, people, collectives } from "@polkadot-api/descriptors";

function makeClient(endpoint: string): PolkadotClient {
  console.log(`Connecting to endpoint: ${endpoint}`);
  const provider = getWsProvider(endpoint);
  const client = createClient(provider);
  return client;
}

async function printChainInfo(client: PolkadotClient) {
    const chainSpec = await client.getChainSpecData();
    const finalizedBlock = await client.getFinalizedBlock();

    console.log(
        `Connected to ${chainSpec.name} at block ${finalizedBlock.number}.\n`
      );
}

async function getBalance(
    polkadotClient: PolkadotClient,
    address: SS58String): Promise<BigInt> {
        const dotApi = polkadotClient.getTypedApi(dot);
        const accountInfo = await dotApi.query.System.Account.getValue(address);
        const { free, reserved } = accountInfo.data;
        return free + reserved;
}

async function getDisplayName(peopleClient: PolkadotClient,
    address: SS58String): Promise<string | undefined> {
        const peopleApi = peopleClient.getTypedApi(people);

        const accountInfo = await peopleApi.query.Identity.IdentityOf.getValue(address);
        const displayName = accountInfo?.[0].info.display.value?.asText();
        return displayName;
}

interface FellowshipMember {
    address: SS58String;
    rank: number;
}

async function getFellowshipMembers(collectivesClient: PolkadotClient): Promise<FellowshipMember[]> {
    const collectivesApi = collectivesClient.getTypedApi(collectives);
    const rawMembers = await collectivesApi.query.FellowshipCollective.Members.getEntries();
    const data = rawMembers.map((m) => {
        return { address: m.keyArgs[0], rank: m.value};
    });
    return data;
}

async function main() {
    const polkadotClient = makeClient("wss://rpc.polkadot.io");
    console.log({ polkadotClient });

    const peopleClient = makeClient("wss://polkadot-people-rpc.polkadot.io");
    await printChainInfo(peopleClient);

    const collectivesClient = makeClient("wss://polkadot-collectives-rpc.polkadot.io");
    await printChainInfo(collectivesClient);

    const members = await getFellowshipMembers(collectivesClient);

    console.log("Generating table...");
    const table: string[] = [];
    for (const { address, rank } of members) {
        const balance = await getBalance(polkadotClient, address);
        const displayName = await getDisplayName(peopleClient, address);
        table.push({ rank, displayName, address, balance });
    }

    table.sort((a, b) => b.rank - a.rank);
    console.table(table);


    // const address: string = "15DCZocYEM2ThYCAj22QE4QENRvUNVrDtoLBVbCm5x4EQncr";
    // const balance = await getBalance(polkadotClient, address);

    // const display = await getDisplayName(peopleClient, address);
    // console.log(`
    //     Display Name: ${display}
    //     Address: ${address} has Balance: ${balance}
    //     `);

    console.log(`Done!`);
    process.exit(0);
}

main();