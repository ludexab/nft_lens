import { ethers } from "ethers";
import { useState } from "react";
import axios from "axios";
import { MetaMaskSDK, MetaMaskSDKOptions } from "@metamask/sdk";

const App = () => {
  const [account, setAccount] = useState(String);
  const [connected, setConnected] = useState(false);
  const [view, setView] = useState(Array);
  const [explore, setExplore] = useState(Array);

  const options: MetaMaskSDKOptions = {
    injectProvider: false,
    dappMetadata: {},
  };

  const MMSDK = new MetaMaskSDK(options);

  const connectMobileWallet = async () => {
    // Get the Ethereum provider
    const ethereum = MMSDK.getProvider();

    // Check if MetaMask is available
    if (ethereum) {
      try {
        // Request user accounts
        const accounts: any = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setConnected(true);
        console.log("Connected to MetaMask. Accounts:", accounts);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask not available.");
    }
  };

  const ViewResult = ({
    name,
    symbol,
    token_address,
    contract_type,
    not_found,
    error,
  }: {
    name: string;
    symbol: string;
    token_address: string;
    contract_type: string;
    not_found: null;
    error: null;
  }) => {
    return (
      <div className="result">
        <p className="result">
          {error && !not_found && <span>{error}</span>}
          {not_found ? (
            <span>{not_found}</span>
          ) : (
            <>
              {!error && (
                <>
                  <span className="text-xl font-bold">Token name:</span>
                  <strong className="text-xl font-bold">{name}</strong> <br />
                  <span>Symbol:</span> {symbol} <br />
                  <span>Token Address:</span> {token_address} <br />
                  <span>Contract Type:</span> {contract_type} <br />
                </>
              )}
            </>
          )}
        </p>
      </div>
    );
  };
  const ExploreResult = ({
    name,
    amount,
    symbol,
    owner,
    token_address,
    contract_type,
    token_uri,
    not_found,
    error,
  }: {
    name: string;
    amount: string;
    owner: string;
    token_uri: string;
    symbol: string;
    token_address: string;
    contract_type: string;
    not_found: null;
    error: null;
  }) => {
    return (
      <div className="result">
        <p className="result" id="result-p">
          {error && !not_found && <span>{error}</span>}
          {not_found ? (
            <span>{not_found}</span>
          ) : (
            <>
              {!error && (
                <>
                  <span className="text-xl font-bold">Token name:</span>{" "}
                  <strong className="text-xl font-bold">{name}</strong> <br />
                  <span>Symbol:</span> {symbol} <br />
                  <span>Amount:</span> {amount} <br />
                  <span>Token Address:</span> {token_address} <br />
                  <span>Owner:</span> {owner} <br />
                  <span>Contract Type:</span> {contract_type} <br />
                  <span>Token URI:</span> {token_uri} <br />
                </>
              )}
            </>
          )}
        </p>
      </div>
    );
  };

  // const connectWallet = async () => {
  //   if (window.ethereum) {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const accounts = await provider.send("eth_requestAccounts", []);
  //     setConnected(true);
  //     setAccount(accounts[0]);
  //   } else {
  //     alert("Please install metamask");
  //   }
  // };

  const viewNft = async () => {
    const address = document.getElementById(
      "wallet-address"
    ) as HTMLInputElement;
    const network = document.getElementById(
      "wallet-network"
    ) as HTMLInputElement;

    const options = {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${address?.value}/nft/collections`,
      params: { chain: `${network?.value.toString()}` },
      headers: {
        accept: "application/json",
        "X-API-Key": import.meta.env.VITE_MORALIS_KEY,
      },
    };
    try {
      const request = await axios.request(options);
      if (request.data.result.length == 0) {
        setView([{ not_found: "Result Not Found" }]);
      } else {
        setView(request.data.result);
      }
    } catch (err) {
      console.log(err);
      setView([{ error: "Error, check details and try again." }]);
    }
  };

  const exploreNft = async () => {
    const address = document.getElementById("id-address") as HTMLInputElement;
    const network = document.getElementById("id-network") as HTMLInputElement;
    const tokenId = document.getElementById("token-id") as HTMLInputElement;

    const options = {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/nft/${address?.value}/${tokenId?.value}/owners`,
      params: { chain: `${network?.value}`, format: "decimal" },
      headers: {
        accept: "application/json",
        "X-API-Key": import.meta.env.VITE_MORALIS_KEY,
      },
    };
    try {
      const request = await axios.request(options);
      if (request.data.result.length == 0) {
        setExplore([{ not_found: "Result Not Found" }]);
      } else {
        setExplore(request.data.result);
      }
    } catch (err) {
      console.log(err);
      setExplore([{ error: "Error, check details and try again." }]);
    }
  };

  return (
    <>
      <header>
        <div className="header pb-3 gap-5">
          <h1 className="text-4xl font-bold">NFT Lens</h1>
          {connected ? (
            <div className="button-div">
              <button
                onClick={connectMobileWallet}
                className="connect-wallet"
              >{`${account.slice(0, 5)}...${account.slice(-4)}`}</button>
            </div>
          ) : (
            <div className="button-div">
              {/* <button onClick={connectWallet} className="connect-wallet">
                CONNECT WALLET
              </button> */}
              <button onClick={connectMobileWallet} className="connect-wallet">
                Mobile CONNECT
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="main-div w-full">
        <p>Search for NFTs you own, Explore NFTs !!</p>
        <div className="filter-div w-[80%] grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1">
          <div className="filter-id grid grid-cols-1 justify-items-center sm:w-full">
            <h1 className="text-2xl font-bold">Check your NFTs</h1>
            <input
              className="input"
              id="wallet-address"
              type="text"
              placeholder="Wallet Address"
              defaultValue={account}
            />
            <select name="Network" id="wallet-network" className="input">
              <option value="polygon">polygon</option>
              <option value="bsc">bsc</option>
              <option value="bsc testnet">bsc testnet</option>
              <option value="goerli">goerli</option>
              <option value="eth">etherum</option>
              <option value="cronos">cronos</option>
              <option value="cronos testnet">cronos testnet</option>
              <option value="avalanche">avalanche</option>
              <option value="avalanche testnet">avalanche testnet</option>
              <option value="mumbai">mumbai</option>
              <option value="fantom">fantom</option>
              <option value="sepolia">sepolia</option>
            </select>
            <button className="view-wallet" onClick={viewNft}>
              VIEW
            </button>
            {view.length != 0 && <hr className="hr" />}
            {view.map((obj: any, i) => {
              return (
                <ViewResult
                  key={i}
                  name={obj.name}
                  symbol={obj.symbol}
                  token_address={obj.token_address}
                  contract_type={obj.contract_type}
                  not_found={obj.not_found}
                  error={obj.error}
                />
              );
            })}
          </div>
          <div className="filter-wallet grid grid-cols-1 justify-items-center sm:w-full">
            <h1 className="text-2xl font-bold">Explore an NFT</h1>
            <input
              className="input"
              id="id-address"
              type="text"
              placeholder="NFT Contract Address"
            />
            <input
              className="input"
              id="token-id"
              type="number"
              placeholder="Token ID"
            />
            <select name="Network" id="id-network" className="input">
              <option value="polygon">polygon</option>
              <option value="bsc">bsc</option>
              <option value="bsc testnet">bsc testnet</option>
              <option value="goerli">goerli</option>
              <option value="eth">etherum</option>
              <option value="cronos">cronos</option>
              <option value="cronos testnet">cronos testnet</option>
              <option value="avalanche">avalanche</option>
              <option value="avalanche testnet">avalanche testnet</option>
              <option value="mumbai">mumbai</option>
              <option value="fantom">fantom</option>
              <option value="sepolia">sepolia</option>
            </select>
            <button className="view-id" onClick={exploreNft}>
              EXPLORE
            </button>
            {explore.length != 0 && <hr className="hr" />}
            {explore.map((obj: any, i) => {
              return (
                <ExploreResult
                  key={i}
                  name={obj.name}
                  symbol={obj.symbol}
                  token_address={obj.token_address}
                  contract_type={obj.contract_type}
                  owner={obj.owner_of}
                  amount={obj.amount}
                  token_uri={obj.token_uri}
                  not_found={obj.not_found}
                  error={obj.error}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
